---
title: apply-bind
date: 2022-10-27 14:14:14
tags:
---

#### 手写 call 函数
> call 函数就是改变当前函数 this 的指向
> 思路就是在自己手写的函数内部，在传入的对象中增加同样的函数，然后执行返回，最后删除即可。

```javascript
const Obj1 = {
    name: "Sokiy",
    say: function (prefix, age) {
        console.log(
            `${prefix}, My name is ${this.name}, i'm ${age} years old.`
        );
    },
};

Obj1.say("Hello", 20);

const Obj2 = {
    name: "Tong",
};

Obj1.say.call(Obj2, "Hello", 18);
```

output:
>  Hello, My name is Sokiy, i'm 20 years old.  
   Hello, My name is Tong, i'm 18 years old.

##### 手写的 call 函数
不用箭头是因为箭头函数没有自己的[`this`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this)，[`arguments`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/arguments)，[`super`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/super)或[`new.target`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new.target)
我们需要用到这个东西

```javascript
Function.prototype.tinycall = function (target, ...args) {
	const key = Symbol();  //给定一个独一无二的 key，有可能会和原 target 中key 产生冲突
	target[key] = this; // this 就是需要执行的函数，所谓的重新指向就是复制了一份
	const res = target[key](...args);
	delete target[key];
	return res;
};
```

#### 手写 apply 函数

同 call 函数，无非是 args 参数是否是数组的区别

