---
title: two-ways-binding
date: 2022-08-09 15:01:27
tags:
---

proxy 劫持数组对象会触发两次

原因
> js 除了基础类型，其他都可以认为是对象，数组本质就是对象，下标可以认为是属性的 key，同时又一个 Length 的属性记录长度，Push 就相当于新增了一个 key 为 Length - 1 的属性，然后修改对象的 Length 为 length + 1，所以会触发两次。
在谷歌浏览器里，就是通过对象是否有 值为数字的 length，值为 function 的 push 和 splice 来区分对象和数组的。


Todo