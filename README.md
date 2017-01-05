# xmlplus框架使用指南

## 简介

xmlplus是一个用javascript写就的框架，它既可以在浏览器端运行，又可以在服务器端运行。它统一了前后端的组件书写方式。

在浏览器端，它非常适合书写单页的应用，当然用它写静态页面也是小菜一碟。在服务器端，它也完全可以胜任。

关于运行环境，只要是支持es5的浏览器，它基本上都可以跑，不过如果想在ie9+的浏览器上跑，需要引入两个额外的文件，后续本人会加上的。

xmlplus包含一些颠覆性的设计理念，它完全不同于目前的主流设计框架，我想它一定会带给你另类的思考方式。

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

|head1 head1 head1|head2 head2 head2|head3 head3 head3|head4 head4 head4|
|---|:---|:---:|---:|
|[01 组件与空间](./docs/01-components-and-space.md)|[05 静态接口](./docs/05-static-interface.md) |[09 检索](./docs/09-searching.md)                     |[13 消息与通信](./docs/13-message-and-communication.md)|
|[02 命名](./docs/02-naming.md)                    |[06 参数映射](./docs/06-parameter-mapping.md)|[10 嵌套](./docs/10-nesting.md)                       |[14 共享](./docs/14-sharing.md)                        |
|[03 抽象](./docs/03-abstract.md)                  |[07 路径](./docs/07-path.md)                 |[11 生命周期](./docs/11-life-circle.md)               |[15 延迟加载](./docs/15-lazy-instantiation.md)         |
|[04 动态接口](./docs/04-dynamic-interface.md)     |[08 继承](./docs/08-inheritting.md)          |[12 事件与通信](./docs/12-events-and-communication.md)|                                                       |

## License

Licensed under the [MIT](http://opensource.org/licenses/MIT) License;

Copyright (C) 2017 Qudou. All Rights Reserved.
