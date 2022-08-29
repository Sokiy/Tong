---
title: HTTP 30X 跳转问题记录
date: 2022-08-29 15:00:27
tags: HTTP
---


#### 现象

在做一个项目的时候遇到了需要做 30x 跳转的问题，记录一下。

> 做单点登录的时候需要访问某一个接口后跳转到 CAS 服务器的登录界面，这时候采取了返回 30X 状态码让浏览器做重定向到其他界面。  
> 然后发现并不能跳转，如果 IP 不一样的话直接会报跨域错误。


[HTTP 响应状态码](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status)


#### 原因

##### 跨域原因

当我在 **www.a.com** 做 `Ajax XHR` 请求，想在请求中重定向到其他的界面，这时候接口返回 302 状态码，location 为 **www.b.com**。  

浏览器收到 302 的请求之后，会自己在当前界面请求 request header 中的 location 地址，比如说 location 为 **www.b.com**，但是这个时候就是在 **www.a.com** 的界面请求 **www.b.com** 的接口数据，这时候会有 cors 跨域问题。

这时候查看控制台，会发现请求的 **www.b.com** 的请求并非是 `document` 资源请求类型，而是 `xhr` 的类型。

但是如果 **www.a.com** 是一个 `document` 的请求，302 后就相当于在 **www.a.com** 打开 **www.b.com** 的超链接，会跳转到 **www.b.com**。
