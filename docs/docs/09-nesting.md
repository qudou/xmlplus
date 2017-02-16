# 嵌套

## 概述

在组件的视图项中，组件具有层级结构，也就是可以层层嵌套。下面就是一个简单的例子，其中 button 元素作为 div 元素的子级而嵌套在内。而文本则作为 button 元素的子级而嵌套在内。

```xml
<div>
    <button>foo</button>
    <button>bar</button>
</div>
```

此处，div 元素称为嵌套父级，而 div 元素的子级，即所有的 button 元素，则叫做 div 元素的嵌套子级。在此示例中，嵌套父级是一个 HTML 元素。然而，嵌套父级还可以是自定义组件。请看下面的示例。

```xml
<Phone>
    <button>foo</button>
	<button>bar</button>
</Phone>
```

这里嵌套父级是自定义组件 Phone，而两个 button 元素作为 Phone 的嵌套子级而存在。相对于以 HTML 元素作为嵌套父级，我们对于以自定义组件作为嵌套父级的情形还一无所知。故本文的主要目的是弄清楚包含这类嵌套组件的工作机制。

## 组件实例和 DOM 元素对象

每个组件实例都唯一对应一个 DOM 元素对象。如下面的 Index 组件的视图项包含三个组件，每一个组件在实例化后都分别对应唯一的 DOM 元素对象。该 DOM 元素对象可由系统函数 `elem` 获取。

```js
// 09-01
Index: {
    xml: "<div id='index'>\
              <Widget id='widget'/>\
              <input type='text'/>\
          </div>",
    fun: function (sys, items, opts) {
        console.log(items.widget == sys.widget.elem()); // true
    }
},
Widget: {
    xml: "<div id='widget'>hello,world</div>",
    fun: function (sys, items, opts) {
        return sys.widget.elem();
    }
}
```

虽然，每个组件实例都唯一对应一个 DOM 元素对象。但一个 DOM 元素对象却可以对应多个组件实例。也就是说，组件实例与 DOM 元素对象是多对一的关系。如上面的示例所示，可以看出，Index 组件中的 Widget 组件和 Widget 组件中的 div 元素在实例化后都共同对应一个 DOM 元素对象。

现在假设上面 Widget 组件是空的，也就是下面这样子。那么 Widget 组件实例是否对应一 DOM 元素对象？如果答案是肯定的，那么该元素又是什么呢？

```js
Widget: {}
```

实际上，如上空组件 Widget 在实例化后，确实对应一个 DOM 元素对象 ，该元素对象由系统生成。在后续章节[《事件与通信》](/docs#事件与通信)中，可以看出该对象的存在意义。

## 自定义组件作为嵌套父级

以 HTML 元素作为嵌套父级，这种情形比较简单，系统会直接生成相应的 DOM 元素。所以这里着重介绍当以自定义组件作为嵌套父级时，组件对象是如何呈现的。请看下面的示例。

```js
// 09-02
Index: {
    xml: "<Wrapper>\
             <button>foo</button>\
             <button>bar</button>\
         </Wrapper>"
},
Wrapper: {
    xml: "<div>\
              <h1 id='alice'>alice</h1>\
              <button>bob</button>\
          </div>"
}
```

该示例的`Index`组件的视图项由三个组件组成，其中两个 button 元素嵌套在自定义的组件 Wrapper 中。组件 Wrapper 含有一个 div 元素。现在来看这种情形下生成的文档树（与实际的内容有所偏差，但大体一致）。

```xml
<div>
    <h1>alice</h1>\
    <button>bob</button>\
    <button>foo</button>\
    <button>bar</button>\
</div>
```
 
可以看出，Index 组件中 Wrapper 组件子级的内容被直接追加到了 Wrapper 组件的 div 元素中。故将子级内容直接追加到嵌套父级所对应的 DOM 元素是以自定义组件作为嵌套父级的组件的基本呈现方式。

现在提出一个要求，能否将组件 Index 中的两个 button 元素添加到组件 Wrapper 的 h1 元素的子级。这当然可以实现，只需在组件 Wrapper 的映射项中指定 `appendTo`，其值为 `alice` 即可。下面是改进后的 Wrapper 组件。

```js
// 09-03
Wrapper: {
    xml: "<div>\
              <h1 id='alice'>alice</h1>\
              <button>bob</button>\
          </div>",
    map: { appendTo: "alice" }
}
```
 
映射项中的 `appendTo` 指出，当以当前的自定义组件作为嵌套父级时，嵌套子级的元素相应的 DOM 元素应该被追加到的位置。

## 嵌套子级对象的获取

下面的`Wrapper`组件是由上面的更改而来的，它添加了函数项，展示了如何获取并使用嵌套子级的元素。

```js
// 09-04
Wrapper: {
    xml: "<div>\
              <h1 id='alice'>alice</h1>\
              <button>bob</button>\
          </div>",
    map: { appendTo: "alice" },
    fun: function (sys, items, opts) {
        this.children().forEach(function(item) {
            console.log(item.text());
        });
    }
}
```

自定义组件的函数项的 `this` 来源于组件实例化时系统的注入，它是当前组件实例化后的引用。所以可以通过系统函数 `children` 来获取并使用嵌套子级的元素。

## 应用

下面是一个窗体组件的简单示例，窗体一般包含标题栏和内容框两个部分。下面的窗体组件封装了标题栏和内容框部分内容，这样当用户使用该组件时，只需提供内容就可以了。

```js
// 09-05
Index: {
	xml: "<Window id='index'>\
			<p>this is a test.</p>\
		  </Window>"
},
Window: {
	css: "#window { width: 600px; height: 480px; border: 1px solid blue; }\
		  #header { background: #AAA; height: 36px; }\
		  #content { width: 90%; height: calc(100% - 60px); margin: 10px auto 0; border: 1px solid blue; }",
	xml: "<div id='window'>\
			<div id='header'/>\
			<div id='content'/>\
		  </div>",
	map: { appendTo: "content" }
}
```

另一个使用嵌套特性的例子是路由组件，路由组件还涉及到组件的延迟实例化特性，所以这里并不打算介绍。如果需要了解详情，可以访问[《延迟实例化》](/docs#延迟实例化)。