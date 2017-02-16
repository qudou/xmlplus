# 概述

本文档提供全面的七类接口索引及其描述，如文档中已有详细介绍的，则仅作简要说明，并给出相应的文档链接。

按照接口的所属对象划分，API 分为三类，其中全局 API 由全局对象 xp 或者 xmlplus 引用，使用方式如下：

```js
xp.api_name([parameters])
```

或者

```js
xmlplus.api_name([parameters])
```

集合对象 API 由集合对象引用，个体对象 API 由个体对象引用，可参看下面的示例。

```js
// 00-01
Example: {
    xml: "<div id='example'>\
            <button>foo</button>\
            <button>bar</button>\
          </div>",
    fun: function (sys, items, opts) {
        sys.example.text();            // text 是个体对象接口
        sys.example.children().hash(); // hash 是集体对象接口
    }
}
```

对于每一个函数接口，本文档将以下面的格式编写，以系统函数 each 为例。

<b style="font-size:30px;">width</b>

```js
each(object,callback)
```

- `object` : `Array | Object` 要迭代的数组或对象
- `callback` : `Function` 在每个对象上执行的函数
- `Returns` : `Array | Object` 第一个实参

一个通用的迭代器函数，可以用来无缝地迭代对象和数组。其中，对于具有 length 属性的数组和数组类对象（例如函数的 arguments 对象），则通过数字索引（从0到长度-1）进行迭代。而其他对象则通过它们的命名属性进行迭代。

```js
// 01-15
xp.each(['a','b','c'], function (index, value) {
    console.log(index, value);
});

xp.each({a:1,b:2,c:3}, function (key, value) {
    console.log(key, value);
});
```

刚开始是函数名，函数名加粗显示，并且字体大小为 `30px`。

其次是函数声明，函数声明由函数名加参数列表构成。参数列表由零个或多个逗号分隔，对于可选的参数以中括号包住。

然后是对参数列表中每一个参数的详细描述。描述的内容包含类型和简单解释。类型是下面给出的任何一个，如果允许多个类型需要用符号 `|` 分隔开来。

- `String`：字符串
- `Number`：数值
- `Boolean`：true 或 false
- `RegExp`：正则表达式
- `Object`：即 Javascrip 中的 Object
- `Integer`：整型数
- `PlainObject`：{} 或者由 new Object 创建
- `Collection`：集合对象
- `HTMLElement`：HTML 元素
- `XMLElement`：指代由全局函数 parseXML 解析返回数据的类型
- `Event`：指代事件侦听器的形参类型
- `Message`：指代消息侦听器的形参类型
- `ValueObject`：指代值对象类型
- `SystemObject`：指代系统对象类型
- `Anything`：指代任意的类型

如果函数有返回值，那么还会有一个返回值参数描述，该参数名用 `Returns` 表示，其后是返回值类型和解释。参数描述之后是函数用法的描述。函数用法的描述会包含文字和相关的示例。

另外，请注意示例开头的一个注释 01-15，那么你可以根据该注释定位到目录 demo/api/01-global/15/，注释中的 01 即章节序，15 就是示例所在的目录。