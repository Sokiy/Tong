---
title: threeJS 键盘控制物块移动动画优化
date: 2022-08-04 17:59:28
tags: 
    - threeJS
    - optimize
---

### 机制分析

#### 控制物块移动核心思想

-   监听键盘事件
-   在键盘触发的 callback 函数中更改物块 `position` 属性的 `x,y,z` 值

#### 一个小问题

监听键盘的 callback 函数可以触发对应的物块移动，假如一直按下绑定的移动按键，物块移动看起来就生硬，一卡一卡的，有顿挫感。

#### 原因分析

webGL 动画更新时采用 [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) 来告诉下一帧需要执行什么操作，以屏幕刷新率为 `60HZ` 举例，相当于 `1s` 内会执行 60 次 `requestAnimationFrame` 调用的函数。

```javascript
function render() {
	console.log("Hello world!");
	requestAnimationFrame(render);
}
```
一秒内会输出 60 次 Hello world!


但是 `document.addEventListener` 监听的 `keydown 、keyup 、keypress` 的触发时间并没有跟屏幕刷新帧率保持一致，而且 `keydown` 事件的第一次触发到按下持续触发中间还有延迟，这就造成了在键盘监听事件中进行物块的移动会导致动画看起来一卡一卡的。


### 优化调整
思路就是把物块移动的操作放到 `requestAnimationFrame` 的调用函数中执行。

问题就来了，在 `requestAnimationFrame` 是要怎么感知到当前按下了哪个键的，总不能在  `requestAnimationFrame`  中每执行一次就监听一次 `keydown、keyup` 事件吧？

```javascript
const global = {};
//创建一个 cube
function createCube() {
	const cubeGeometry = new THREE.BoxGeometry(10, 10, 10, 1, 1, 1);
	const cubeMaterial = new THREE.MeshBasicMaterial({
		color: 0xfff000,
		wireframe: true,
	});
	global.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
	global.cube.position.set(0, 5, 0);
	global.scene.add(global.cube);
}
```


Todo
