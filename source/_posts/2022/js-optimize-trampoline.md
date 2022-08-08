---
title: JS 递归速度优化 & 堆栈异常优化
date: 2022-07-25 16:44:20
tags: optimize
---

### 为什么会发生堆栈异常

JS 执行时遇到新的执行函数的时候就会把需要执行的函数压入堆栈，函数执行完成之后会退栈释放对应的内存空间。
如果压入的函数数量过多，就会造成：

{% asset_img stack.png Maximum call stack size exceeded %}

### 复现异常

先简单复现一下怎么造成堆栈异常

```javascript
function stack(n) {
  if (n === 1) {
    return 1;
  }
  return stack(n - 1);
}
stack(100000);
```

打断点看一下堆栈调用情况
{% asset_img  stack-1.jpg  堆栈溢出 %}

随着递归次数的增多，stack 函数一直在压入堆栈，然后超过浏览器堆栈数量上限（貌似不同平台不同版本会有些差异），直接 GG。

### 实例研究

我们就以经典的 Fibonacci 求值举例，做一次优化

#### 递归实现 Fibonacci 数列求值

用递归实现计算一下第 100 位的 Fibonacci 的值，顺带计算一下执行时间。

代码如下：

```javascript
function fibonacci(n) {
  if (n === 0 || n === 1) {
    return 1;
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.time("fibonacci");
console.log(fibonacci(100));
console.timeEnd("fibonacci");
```

WTF，我的机器配置 `Intel i7-10700 2.90GHz` + `16GB` 跑了能有 2 分钟还没出来，
CPU 一直在 10% 左右。

降低一下标准，计算一下第 45 位的 Fibonacci 的值，顺带计算一下执行时间。  
（降到 50 都算的时间很长，45 终于是有结果输出了）

```javascript
function fibonacci(n) {
  if (n === 0 || n === 1) {
    return 1;
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.time("fibonacci");
console.log(fibonacci(45));
console.timeEnd("fibonacci");
```

{% asset_img  fibonacci-1.png  斐波那契数列输出 %}

差不多 10S 输出结果，Emm，属实有点拉跨。

#### 优化的点分析

上面的递归 Fibonacci 存在一个严重的问题 **重复计算太多了**，  
计算 fibonacci(5) 就需要计算 fibonacci(4)、fibonacci(3)、fibonacci(2)、fibonacci(1)，然后这一轮里计算 fibonacci(4) 就又要计算 fibonacci(3)、fibonacci(2)、fibonacci(1)，然后依此类推，CPU 占比那么高不是没有理由的。

可以做一下统计，稍微改动一下代码

```javascript
let count = 0;
function fibonacci(n) {
  count++;
  if (n === 0 || n === 1) {
    return 1;
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.time("fibonacci");
console.log(fibonacci(45));
console.timeEnd("fibonacci");
console.log(`the number of exec count is ${count}`);
```

看一下结果输出
{% asset_img  fibonacci-count-45.png  斐波那契数列输出 %}

fibonacci(45) 已经 10 亿级别的计算量了。

有一个优化的点就是我们可以把重复计算部分去掉

##### 优化一: 去除重复计算

```Math
fibonacci(3) = fibonacci(2) + fibonacci(1)
```

我们计算 fibonacci(4) 的时候，可以把 fibonacci(3) 跟 fibonacci(2) 的值带上，这样就不用重复计算了。

然后代码如下：

```javascript
let count = 0;
function fibonacci(n) {
  if (n === 0 || n === 1) {
    return 1;
  }

  /**
   * @param n2  当前计算数的前面第二个值
   * @param n1   当前计算数的前一个值
   * @param flag  当前计算到第几位
   * **/
  function fibonacci_inner(n2, n1, flag) {
    count++;
    if (flag === n) {
      return n1 + n2;
    }
    return fibonacci_inner(n1, n1 + n2, flag + 1);
  }
  //从第二位开始计算
  return fibonacci_inner(1, 1, 2);
}

console.time("fibonacci");
console.log(fibonacci(45));
console.timeEnd("fibonacci");
console.log(`the number of exec count is ${count}`);
```

每次递归都会带上前两次值的结果，最终只需要输出前两次结果的和就行。  
看一下结果输出：

{% asset_img  fibonacci-count-45-optimize.png  斐波那契优化一 %}

快的不是一点半点，从 `29019ms` 到 `0.083ms` 的提升。 而且也只计算了每个数各自的结果，没有重复计算。

然后我们多计算几组值

```json
fibonacci(100)
the result is 573147844013817200000
fibonacci: 0.078857421875 ms
the number of exec count is 99

fibonacci(1000)
the result is 7.0330367711422765e+208
fibonacci: 0.1318359375 ms
the number of exec count is 999

fibonacci(5000)
the result is Infinity
fibonacci: 0.325927734375 ms
the number of exec count is 4999
```

到 fibonacci(5000) 时，结果已经超过 js Number 类型能表示的数量的最大上限 `2^53 -1`，  
我们再改动一下代码, 使用 [Bigint](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/BigInt)

```javascript
let count = 0;
function fibonacci(n) {
  if (n === 0 || n === 1) {
    return 1;
  }

  /**
   * @param n2  当前计算数的前面第二个值
   * @param n1   当前计算数的前一个值
   * @param flag  当前计算到第几位
   * **/
  function fibonacci_inner(n2, n1, flag) {
    count++;
    if (flag === n) {
      return BigInt(n1 + n2);
    }
    return fibonacci_inner(BigInt(n1), BigInt(n1 + n2), flag + 1);
  }
  //从第二位开始计算
  return fibonacci_inner(1, 1, 2);
}

console.time("fibonacci");
console.log(`the result is ${BigInt(fibonacci(5000))}`);
console.timeEnd("fibonacci");
console.log(`the number of exec count is ${count}`);
```

