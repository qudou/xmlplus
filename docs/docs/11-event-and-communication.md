# 事件与通信

组件之间的通信，包含事件通信与消息通信两方面的内容。本章讲述的事件通信基于 W3C 制定的 DOM 事件标准，但略有不同，读者应注意区分。下面列出的是与事件通信相关的系统函数，后面的内容主要与这几个函数有关。

- [on](/api#通信_on)：侦听事件
- [off](/api#通信_off)：取消事件侦听
- [once](/api#通信_once)：仅一次侦听事件
- [trigger](/api#通信_trigger)：派发事件

## 事件的侦听

侦听事件，需要调用系统函数 `on` 来实现。下面的示例中，组件对象 index 侦听了 `click` 事件。当点击按钮时，控制台上会打印出相应的字符串。

```js
// 11-01
Index: {
    xml: "<button id='index'>click</button>",
    fun: function (sys, items, opts) {
        sys.index.on("click", function (e) {
            console.log("hello, world");
        });
    }
}
```

组件对象可以侦听某一对象的事件，也可以侦听若干个对象的事件。其中，后一种事件侦听方式叫做事件委托。要使用事件委托，需要在系统函数 `on` 的第二个参数中指定一个 XPath 表达式。如下面示例所示，顶层组件对象 index 侦听了所有的 button 元素对象派发的 `click` 事件。

```js
// 11-02
Index: {
    xml: "<div id='index'>\
             <button>button-A</button>\
             <button>button-B</button>\
          </div>",
    fun: function (sys, items, opts) {
        sys.index.on("click", "button", function (e) {
            console.log(this.localName(), this.text());
        });
    }
}
```

在该示例的侦听器中，`this` 指向的是被点击的按钮对象。另外，上面示例中的 XPath 选择器 `*` 选取的结果并不包含组件对象 index 本身，该组件对象只是检索操作的一个上下文。

当一个系统对象侦听一个事件时，在侦听器中可以获取派发事件的对象引用。如下面的示例所示，`e.target`、和 `sys.button` 同为派发事件的对象引用。

```js
// 11-03
Index: {
    xml: "<div id='index'>\
             <button id='button'>click</button>\
          </div>",
    fun: function (sys, items, opts) {
        sys.index.on("click", function (e) {
            console.log(e.target == sys.button); // true
        });
    }
}
```

当然，当一个系统对象侦听一个事件时，在侦听器中也可以获取该系统对象的引用。如下面的示例所示，`e.currentTarget`、`this` 与 `sys.index` 同属于侦听事件的对象的引用。

```js
// 11-04
Index: {
    xml: "<div id='index'>\
             <button>click</button>\
          </div>",
    fun: function (sys, items, opts) {
        sys.index.on("click", function (e) {
            console.log(e.currentTarget == sys.index, sys.index == this); // true
        });
    }
}
```

## 事件侦听器的移除

系统函数 `off` 用于注销一个事件的侦听。此函数允许提供最多两个实参，分别是事件类型和侦听函数。如果不提供任何实参，则该函数执行后系统将注销相关联的所有侦听器。

在下面的示例中，由于在回调函数中注销了被侦听的事件，所以这个回调函数只能被执行一次。

```js
// 11-05
Index: {
    xml: "<button id='index'>click</button>",
    fun: function (sys, items, opts) {
        sys.index.on("click", function (e) {
            sys.index.off("click");
            console.log("hello, world");
        });
    }
}
```

另外，可以使用系统函数 `once` 达到与上例同样的目的，这时无需在回调函数中显示地移除事件的侦听。该函数确保注册的侦听器仅被执行一次。下面的示例展示了这一点。

```js
// 11-06
Index: {
    xml: "<button id='index'>click</button>",
    fun: function (sys, items, opts) {
        sys.index.once("click", function (e) {
            console.log("hello, world");
        });
    }
}
```

一个事件侦听器只能由侦听该事件的对象移除，利用其它对象来移除是无效的。下面的组件对象 Index 自身侦听了 `click` 事件，但回调函数中 `sys.index` 对象试图移除该事件侦听器，这是无效的。

```js
// 11-07
Index: {
    xml: "<button id='index'>click</button>",
    fun: function (sys, items, opts) {
        this.on("click", function (e) {
            sys.index.off("click");
            console.log("hello, world");
        });
    }
}
```

## 事件的派发

除了默认产生的事件外，组件还可以派发自定义的事件，系统函数 `trigger` 就专门干这事的。下面的函数项中，当点击组件对象 span 时，该对象会派发了一个自定义事件，该事件最终被顶层组件对象 index 侦听到。

```js
// 11-08
Index: {
    xml: "<div id='index'>\
             <span id='span'>trigger</span>\
          </div>",
    fun: function(sys, items, opts) {
        sys.index.on("event", function (e) {
            console.log("hello, world");
        });
        sys.span.on("click", function (e) {
            sys.span.trigger("event");
        });
    }
}
```

系统函数 `trigger` 在派发事件时可以携带数据，事件侦听方可以在回调函数中获取到数据。下面的组件对象 span 派发的事件携带了两个数据，该数据分别由侦听方的回调函数的第二和第三个参数获得。

```js
// 11-09
Index: {
    xml: "<div id='index'>\
             <span id='span'>trigger</span>\
          </div>",
    fun: function (sys, items, opts) {
        sys.index.on("event", function (e, a, b) {
            console.log(a, b); // 1 hello
        });
        sys.span.on("click", function (e) {
            sys.span.trigger("event", [1,"hello"]);
        });
    }
}
```

## 事件的冒泡行为

默认情况下，许多事件是允许冒泡的。如下面的示例所示，按钮的父级 div 层可以侦听来自此按钮的点击事件。

```js
// 11-10
Index: {
    xml: "<div id='index'>\
             <Button>click me</Button>\
          </div>",
    fun: function (sys, items, opts) {
        sys.index.on("click", function (e) {
            console.log("I'm in Index");
        });
    }
},
Button: {
    xml: "<button id='button'/>",
    fun: function (sys, items, opts) {
        sys.button.on("click", function(e) {
            console.log("I'm in Button");
        });
    }
}
```

可以通过调用事件的 `stopPropagation` 函数来阻止事件的冒泡行为。下面的组件 Button 是在上面的组件 Button 的基础上修改而来的，它阻止了事件的冒泡行为。

```js
// 11-11
Button: {
    xml: "<button id='button'/>",
    fun: function (sys, items, opts) {
        sys.button.on("click", function (e) {
            e.stopPropagation();
            console.log("I'm in Button");
        });
    }
}
```

当派发自定义事件时，默认情况下是允许事件冒泡的。但当指定 `trigger` 函数的第三个参数为 `false` 值时，派发的事件就不是冒泡的。在下面的示例中，由于组件对象 span 在派发事件时指定不冒泡，所以组件对象 index 是无法侦听到来自组件对象 span 的 event 事件的。

```js
// 11-12
Index: {
    xml: "<div id='index'>\
             <span id='span'>trigger</span>\
          </div>",
    fun: function (sys, items, opts) {
        sys.index.on("event", function (e, a, b) {
            console.log(a, b);
        });
        sys.span.on("click", function(e) {
            sys.span.trigger("event", [1,"hello"], false);
        });
    }
}
```

与上述的 `stopPropagation` 函数类似，事件的 `stopImmediatePropagation` 函数也用来阻止事件冒泡。不过，该函数除了阻止阻止事件冒泡，还阻止了剩下的事件处理程序被执行。

```js
// 11-13
Index: {
    xml: "<div id='index'>\
             <button id='btn'>click</button>\
          </div>",
    fun: function (sys, items, opts) {
        sys.index.on("click", function (e) {
            console.log("1");
        });
        sys.btn.on("click", function(e) {
            e.stopImmediatePropagation();
            console.log("2");
        });
        sys.btn.on("click", function(e) {
            console.log("3");
        });
    }
}
```

上面示例中，由于在按钮的第一个侦听器中调用了事件的 `stopImmediatePropagation` 函数，从而，当点击按钮时，控制台只会打印数字 2。并且，其父级的侦听器和按钮的另一个侦听器均不会得到调用。

## 阻止事件的默认行为

在浏览器端，默认情况下，当用户点击一个 url 链接时，浏览器会跳转到相应的页面。若要阻止这类的默认行为，可以通过调用事件的 `preventDefault` 函数来实现。

```js
// 11-14
Index: {
    xml: "<a id='link' href='/'>click</a>",
    fun: function (sys, items, opts) {
        sys.link.on("click", function (e) {
            e.preventDefault();
        });
    }
}
```

## 事件通信的介质

在 W3C 制定的 DOM 事件标准中，事件在 DOM 元素之间传递。虽然表面上系统中的事件传递发生在组件对象之间，但在其本质上，事件的传递发生于 DOM 元素之间。在[《嵌套》](/docs#嵌套)章节中讲过，每一组件实例都与一个 DOM 元素相对应，所以 DOM 元素成为事件通信的介质就再自然不过了。

在浏览器端，事件之间的传递依托于浏览器提供的 DOM 元素之间的通信能力。在服务端，事件之间的传递则由经过扩展的 xmldom 软件包提供。非空组件对象之间的事件传递不难理解。这里主要通过下面的示例来看看空组件对象之间是如何传递事件的。

```js
// 11-15
Index: {
    xml: "<div id='index'>\
              <Widget id='widget'/>\
              <button id='trigger'>trigger</button>\
          </div>",
    fun: function (sys, items, opts) {
        sys.index.on("event", function (e) {
            console.log(e.target.elem());
        });
        sys.trigger.on("click", function(e) {
            sys.widget.trigger("event");
        });
    }
},
Widget: {}
```

此示例包含一个空组件 Widget，在组件 Index 的函数项中，当点击组件对象 widget 时，该对象会派发了一个 event 事件，该事件由其父级组件对象 index 捕获。由于组件对象默认 widget 对应一个 DOM 元素 void，并且组件对象 index 对应一个 DOM 元素 div ，所以由组件对象 widget 派发的事件就从 void 元素传递给 div 元素。这样就使得空组件也能传递事件，这可以说是系统为空组件生成 DOM 元素 void 的一个重要原因。