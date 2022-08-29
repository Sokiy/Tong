---
title: 异或 XOR 及其应用
date: 2022-08-12 16:23:19
tags: Math
---

#### 含义

XOR 是 exclusive OR 的缩写，更单纯的 OR 运算。

OR 运算的运算子有两种情况，计算结果为 true。

-   一个为 true，另一个为 false
-   两个都为 true

XOR 排除了第二种情况，只针对两个运算子值不一样的情况，更符合理想中的 OR 运算。

XOR 可以用来判断两个值是否相等。

```javascript
0 ^ 0 = 0
1 ^ 1 = 0
0 ^ 1 = 1
1 ^ 0 = 1
```

一个通俗的解释

> 只有男性和女性能生出孩子，否则就不行。

#### 明确含义

XOR 是数学运算，既然是数学运算，首先需要明确一个点

**异或运算仅仅适用于数字间的运算**  
**异或运算仅仅适用于数字间的运算**  
**异或运算仅仅适用于数字间的运算**

##### 数字间的异或

以 javascript 语言举例

```javascript
1 ^ 2 = 3
3 ^ 4 = 7
3 ^ 5 = 6
```

数字间的异或就是按位进行异或操作

```javascript
3 ^ 4  =  0110 ^ 1000 = 1110 = 7
```

##### 非数字的异或

然后测试一下字符串异或

```javascript
'a' ^ 'b' = 0
'aaaaaaa' ^ 'dadasdasdasdas' = 0
true ^ false = 1
true ^ 'a' = 1
```

为什么两个字符串间异或会是 0 ?  
为什么 true 跟 false 异或会是 1 ?
为什么布尔值跟字符串异或会是 1 ?

##### 非数字异或操作原理分析

异或运算仅仅适用于数字间的运算，所以在进行异或操作前，会对两边的操作数做类型转换操作，

```javascript
Number('String') = NaN
Number(1) = 1
Number(true) = 1
Number(false) = 0
```

所以

```javascript
'a' ^ 'b' = NaN ^ NaN = 0
true ^ false = 1 ^ 0 = 1
true ^ 'a' = 1 ^ NaN = 1
```

这个在 Python 语言中同样适用

```Python
1 ^ 2 = 3
'1' ^ '1' = TypeError: unsupported operand type(s) for ^: 'str' and 'str'
True ^ False = 1
int(True) = 1
```

#### 运算定律

XOR 满足如下定律，

1. 因为 0 ^ 0 === 1 ^ 1, 所以

```javascript
x ^ x = 0
```

2. 因为 0 ^ 1 === 1 ^ 0, 所以

```javascript
(a ^ b) === (b ^ a);
```

3. 因为 0 ^ ( 1 ^ 1 ) === (0 ^ 1) ^ 1, 所以

```javascript
a ^ b ^ (c === a) ^ (b ^ c);
```

#### 应用

##### 简化运算

```javascript

a ^ b ^ c ^ b ^c =  b ^ b ^ c ^ c ^ a = 0 ^ 0 ^ a = a
```

##### 加密

根据 a ^ b ^ b = a, 我们可以这么推断 text ^ key ^ key = text,  
因为 text 如果是字符串的话，是无法参与 XOR 运算的，所以我们首先要把字符串转成可以用数字代替的形式。

以 ASCll 中的字符举例，可以使用 ASCll 对照表还原

```javascript
const key = "Sokiy"
	.split("")
	.map((item) => {
		return item.charCodeAt();
	})
	.join("");

//加密 & 解密
function encrypt(str) {
	if (typeof str !== "string") {
		throw "Parameter is not a string!";
	}
	let result = [];
	for (let i = 0; i < str.length; i++) {
		result.push(String.fromCharCode(str[i].charCodeAt() ^ key));
	}
	return result.join("");
}

console.log(encrypt("Sokiy")); //ᄲᄎᄊᄈᄘ
console.log(encrypt(encrypt("Sokiy"))); //Sokiy
```

#### 一道面试题

Single Number
Given an array of integers, every element appears twice except for one. Find that single one.

给定一个整数数组，其中只有一个整数出现了一次，其余的整数都出现了两次，求出这个出现了一次的整数的值

```javascript
const arr = [1, 1, 2, 3, 4, 5, 4, 5, 3];

let single = arr[0];
arr.forEach((element) => {
	single = single ^ element;
});
```


#### 参考

- [阮一峰：异或运算 XOR 教程](https://www.ruanyifeng.com/blog/2021/01/_xor.html)
- [JS迷你书 Number类型二进制表示法](https://juejin.cn/post/6844903840450363399)