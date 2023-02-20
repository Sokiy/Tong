---
title: 命令式、函数式、响应式编程
date: 2023-02-20 12:00:01
tags: 随便想想
---

一点点的个人理解

#### 命令式编程

所见即所得，代码看起来就是一串命令的组合，看代码就能看出来具体要干啥。  
例如：

```javascript
// double array items
function doubleItem (arr){
    const ret = []
    for(let i =0;i < arr.length;i++>){
        ret.push(arr[i] * 2);
    }
    return ret
}

//add one array items
function doubleItem (arr){
    const ret = []
    for(let i =0;i < arr.length;i++>){
        ret.push(arr[i] + 1);
    }
    return ret
}
```

代码的实现细节都是可以看到的，但是可扩展性不强且有一些重复代码。  
代码量一上去很容易就能体会到，平常实现的某些需求从一些程度来讲模式都是相似的，这时候可以把共性的代码提取出来，把差异化作为参数传入，这个时候就能减少很多的重复代码。  
这时候函数式编程的好处就体现出来了，我们就可以写出更简洁、更有表现力的代码。

#### 函数式编程

> 函数式编程就是非常强调使用函数来解决问题的一种编程方式。

还是上面的列子，就可以写成

```javascript
// double array items
const doubleItem = (arr) => arr.map((item) => item * 2);
const addOne = (arr) => arr.map((item) => item + 1);
```

比命令式编程更加的简洁，无需关心内部的实现，只需要知道这个函数能达到需要的效果。  


函数式编程对函数有如下的特殊要求

+ 声明式（Declarative）
+ 纯函数（Pure Function）
+ 数据不可变性（Immutability）

##### 声明式
声明式有点像是用描述的字符定义了一些行为的映射，比如 doubleItem 代表的就是把传入的数字数组中每个 item 都乘以 2，并且返回新的数组，doubleItem 和数组每个子项乘以 2 的映射，  
doubleItem 就是这个功能的声明。

##### 纯函数
纯函数需要符合两个条件
+ 函数的执行过程完全由输入参数决定，不会受除参数之外的任何数据影响。
+ 函数不会修改任何外部状态。

##### 数据不可变性
在原数据不变的情况下，产生新的数据来表现这种变化，而不是修改原数据。
毕竟原数据不一定是一个程序在用，多进程操作数据会有很多意想不到的结果，还不如数据不可变，用新数据表现数据的变化，让数据的变化有迹可循。

//Todo

