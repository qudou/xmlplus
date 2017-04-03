# 检索

与检索相关的 API 在文档的相关章节有详细介绍，这里仅给出个概要。更多内容请参考 [检索](/docs#检索)。


## sys

```js
sys(selector[,context])
```

- `selector` : `String` XPath 表达式，比如 `*` 或者 `/div`
- `context` : `SystemObject` 代表上下文的系统对象
- `Returns` : `Collection` 检索到的系统对象集

该函数根据给定的 XPath 表达式，获取系统对象集。若不指定上下文，则默认以 XML 文档根为上下文。更多内容请参考 [通用检索接口](/docs#检索-通用检索接口)。

```js
// 04-01
Example: {
   xml: "<div id='example'>\
             <button>foo</button>\
             <button>bar</button>\
         </div>",
   fun: function (sys, items, opts) {
       console.log(sys("//*").length); // 3
       sys("//button").call("css", "color", "blue");
   }
}
```

## items

```js
items(selector[,context])
```

- `selector` : `String` XPath 表达式，比如 `*` 或者 `/div`
- `context` : `SystemObject` 代表上下文的系统对象
- `Returns` : `Collection` 检索到的值对象集

该函数根据给定的 XPath 表达式，获取值对象集。若不指定上下文，则默认以 XML 文档根为上下文。更多内容请参考 [通用检索接口](/docs#检索-通用检索接口)。

```js
// 04-02
Example: {
   xml: "<div id='example'>\
             <Button>foo</Button>\
             <Button>bar</Button>\
         </div>",
   fun: function (sys, items, opts) {
       console.log(items("//*").length); // 3
       items("//Button").call("color", "blue");
   }
}，
Button: {
    xml: "<button id='button'/>",
    fun: function (sys, items, opts) {
        function color(value) {
            sys.btn.css("color", value);
        }
        return { color: color };
    }
}
```

## find

```js
find(selector)
```

- `selector` : `String` XPath 表达式，比如 `*` 或者 `/div`
- `Returns` : `Collection` 检索到的系统对象集

该函数以当前组件对象为上下文检索所需的对象集。更多内容请参考 [find](/docs#检索-专用检索接口-find)。

```js
// 04-03
Example: {
   xml: "<div id='example'>\
             <button id='foo'>foo</button>\
             <button id='bar'>bar</button>\
         </div>",
   fun: function (sys, items, opts) {
       var res = sys.example.find("button");
       res.call("css", "color", "blue");
   }
}
```

## get

```js
get(index)
```

- `index` : `Integer` 索引
- `Returns` : `SystemObject` 子级的第 index 个系统对象

该函数根据给定的索引返回当前组件对象子级的某一系统对象，若无则不返回任何对象。更多内容请参考 [get](/docs#检索-专用检索接口-get)。

```js
// 04-04
Example: {
   xml: "<div id='example'>first\
             <button id='foo'>foo</button>\
             <button id='bar'>bar</button>last\
         </div>",
   fun: function (sys, items, opts) {
       console.log(sys.example.get(0).text());  // foo
       console.log(sys.example.get(1).text());  // bar
   }
}
```

## first

```js
first([nodeType])
```

- `nodeType` : `Integer` XML 的节点类型
- `Returns` : `SystemObject` 子级的第一个系统对象

该函数根据给定的 XML 节点类型，获取当前组件对象子级的第一个对象。默认节点类型为元素。更多内容请参考 [first 和 last](/docs#检索-专用检索接口-first和last)。

```js
// 04-05
Example: {
   xml: "<div id='example'>first\
             <button id='foo'>foo</button>\
             <button id='bar'>bar</button>last\
         </div>",
   fun: function (sys, items, opts) {
       console.log(sys.example.first().text());  // foo
       console.log(sys.example.first(3).text()); // first
   }
}
```

## last

```js
last([nodeType])
```

- `nodeType` : `Integer` XML 的节点类型
- `Returns` : `SystemObject` 子级的最后一个系统对象

该函数根据给定的 XML 节点类型，获取当前组件对象子级的最后一个对象。默认节点类型为元素。更多内容请参考 [first 和 last](/docs#检索-专用检索接口-first和last)。

```js
// 04-06
Example: {
   xml: "<div id='example'>first\
             <button id='foo'>foo</button>\
             <button id='bar'>bar</button>last\
         </div>",
   fun: function (sys, items, opts) {
       console.log(sys.example.last().text());   // bar
       console.log(sys.example.last(3).text());  // last
   }
}
```

## next

```js
next([nodeType])
```

- `nodeType` : `Integer` XML 的节点类型
- `Returns` : `SystemObject` 下一个系统对象

该函数根据给定的 XML 节点类型，获取当前组件对象的下一个对象。默认节点类型为元素。更多内容请参考 [next 和 prev](/docs#检索-专用检索接口-next和prev)。

```js
// 04-07
Example: {
   xml: "<div id='example'>first\
             <button id='foo'>foo</button>\
             <button id='bar'>bar</button>last\
         </div>",
   fun: function (sys, items, opts) {
       console.log(sys.foo.next().text());               // bar
       console.log(sys.example.next());                  // undefined
       console.log(sys.bar.next(3).text());              // last
   }
}
```

## prev

```js
prev([nodeType])
```

- `nodeType` : `Integer` XML 的节点类型
- `Returns` : `SystemObject` 前一个系统对象

该函数根据给定的 XML 节点类型，获取当前组件对象前一个对象。默认节点类型为元素。更多内容请参考 [next 和 prev](/docs#检索-专用检索接口-next和prev)。

```js
// 04-08
Example: {
   xml: "<div id='example'>first\
             <button id='foo'>foo</button>\
             <button id='bar'>bar</button>last\
         </div>",
   fun: function (sys, items, opts) {
       console.log(sys.bar.prev().text());               // foo
       console.log(sys.example.prev());                  // undefined
       console.log(sys.foo.prev(3).text());              // first
   }
}
```

## children

```js
children([nodeType])
```

- `nodeType` : `Integer` XML 的节点类型
- `Returns` : `Collection` 儿子系统对象集

该函数根据给定的 XML 节点类型，获取当前组件对象所有儿子对象。默认节点类型为元素。如果给定节点类型为 0，则获取所有类型的儿子对象。更多内容请参考 [children](/docs#检索-专用检索接口-children)。

```js
// 04-09
Example: {
   xml: "<div id='example'>\
             <button id='foo'>foo</button>\
             <button id='bar'>bar</button>\
         </div>",
   fun: function (sys, items, opts) {
       console.log(sys.example.children().length); // 2
   }
}
```