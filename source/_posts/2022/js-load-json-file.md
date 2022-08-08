---
title: 浏览器环境 js 加载 json 文件
date: 2022-07-28 11:11:18
tags:
    - javascript
---

## 加载 json 文件方式

在浏览器环境加载 json 文件，不同于 Node 环境可以采用 commonJS 模块化加载方式，直接

```
const data = require("./demo.json")
```

就行，浏览器环境不支持这种加载模式

记录一下怎么在浏览器环境加载 json 文件

### `.js` 文件引入

使用 `script` 的机制，对 json 文件做适量改造，例如

// demo.json

```json
{
	"id": 8848,
	"name": "Sokiy"
}
```

改造后
// demo.json.js

```javascript
const demo = {
	id: 8848,
	name: "Sokiy",
};
```

直接 `script` 引入就行

```javascript
<script src='./demo.json.js'></script>
```

#### 优点

-   只需要少量改造就可以加载对应的 json 文件
-   json 对象会保存在全局对象中，随用随取

#### 缺点

-   需要改造
-   容易造成全局变量污染

### XHR 加载

使用原生 XHR (XMLHttpRequest) 或者 jQuery 加载 json 文件

使用 jQuery 加载 json 文件

```javascript
$(selector).getJSON(url, data, success(data, status, xhr));

$.getJSON("demo.json", function (data, status, xhr) {
	// code
});
```

#### 优点

-   语法简单
-   不用对 json 文件做改动

#### 缺点

-   需要加载 jQuery 文件

### Fetch 加载

目前浏览器大都支持 [fetch Api](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

```javascript
fetch("./demo,json").then((res) => {
	return res.json();
});
```

如果需要加载多个 json 文件

```javascript
const file_list = ["./demo.json", "./data.json"];
Promise.all(
	file_list.map((file) =>
		fetch(file).then((res) => {
			return res.json();
		})
	)
).then((ret) => {
	// ret = [{demo.json.data},{data.json.data}]
	//code After load some json files
});
```

#### 优点

-   fetch 目前支持度比较广且语法简单
-   不用额外引入其他第三方库资源

#### 缺点

-   基于 Promise 的，但是对 http status 的状态 reject 会跟一般流程存在差异
-   加载的 status 状态没有像 XHR 那么直观

Done.
