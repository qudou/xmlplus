# 检索

---

视图项中包含的是xml字符串，其中对象集的逻辑结构与xml的结构是一致。有时需要在这些对象集中检索出部分对象以供后续处理，现在就来谈谈如何检索所需的对象。

## 概述

组件对象集的检索实际上通过xml结点的检索来实现的。系统检索函数通过检索相应的xml节点，再由获取的节点集通过关联组件对象以得到所需要的对象集。常用的xml节点检索描述包括xpath表达式和css选择器，本系统采用的后者。

在《动态接口》中已经说过，组件的检索接口属于系统接口，为方便起见，这里重新列出这些接口。

- find：以当前节点为上下文查找对象，返回系统接口对象集
- first：获取当前节点的第一个子节点对象，返回系统接口对象集
- last：获取当前节点的最后一个子节点对象，返回系统接口对象集
- next：获取当前节点的下一个节点对象，返回系统接口对象集
- prev：获取当前节点的前一个节点对象，返回系统接口对象集
- children：获取当前节点的所有子节点对象，返回系统接口对象集
- sys：以文档节点为上下文查找对象，返回系统接口对象集
- items：以文档节点为上下文查找对象，返回组件自定义接口对象集

按照检索的能力划分，上述接口可以分为通用检索接口和特定检索接口两类，通用检索接口仅包含上述的最后两个接口，其余为特定检索接口，下面分别讲述。

## 通用检索接口

通用检索接口实际上指的是函数项的前两个形参，它们均以函数的形式而存在，下面是它们接口形式。

```js
sys(selector[,context])
items(selector[,context])
```

对于这两个接口，css选择符是需要提供第一个输入参数，另外还有一个可选的检索上下文参数。默认情况下，它们以文档对象为上下文，也就是进行全局检索。下面是一个全局检索的一个示例。

```js
Index: {
   xml: "<div>\
             <button>foo</button>\
             <button>bar</button>\
         </div>",
   fun: function ( sys, items, opts ) {
       console.log(sys("*").length); // 3
       sys("button").call("css", "color", "blue");
   }
}
```

sys("*")描述会检索出所有的组件对象，而`sys("button")`描述则只会检索出所有的按钮对象。当然，由`sys`函数检索返回的对象都是系统接口对象。下面是使用`items`函数作检索的例子。

```js
Index: {
   xml: "<div>\
             <button>foo</button>\
             <button>bar</button>\
         </div>",
   fun: function ( sys, items, opts ) {
       console.log(items("*").length); // 3
       items("button").call("color", "blue");
   }
}，
Button: {
    xml: "<button id='btn'/>",
    fun: function ( sys, items, opts ) {
        function color(value) {
            sys.btn.css("color", value);
        }
        return { color: color };
    }
}
```

