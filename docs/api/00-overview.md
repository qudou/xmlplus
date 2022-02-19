# 概述

本文档提供全面的与框架相关的接口索引及描述，如 [文档](/docs) 中已有详细介绍的，则仅作简要说明，并给出相应的链接。按照所属对象划分，接口可分为三类，包括全局对象接口、集合对象接口以及个体对象接口。其中全局对象接口也叫全局接口，此类接口由全局对象 `xp` 或者 `xmlplus` 引用，其引用方式如下：

```js
xp.api_name([parameters])
```

或者

```js
xmlplus.api_name([parameters])
```

集合对象接口也叫集体对象接口，此类接口由集合对象引用。个体对象接口则由个体对象引用，下面是两类接口使用的一个示例。

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

对于每一个函数接口，本文档以如下示例的格式编写，该示例是系统函数 [each](/api#全局-each) 的详细描述。

<hr/>

<b style="font-size:30px;">each</b>

```js
each(object,callback)
```

- `object` : `Array | Object` 要迭代的数组或对象
- `callback` : `Function` 在每个对象上执行的函数
- `Returns` : `Array | Object` 第一个实参

一个通用的迭代器函数，可以用来无缝地迭代数组和对象。其中，对于具有 length 属性的数组和数组类对象（例如函数的 arguments 对象），则通过数字索引（从 0 到长度 length - 1）进行迭代。而其他对象则通过它们的命名属性进行迭代。

```js
// 01-15
xp.each(['a','b','c'], function (index, value) {
    console.log(index, value);
});

xp.each({a:1,b:2,c:3}, function (key, value) {
    console.log(key, value);
});
```

<hr/>

对于上面的接口描述示例，刚开始是函数名，函数名加粗显示。其次是函数声明，函数声明由函数名以及参数列表构成。参数列表由零个或多个逗号分隔，可选的参数则包含于中括号。然后是参数列表中每一个参数的详细描述。描述的内容包含参数类型和参数的简单解释。参数类型可以是下面给出的任何一个。如果允许多个类型，则需要用竖线 `|` 分隔开来。

- `String`：字符串
- `Number`：数值
- `Boolean`：布尔型
- `RegExp`：正则表达式
- `Object`：即 Javascript 中的 Object
- `Integer`：整型数
- `PlainObject`：由 `{}` 或者 `new Object` 创建
- `Collection`：指代集合对象
- `HTMLElement`：指代 HTML 元素
- `XMLElement`：指代由全局函数 parseXML 解析后返回的数据类型
- `Event`：指代事件侦听器的形参类型
- `Message`：指代消息侦听器的形参类型
- `ValueObject`：指代值对象类型
- `SystemObject`：指代系统对象类型
- `Anything`：指代任意的类型

如果函数有返回值，那么还会有一个返回值描述，该描述由 `Returns` 开始，其后是返回值的类型和解释。之后就到了函数的用法描述，该描述包含了文字和相关的示例源码。另外，请注意示例开头的一个注释 `01-15`。你可以根据该注释定位到目录 `/example/api/01-global/15/`，注释中的 `01` 即章节序，`15` 就是示例所在目录的名称。