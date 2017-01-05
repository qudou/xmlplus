# xmlplus框架使用指南

## 简介

xmlplus是一个用javascript编程语言写就的框架，它既可以在浏览器端运行，又可以在服务器端运行。它统一了前后端的组件书写方式。

在浏览器端，它非常适合书写单页的应用，当然用它写静态页面也是小菜一碟。在服务器端，它也完全可以胜任。

关于运行环境，只要是支持es5的浏览器，它基本上都可以跑，不过如果想在ie9+的浏览器上跑，需要引入两个额外的文件，后续本人会加上的。

xmlplus包含一些颠覆性的设计理念，要理解掌握它，你需要下一些功夫。

## 安装

在浏览器端，可以像下面引入`xmlplus.js`文件。

```html
<script src="xmlplus.js"></script>
```

如果需要在服务器端使用框架，则可以通过如下的`npm`安装指令获取软件包。

```bash
npm install xmlplus
```

## 文档

在docs目录中包含了用markdown写好的15篇文档，你最好从第一篇开始看起，因为内容的编排基本上渐近式的。下面是这些文档的索引。

### [组件与空间](./docs/01-components-and-space.md)

### 命名

### 抽象

### 动态接口

### 静态接口

### 参数映射

### 路径

### 继承

### 检索

### 嵌套

### 生命周期

### 事件与通信

### 消息与通信

### 共享

### 延迟加载

## License

Licensed under the [MIT](http://opensource.org/licenses/MIT) License;

Copyright (C) 2017 Qudou. All Rights Reserved.