结果为

```json
the result is 6276302800488957086035253108349684055478528702736457439025824448927937256811663264475883711527806250329984690249846819800648580083040107584710332687596562185073640422286799239932615797105974710857095487342820351307477141875012176874307156016229965832589137779724973854362777629878229505500260477136108363709090010421536915488632339240756987974122598603591920306874926755600361865354330444681915154695741851960071089944015319300128574107662757054790648152751366475529121877212785489665101733755898580317984402963873738187000120737824193162011399200547424034440836239726275765901190914513013217132050988064832024783370583789324109052449717186857327239783000020791777804503930439875068662687670678802914269784817022567088069496231111407908953313902398529655056082228598715882365779469902465675715699187225655878240668599547496218159297881601061923195562143932693324644219266564617042934227893371179832389642895285401263875342640468017378925921483580111278055044254198382265567395946431803304304326865077742925818757370691726168228648841319231470626
fibonacci: 3.984130859375 ms
the number of exec count is 4999
```

那我们计算 fibonacci(10000) 怎样？
然后是

> Maximum call stack size exceeded

又超过堆栈上限了，所以我们需要在做一次优化

##### 优化二: 防止递归超过堆栈上限

这个时候需要用到一个思路，就是把递归时递归的函数暴露出来，交给外面去执行，把递归变成循环同步执行。  
所以我们会用到一个 js 函数 [bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)

> The bind() method creates a new function that, when called, has its this keyword set to the provided value, with a given sequence of arguments preceding any provided when the new function is called.

bind 会创建一个新的函数，bind 的第一个参数会作为创建函数的 `this` 值，其余参数会作为参数传递给新函数。  
然后我们还会用到 `trampoline 函数` 蹦床函数这个说法，蹦床函数其实很简单，就是参数是函数就执行函数，参数是其他类型就返回。

再改动一下代码

```javascript
// 蹦床函数
function trampoline(f) {
  while (f && f instanceof Function) {
    f = f();
  }
  return f;
}

let count = 0;
function fibonacci(n) {
  if (n === 0 || n === 1) {
    return 1;
  }

  /**
   * @param n2  当前计算数的前面第二个值
   * @param n1   当前计算数的前一个值
   * @param flag  当前计算到第几位
   * **/
  function fibonacci_inner(n2, n1, flag) {
    count++;
    if (flag === n) {
      return BigInt(n1 + n2);
    }
    //返回的不是 fibonacci_inner 的执行结果，而是 fibonacci_inner 本身
    return fibonacci_inner.bind(null, BigInt(n1), BigInt(n1 + n2), flag + 1);
  }
  //从第二位开始计算
  return fibonacci_inner(1, 1, 2);
}

console.time("fibonacci");
console.log(`the result is ${BigInt(trampoline(fibonacci(10000)))}`);
console.timeEnd("fibonacci");
console.log(`the number of exec count is ${count}`);
```

看一下输出值：

```json
the result is 54438373113565281338734260993750380135389184554695967026247715841208582865622349017083051547938960541173822675978026317384359584751116241439174702642959169925586334117906063048089793531476108466259072759367899150677960088306597966641965824937721800381441158841042480997984696487375337180028163763317781927941101369262750979509800713596718023814710669912644214775254478587674568963808002962265133111359929762726679441400101575800043510777465935805362502461707918059226414679005690752321895868142367849593880756423483754386342639635970733756260098962462668746112041739819404875062443709868654315626847186195620146126642232711815040367018825205314845875817193533529827837800351902529239517836689467661917953884712441028463935449484614450778762529520961887597272889220768537396475869543159172434537193611263743926337313005896167248051737986306368115003088396749587102619524631352447499505204198305187168321623283859794627245919771454628218399695789223798912199431775469705216131081096559950638297261253848242007897109054754028438149611930465061866170122983288964352733750792786069444761853525144421077928045979904561298129423809156055033032338919609162236698759922782923191896688017718575555520994653320128446502371153715141749290913104897203455577507196645425232862022019506091483585223882711016708433051169942115775151255510251655931888164048344129557038825477521111577395780115868397072602565614824956460538700280331311861485399805397031555727529693399586079850381581446276433858828529535803424850845426446471681531001533180479567436396815653326152509571127480411928196022148849148284389124178520174507305538928717857923509417743383331506898239354421988805429332440371194867215543576548565499134519271098919802665184564927827827212957649240235507595558205647569365394873317659000206373126570643509709482649710038733517477713403319028105575667931789470024118803094604034362953471997461392274791549730356412633074230824051999996101549784667340458326852960388301120765629245998136251652347093963049734046445106365304163630823669242257761468288461791843224793434406079917883360676846711185597501
fibonacci: 4.223876953125 ms
the number of exec count is 9999
```

然后 fibonacci(100000) 的值

{% asset_img  fibonacci-count-100000.png  斐波那契 100000 输出 %}

有点像尾递归优化，之前 node 短暂的支持尾递归优化，就是递归的函数会替换掉调用函数的执行栈，后续貌似不支持了。。。


OK，现在递归应该没有啥问题了，实际已经不能称之为递归了，看起来是递归的写法，但是底层执行逻辑是循环，直接写循环也挺好的。

Done。