`items("*")`描述会检索出所有的组件对象，而`items("Button")`描述则只会检索出所有的按钮对象。由`items函数检索出对象都是组件自定义接口对象。

前面的示例默认以文档对象为上下文作全局检索，现在来看看带有上下文参数作检索的例子。

```js
Index: {
   xml: "<div id='top'>\
             <div id='sub'>\
                 <button id="foo">foo</button>\
             </div>\
             <button id="bar">bar</button>\
         </div>",
   fun: function ( sys, items, opts ) {
       console.log(items("button", sys.index).length);
       sys("button", sys.sub).call("css", "color", "blue");
   }
}
```

示例中，由于检索函数均带有上下文，所以检索范围就被限制于上下文之内。`items("button", sys.top)`仍然检索出所有的按钮对象，但`sys("button", sys.sub)`则只能检索出对象名为`foo`的按钮对象。需要注意的是，对于提供上下文的检索函数，检索范围并不包含上下文本身。

最后需要说明的是，通用检索接口检索出的结果只包含两类对象：HTML元素对象和用户自定义组件对象。而像文本对象、注释对象等其他的基组件对象则不在此列。

## 特定检索接口

与通用检索接口不同的是，通用检索接口由函数项的形参引入，而特定检索接口属于系统接口对象。下面针对各个特定检索接口分别以示例说明它们的用法。

### find函数

函数find以当前对象为上下文检索所需的对象集，下面是函数find的用法示例。

```js
Index: {
   xml: "<div id='top'>\
             <button id="foo">foo</button>\
             <button id="bar">bar</button>\
         </div>",
   fun: function ( sys, items, opts ) {
       var res = sys.top.find("button");
       res.call("css", "color", "blue");
   }
}
```
函数find的类似于通用接口sys，上面示例的用法等价于`sys("button",sys.top)`。与通用检索接口类似，函数`find`对于检索的结果只包含`HTML`元素对象和用户自定义组件对象，而忽略其他类型的对象。

### first函数和last函数

first函数用于获取当前对象子级的第一个对象，last函数用于获取当前对象子级的最后一个对象。下面是first函数和last函数的用法示例。

```js
Index: {
   xml: "<div id='top'>first\
             <button id="foo">foo</button>\
             <button id="bar">bar</button>last\
         </div>",
   fun: function ( sys, items, opts ) {
       console.log(sys.top.first().text()); // foo
       console.log(sys.top.last().text());  // bar
       console.log(sys.top.first(3).text()); // first
       console.log(sys.top.last(3).text());  // last
   }
}
```

从示例可以看出，`first`函数和`last`函数包含一个可选的参数`nodeType`，其可能值如下。

```js
var ELEMENT_NODE                = 1;
var TEXT_NODE                   = 3;
var CDATA_SECTION_NODE          = 4;
var COMMENT_NODE                = 8; 
```

默认情况下`nodeType`的取值为`1`，也就是函数返回的是`HTML`元素对象和用户自定义组件对象。如果想得到其他类型的对象，则需要明确给定`nodeType`的相应值。

### next函数和prev函数

next函数用于获取当前对象的后一个对象，prev函数用于获取当前对象的前一个对象。下面是它们的用法示例。

```js
Index: {
   xml: "<div id='top'>first\
             <button id="foo">foo</button>\
             <button id="bar">bar</button>last\
         </div>",
   fun: function ( sys, items, opts ) {
       console.log(sys.foo.next().text());               // bar
       console.log(sys.bar.prev().text());               // foo
       console.log(sys.top.prev(), sys.top.next());      // null null
       console.log(sys.bar.prev(3).text());              // first
       console.log(sys.foo.next(3).text());              // last
   }
}
```

从示例中可以看出，对于最顶层的节点，如果调用`next`函数或者`prev`函数获取到的会是空值。另外，这两个函数也包含一个可选的参数`nodeType`，其用法与`first`函数和`last`函数类似。

### children函数

children函数用于获取当前对象的儿子对象，在不提供参数的情况下，该函数返回的是HTML元素对象和用户自定义组件对象。下面是其用法示例。

```js
Index: {
   xml: "<div id='top'>\
             <button id="foo">foo</button>\
             <button id="bar">bar</button>\
         </div>",
   fun: function ( sys, items, opts ) {
       console.log(sys.top.children().length); // 2
   }
}
```

上面`children`函数获取到了所有的`button`对象，其用法等价于`sys("*>*", sys.top)`。`children`函数有一个可选的参数`nodeType`，其用法与`first`函数和`last`函数类似。不同的是，此函数的`nodeType`可以取`0`值，它代表返回所有的儿子对象。请看下面的示例。

```js
Index: {
   xml: "<div id='top'>\
             <button id="foo">foo</button>\
             <button id="bar">bar</button>\
         </div>",
   fun: function ( sys, items, opts ) {
       console.log(sys.top.children(0).length); // 5
   }
}
```

该示例打印出的结果是`5`，这是由于当给`children`函数指定实参为`0`后，检索的结果把文本也包含在内了。