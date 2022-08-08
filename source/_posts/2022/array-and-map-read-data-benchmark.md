---
title: Array & Map 读取数据 Benchmark 测试
date: 2022-03-23 11:38:00
tags:
    - javascript
    - optimize
---

针对 JavaScript Array 和 Map 类型读取数据做一次性能测试，测试一下读取数据的性能。

<!--more-->

#### 测试方案

-   创建长度为 len 的 Array 和 Map 结构，内容都相同
-   创建一个乱序的长度为 len 且内容都是 true false 各半的数组
-   循环乱序数组，如果为 true 则分别取 Array 和 Map 的值做拼接，测试最终的代码运行时间

##### Rander Array & Map

首先创建好我们的 Array 和 Map 结构

```javascript
const BSAECHAR =
	"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
let Ret = {}; //Array 和 Map 的输出集合
let len = 1000;

//在给定的集合中返回对应长度的 Array 和  Map
function randomString(length, chars) {
	let retArr = [];
	let retMap = new Map();
	for (let i = 0; i < length; i++) {
		let char = chars[Math.floor(Math.random() * chars.length)];
		retArr[i] = char;
		retMap.set(i, char);
	}
	return { arr: retArr, map: retMap };
}

console.time("render Ret");
Ret = randomString(len, BSAECHAR);
console.timeEnd("render Ret");
```

##### Random Array

然后定义我们的乱序数组，乱序函数使用 `Fisher–Yates shuffle` 洗牌算法

```javascript
let RandomArr = [];

/**
 * Fisher–Yates shuffle
 */
function shuffle(arr) {
	let len = arr.length;
	while (len > 1) {
		let index = Math.floor(Math.random() * len--);
		[arr[len], arr[index]] = [arr[index], arr[len]];
	}
	return arr;
}

//创建一个乱序的长度为 len 且内容都是 true false 各半的数组
console.time("render RandomArr");
RandomArr = shuffle(
	Array(len / 2)
		.fill(true)
		.concat(Array(len / 2).fill(false))
);
console.timeEnd("render RandomArr");
```

##### Array benchmark

首先测试从 Array 中取值的时长

```javascript
/**
 * 从 Array 中取值
 */
function renderResultInArray() {
	let ret = "";
	RandomArr.forEach((item, index) => {
		if (item) {
			ret += Ret.arr[index];
		}
	});
	return ret;
}

console.time("array");
let retArr = renderResultInArray();
console.timeEnd("array");
```

##### Map benchmark

然后测试从 Map 中取值的时长

```javascript
/**
 * 从 Map 中取值
 */
function renderResultInMap() {
	let ret = "";
	RandomArr.forEach((item, index) => {
		if (item) {
			ret += Ret.map[index];
		}
	});
	return ret;
}

console.time("map");
let retMap = renderResultInMap();
console.timeEnd("map");
```

#### 结论

然后执行程序进行输出：

{% asset_img  benchmark.png  benchmark %}

貌似 Map 结构并没有说比 Array 取值快, WTF。
