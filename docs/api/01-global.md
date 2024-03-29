﻿# 全局

## startup

```js
startup(object[,parent][,options])
```

- `object` : `XMLElement | SystemObject | String` 用于实例化的内容
- `parent` : `String | HTMLElement` 一个 `HTML` 元素 `ID` 或者一个 `HTML` 元素
- `options` : `PlainObject` 为目标组件提供初始输入值的普通对象
- `Returns` : `SystemObject` 实例化出的系统对象

该函数用于实例化一个组件，一般用于应用的初始化。更多内容，请查看 [组件的实例化](/docs#组件与空间-组件的实例化)。

```js
// 01-01
xmlplus("xp", function (xp, $_) {
    $_().imports({
        Example: {
            xml: "<h1>hello, world</h1>"
        }
    });
}).ready(function() {
    xp.startup("//xp/Example");
});
```

## create

```js
create(path[,options])
```

- `path` : `String` 组件的绝对路径
- `options` : `AnyType` 为目标组件提供初始输入值
- `Returns` : `AnyType` 实例化出的组件对象

该函数是一个用于创建轻量的组件对象的函数，它只是简单地调用组件的函数项来返回所需的对象。

```js
// 01-02
xmlplus("xp", function (xp, $_) {
    $_().imports({
        Example: {
            fun: function(sys, items, opts) {
                function sayHello() {
                    console.log(sys, items, "hello");
                }
                return { sayHello: sayHello };
            }
        }
    });
});
xmlplus.create("//xp/Example").sayHello(); // null null hello
```

注意，用该函数创建的组件对象不会被加入组件树中，也就是说函数项中 `sys` 以及 `items` 均为空。用该函数创建的组件对象比用系统函数 `append`、`before` 以及 `replace` 创建的组件对象效率更高，然而功能却有限。

## guid

```js
guid()
```

- `Returns` : `String` 获取到的标识符

获取系统内唯一的全局标识符。该标识符的生成规则如下：刚开始是 `a,b,...z`，然后是 `aa,ab,...az`，以此类推。该标识符最先会由系统内部使用，所以你获取到的标识符一般不是从 `a` 开始。

```js
// 01-03
console.log(xp.guid()); // 一个标识符字符串
```

## ready

```js
ready(callback)
```

- `callback` : `Function` 在 DOM 准备就绪后执行的函数

该函数用于在 DOM 完全加载时执行指定的函数，该函数仅在浏览器端可见。这里指的 DOM 是广义的 DOM，它包含了我们的自定义组件。请看下面的一个 HTML 文件的 body 中的内容：

```html
<!-- 01-04 -->
<h1>hello, world</h1>
<i:Calendar xmlns:i='//xp'>custom</i:Calendar>
<script>
  xp.ready(function () {
      console.log("DOM is ready.")
  });
</script>
```

上述的 `ready` 语句的回调函数开始执行，当且仅当 h1 元素和自定义组件 Calendar 均完成实例化后。

## type

```js
type(obj)
```

- `obj` : `AnyType`

该函数用于确定 JavaScript 内置对象的类型，并返回小写形式的类型名称。该函数源于新近版本的 jQuery，如需更详细的内容请参考 [jQuery.type](http://api.jquery.com/jQuery.type/)。

```js
// 01-05
console.log(xp.type("undefined")); // "undefined"
console.log(xp.type(true));        // "boolean"
console.log(xp.type(3));           // "number"
```

## isArray

```js
isArray(obj)
```

- `obj` : `Object` 用于测试是否是数组的对象

该函数用于确定给定对象是否为数组。

```js
// 01-07
console.log(xp.isArray([])); // true
console.log(xp.isArray({})); // false
```

## likeArray

```js
likeArray(obj)
```

- `obj` : `Object` 用于测试是否是伪数组的对象

该函数用于确定给定对象是否为伪数组。

## isWindow

```js
isWindow(obj)
```

- `obj` : `PlainObject` 用于测试是否是一个窗体的对象

该函数用于确定给定对象是否为窗体。

```js
// 01-06
console.log(xp.isWindow(window)); // true
```

## isFunction

```js
isFunction(obj)
```

- `obj` : `Object` 用于测试是否是函数的对象

该函数用于确定给定对象是否为函数。

```js
// 01-08
console.log(xp.isFunction(xp));  // true
console.log(xp.isFunction({}));  // false
```

## isNumeric

```js
isNumeric(value)
```

- `value` : `AnyType` 要检测的值

确定给定参数是否可以看作一个 JavaScript 数值。

```js
// 01-09
console.log(xp.isNumeric(3));   // true
console.log(xp.isNumeric("3")); // true
console.log(xp.isNumeric({}));  // false
```

## isPlainObject

```js
isPlainObject(object)
```

- `object` : `AnyType` 要检测的值

检查对象是否是普通对象（使用 `{}` 或 `new Object` 创建）。

```js
// 01-10
console.log(xp.isPlainObject({}));   // true
console.log(xp.isPlainObject("3"));  // false
console.log(xp.isPlainObject([]));   // false
```

## isEmptyObject

```js
isEmptyObject(object)
```

- `object` : `Object` 用于被检查是否为空的对象

检查指定对象是否为空（即不包含可枚举的属性）。

```js
// 01-11
console.log(xp.isEmptyObject({}));            // true
console.log(xp.isEmptyObject({key: "key"}));  // false
console.log(xp.isEmptyObject([]));            // true
```

## isSystemObject

```js
isSystemObject(obj)
```

- `obj` : `PlainObject` 将被检查以查看它是否是一个系统对象

检查对象是否为系统对象。

```js
// 01-12
Example: {
    xml: "<h1 id='example'>hello, world</h1>",
    fun: function (sys, items, opts) {
        console.log(xp.isSystemObject({}));            // false
        console.log(xp.isSystemObject(this));          // true
        console.log(xp.isSystemObject(sys.example));   // true
    }
}
```

## extend

```js
extend([deep,]target[,object1][,objectN])
```

- `deep` : `Boolean` 如果为 true，则将进行递归合并（也称为深度复制）
- `target` : `Object` 新属性将被添加到的目标对象
- `object1` : `Object` 包含要合并的属性的第一个对象。
- `objectN` : `Object` 包含要合并的属性的其他对象。

将两个或多个对象的内容合并到第一个对象中。该函数来源于新近版本的 jQuery，如需更详细的内容请参考 [jQuery.extend](http://api.jquery.com/jQuery.extend/)。

```js
// 01-13
var result = xp.extend({key1: "hello"},{key2: "world"});
console.log(result); // {key1: "hello, key2: "world"};
```

## each

```js
each(object,callback)
```

- `array` : `Array | Object` 要迭代的数组或对象
- `callback` : `Function` 在每个对象上执行的函数

一个通用的迭代器函数，可以用来无缝地迭代对象和数组。其中，对于具有 length 属性的数组和数组类对象（例如函数的 arguments 对象），则通过数字索引（从 0 到长度 length - 1）进行迭代。而其他对象则通过它们的命名属性进行迭代。

```js
// 01-14
xp.each(['a','b','c'], function (index, value) {
    console.log(index, value);
});
xp.each({a:1,b:2,c:3}, function (key, value) {
    console.log(key, value);
});
```

## parseXML

```js
parseXML(data)
```

- `data` : `String` 一个格式正确的 XML 字符串

此函数将给定的字符串解析为 XML 文档。

```js
// 01-15
var xml = "<title>Title</title>";
var xmlDoc = xp.parseXML(xml);
console.log(xmlDoc.lastChild.nodeName); // title
```

## serialize

```js
serialize(node)
```

- `node` : `HTMLElement | XMLElement` DOM 节点
- `Returns` : `String` XML 字符串

序列化指定的 DOM 节点，序列化后的结果包含节点的子级。

```js
// 01-16
// <h1 xmlns="http://www.w3.org/1999/xhtml" id="h1">hello,world</h1>
console.log(xp.serialize(document.getElementById("h1")));
```

## hasNamespace

```js
hasNamespace(object)
```

- `object` : `String` 组件路径，比如 `//xp/Index`
- `Returns` : `Boolean` 布尔值

判定当前系统是否包含给定的命名空间，如果包含则返回 `true`，否则返回 `false`。

```js
// 01-17
console.log(xp.hasNamespace(null));         // false
console.log(xp.hasNamespace("div"));        // false
console.log(xp.hasNamespace("//xp/Index")); // true 或者 false，这取决于实际的应用
```

## hasComponent

```js
hasComponent(object)
```

- `object` : `String` HTML 标签或者组件路径，比如 `div` 或 `//xp/Index`
- `Returns` : `Boolean | PlainObject` 布尔值或者组件的 JSON 描述

判定当前系统中是否包含给定的组件，如果不包含则返回 `false`；如果是 HTML 标签，则返回 `true`；否则返回组件的 JSON 描述。

```js
// 01-18
console.log(xp.hasComponent(null));         // false
console.log(xp.hasComponent("div"));        // true
console.log(xp.hasComponent("//xp/Index")); // false 或者一个组件的 JSON 描述，这取决于实际的应用
```

## getElementById

```js
getElementById(id[,isGuid])
```

- `id` : `String` 对象标识符
- `isGuid` : `Boolean` 是否组件对象标识符
- `Returns` : `HTMLElement | SystemObject` HTML 元素对象或者系统对象

由给定的标识符获取相关对象。这需要分三种情况来看。如果 `isGuid` 为 `true`，那么将返回系统对象。请参考下面的示例。

```js
// 01-19
Example: {
    xml: "<div id='example'/>",
    fun: function (sys, items, opts) {
        var guid = sys.index.guid();
        console.log(sys.index == xp.getElementById(guid, true); // true
    }
}
```

如果不提供 `isGuid` 参数，并且当前 HTML 文档中存在 `id` 值为给定值的元素，那么将返回 HTML 元素，这等效于浏览器自带的 `document.getElementById`。请参考下面的示例。

```html
// 01-20
<html>
    <head>
        <script src="xmlplus.js"></script>
    </head>
    <body>
        <span id="text">text</span>
        <script>
            console.log(xp.getElementById("text") == document.getElementById("text")); // true
        </script>
    </body>
</html>
```

如果不提供 `isGuid` 参数，并且当前 HTML 文档中存在 `id` 值为给定值的自定义组件对象描述，那么将返回系统对象。请参考下面的示例。

```html
// 01-21
<html>
    <head>
        <script src="xmlplus.js"></script>
        <script>
            xmlplus("xp", function (xp, $_) {
                $_().imports({
                    Index: {}
                });
            }).ready(function() {
                console.log(xp.getElementById("index")); // SystemObject
            });
        </script>
    </head>
    <body>
        <i:Index id="index" xmlns='//xp'></i:Index>
    </body>
</html>
```

## exports

```js
exports(object)
```

- `object` : `Proxy` 代理对象
- `Returns` : `PlainObject` 转化得到的普通对象

将数据绑定后得到的代理对象转化成普通的 JSON 对象。

```html
// 01-22
Example: {
	xml: "<div id='example'>\
			<button id='item'/>\
		  </div>",
	fun: function (sys, items, opts) {
		let data = [1,2,3,4];
		let proxy = sys.item.bind(data);
		console.log(xp.exports(proxy.model));  // [1,2,3,4]
	}
}
```