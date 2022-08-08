---
title: 在 npm 私有仓库中发布一个 package
date: 2021-09-29 14:22:34
tags: npm
---

Verdaccio + pm2 搭建一个 npm 私有仓库，网上很多 [教程](https://verdaccio.org/)，主要记录一下发布过程中遇到的问题。

{% asset_img verdaccio.png Verdaccio %}

<!--more-->

###  包名规范 

即使是自己练手的项目，如果对包名不加限制的话，也很难管理和维护，所以可以通过增加和命名空间类似的  `Scope` 做限制。

egg:

+ @sokiy-tools/switch-dns
+ @sokiy-tools/ip-proxy

+ @common-tools/test



### 登录私有源

1. Method 1：

   可以通过 `nrm`  添加私有源路径然后切换到对应私有源

   ```bash
   nrm add XXX YYY & nrm use XXX
   ```

   然后添加用户或者进行登录

   ```bash
   //添加             //登录
   npm adduser  or   npm login
   ```

   然后输入账号名密码邮箱，添加账号密码自定义，登录时输入添加时对应账号的密码。

2. Method 2：

   ```bash
   npm adduser --registry  http://xxxxxxxx 
   ```

todo
