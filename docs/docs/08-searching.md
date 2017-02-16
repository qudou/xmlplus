# 检索

视图项中包含的是 xml 字符串，其中对象集的逻辑结构与 xml 的结构一致。从而组件对象集的检索可以通过 xml 结点的检索来实现的。系统检索函数通过检索相应的 xml 节点，再由获取的节点集通过关联组件对象以得到所需要的对象集。常用的 xml 节点检索描述包括 xpath 表达式和 css 选择器，本系统采用的是前者。

在[《动态接口》](/docs#动态接口)中已经说过，组件的检索接口属于系统对象接口，为方便起见，这里重新列出这些接口如下。

- [sys](/api#检索-sys)：以文档节点为上下文查找对象，返回系统对象集
- [items](/api#检索-items)：以文档节点为上下文查找对象，返回组件值对象集
- [find](/api#检索-find)：以当前组件对象为上下文检索所需的对象集
- [get](/api#检索-get)：根据给定的索引返回当前组件对象子级的某一系统对象
- [first](/api#检索-first)：获取当前组件对象子级的第一个对象
- [last](/api#检索-last)：获取当前组件对象子级的最后一个对象
- [next](/api#检索-next)：获取当前组件对象的下一个对象
- [prev](/api#检索-prev)：获取当前组件对象前一个对象
- [children](/api#检索-children)：获取当前组件对象所有儿子对象

按照检索能力来划分，上述接口可以分为通用检索接口和特定检索接口两类，前者仅包含上述的前两个接口，其余则为特定检索接口，下面分别讲述。

## 通用检索接口

通用检索接口实际上指的是函数项的前两个形参，它们均以函数的形式存在。下面是它们的接口形式。

```js
sys(selector[,context])
items(selector[,context])
```

对于这两个接口，xpath 选择符是需要提供的第一个输入参数，另外还有一个可选的上下文参数。默认情况下，它以文档对象为上下文，也就是进行全局检索。下面是一个全局检索的一个示例。

```js
// 08-01
Index: {
   xml: "<div id='index'>\
             <button>foo</button>\
             <button>bar</button>\
         </div>",
   fun: function (sys, items, opts) {
       console.log(sys("//*").length); // 3
       sys("//button").call("css", "color", "blue");
   }
}
```

该示例中，`sys("//*")` 描述会检索出所有的组件对象，而 `sys("//button")` 描述则只会检索出所有的按钮对象。当然，由系统函数 `sys` 返回的对象都是系统对象。下面是使用 `items` 函数作检索的例子。

```js
// 08-02
Index: {
   xml: "<div id='index'>\
             <Button>foo</Button>\
             <Button>bar</Button>\
         </div>",
   fun: function (sys, items, opts) {
       console.log(items("//*").length); // 3
       items("//Button").call("color", "blue");
   }
},
Button: {
    xml: "<button id='button'/>",
    fun: function (sys, items, opts) {
        function color(value) {
            sys.button.css("color", value);
        }
        return { color: color };
    }
}
```

`items("//*")` 描述会检索出所有的组件对象，而 `items("//Button")` 描述则只会检索出所有的按钮对象。由 `items` 函数检索出的对象都是值对象。

前面的示例默认以文档对象为上下文作全局检索，现在来看看带有上下文参数作检索的例子。

```js
// 08-03
Index: {
   xml: "<div id='index'>\
             <div id='sub'>\
                 <button id='foo'>foo</button>\
             </div>\
             <button id='bar'>bar</button>\
         </div>",
   fun: function (sys, items, opts) {
       console.log(items("button", sys.index).length); // 1
       sys("button", sys.sub).call("css", "color", "blue");
   }
}
```

示例中，由于检索函数均带有上下文，所以检索范围就被限制于上下文之内。`items("button", sys.index)` 检索出按钮对象 bar，而 `sys("button", sys.sub)` 则检索出按钮对象 foo。需要注意的是，对于提供上下文的检索函数，检索范围并不包含上下文本身。

最后需要说明的是，通用检索接口检索出的结果只包含两类对象：HTML 元素对象和用户自定义组件对象。而像文本对象、注释对象等其他的基组件对象则不在此列。

## 特定检索接口

与通用检索接口不同的是，通用检索接口由函数项的形参引入，而特定检索接口属于系统对象。下面针对各个特定检索接口分别以示例说明它们的用法。

### find函数

系统函数 `find` 以当前对象为上下文检索所需的对象集，下面是函数 `find` 的用法示例。

```js
// 08-04
Index: {
   xml: "<div id='index'>\
             <button id='foo'>foo</button>\
             <button id='bar'>bar</button>\
         </div>",
   fun: function (sys, items, opts) {
       var res = sys.index.find("button");
       res.call("css", "color", "blue");
   }
}
```

函数 `find` 的类似于通用接口 `sys`，上面示例的用法等价于 `sys("button",sys.index)`。与通用检索接口类似，函数 `find` 对于检索的结果只包含 HTML 元素对象和自定义组件对象，而忽略其他类型的对象。

### get函数

系统函数 `get` 根据给定的索引返回当前组件对象子级的某一系统对象，若无则不返回任何对象。下面是该函数的用法示例。

```js
// 08-05
Index: {
   xml: "<div id='index'>first\
             <button id='foo'>foo</button>\
             <button id='bar'>bar</button>last\
         </div>",
   fun: function (sys, items, opts) {
       console.log(sys.index.get(0).text());  // foo
       console.log(sys.index.get(1).text());  // bar
   }
}
```

与函数 `find` 类似，该函数检索的结果只包含 HTML 元素对象和自定义组件对象，而忽略其他类型的对象。

### first函数和last函数

系统函数 `first` 用于获取当前对象子级的第一个对象，系统函数 `last` 用于获取当前对象子级的最后一个对象。下面是 `first` 函数和 `last` 函数的用法示例。

```js
// 08-06
Index: {
   xml: "<div id='index'>first\
             <button id='foo'>foo</button>\
             <button id='bar'>bar</button>last\
         </div>",
   fun: function (sys, items, opts) {
       console.log(sys.index.first().text());  // foo
       console.log(sys.index.last().text());   // bar
       console.log(sys.index.first(3).text()); // first
       console.log(sys.index.last(3).text());  // last
   }
}
```

从示例可以看出，函数 `first` 和函数 `last` 包含一个可选的参数 `nodeType`，其可能值如下。

```js
var ELEMENT_NODE                = 1;
var TEXT_NODE                   = 3;
var CDATA_SECTION_NODE          = 4;
var COMMENT_NODE                = 8; 
```

默认情况下 `nodeType` 的取值为 `1`，也就是函数返回的是 HTML 元素对象和用户自定义组件对象。如果想得到其他类型的对象，则需要明确给定 `nodeType` 的相应值。

### next函数和prev函数

系统函数`next` 用于获取当前对象的后一个对象，系统函数`prev` 用于获取当前对象的前一个对象。下面是它们的用法示例。

```js
// 08-07
Index: {
   xml: "<div id='index'>first\
             <button id='foo'>foo</button>\
             <button id='bar'>bar</button>last\
         </div>",
   fun: function (sys, items, opts) {
       console.log(sys.foo.next().text());               // bar
       console.log(sys.bar.prev().text());               // foo
       console.log(sys.index.prev(), sys.index.next());  // undefined undefined
       console.log(sys.foo.prev(3).text());              // first
       console.log(sys.bar.next(3).text());              // last
   }
}
```

从示例中可以看出，对于最顶层的节点，如果调用函数 `next` 或者函数 `prev` 获取到的会是空值。另外，这两个函数也包含一个可选的参数 `nodeType`，其用法与函数 `first` 和函数 `last` 的类似。

### children函数

系统函数`children` 用于获取当前对象的儿子对象，在不提供参数的情况下，该函数返回的是 HTML 元素对象和自定义组件对象。下面是其用法示例。

```js
// 08-08
Index: {
   xml: "<div id='index'>\
             <button id='foo'>foo</button>\
             <button id='bar'>bar</button>\
         </div>",
   fun: function (sys, items, opts) {
       console.log(sys.index.children().length); // 2
   }
}
```

上面函数 `children` 获取到了所有的组件对象 button，其用法等价于 `sys("*", sys.index)`。`children` 函数有一个可选的参数 `nodeType`，其用法与 `first` 函数和 `last` 函数类似。不同的是，此函数的 `nodeType` 可以取 `0` 值，它代表返回所有的儿子对象。请看下面的示例。

```js
// 08-09
Index: {
   xml: "<div id='index'>\
             <button id='foo'>foo</button>\
             <button id='bar'>bar</button>\
         </div>",
   fun: function (sys, items, opts) {
       console.log(sys.index.children(0).length); // 5
   }
}
```

该示例打印出的结果是 `5`，这是由于当给 `children` 函数指定实参为 `0` 后，检索的结果把空白文本也包含在内了。