# 事件与通信

组件之间的通信，包含事件与消息两方面的内容。这里讲述的事件通信基于`W3C`制定的`DOM`事件标准，但略有不同，读者应注意区分。

## 事件的侦听

侦听事件，需要调用系统函数`on`来实现，下面的代码侦听按钮的`click`事件。当点击按钮时，控制台上会打印出相应的字符串。

```js
Index: {
    xml: "<button id='btn'>click</button>",
    fun: function ( sys, items, opts ) {
        sys.btn.on("click", function(e) {
            console.log("hello, world");
        });
    }
}
```

组件对象可以侦听某一对象的事件，也可以侦听若干个对象的事件，这可以在系统函数`on`的第二个参数中指定，它要求一个`xpath`选择器。如下例所示，它通过顶层节点`top`侦听了所有的`button`元素派发的`click`事件。

```js
Index: {
    xml: "<div id='top'>\
             <button>button-A</button>\
             <button>button-B</button>\
          </div>",
    fun: function ( sys, items, opts ) {
        sys.top.on("click", "./*", function(e) {
            console.log(this.text());
        });
    }
}
```

上例中的`xpath`选择器`./*`选取的结果并不包含`top`对象本身，`top`对象作为检索操作的上下文而存在。

侦听一个事件时，在回调函数中可以获取派发事件的对象引用，如下面的示例，当用户点击按钮时，控制台上会输出两个`true`值。这表明`e.target`、`this`和`sys.btn`同为派发事件的对象引用。

```js
Index: {
    xml: "<button id='btn'>click</button>",
    fun: function ( sys, items, opts ) {
        sys.btn.on("click", function(e) {
            console.log(e.target == sys.btn, e.target == this); // true true
        });
    }
}
```

当然，侦听一个事件时，在回调函数中也可以获取侦听事件的对象引用，如下面的示例，`e.currentTarget`与`sys.top`同属于一个对象的引用。

```js
Index: {
    xml: "<div id='top'>\
             <button>click</button>\
          </div>",
    fun: function ( sys, items, opts ) {
        sys.top.on("click", function(e) {
            console.log(e.currentTarget == sys.top); // true
        });
    }
}
```

## 事件的注销

系统函数 off 用于注销一个事件的侦听，下面是该函数的完整声明。此函数允许提供最多两个实参，分别是事件类型和侦听函数。如果不提供任何的实参，则该函数执行后将注销与相应对象相关联的所有侦听器。

```js
sys.target.off([eventType][,listener])
```

在下面这个例子中，由于在`sys.btn.on`的回调函数中注销了被侦听的事件，所以这个回调函数只能被执行一次。

```js
Index: {
    xml: "<button id='btn'>click</button>",
    fun: function ( sys, items, opts ) {
        sys.btn.on("click", function (e) {
            sys.btn.off("click");
            console.log("hello, world");
        });
    }
}
```

另外，可以使用系统函数`once`达到与上例同样的目的，这时无需在回调函数中显示地移除侦听器。该函数确保注册的回调函数只能被执行一次，下面的示例展示了这一点。

```js
Index: {
    xml: "<button id='btn'>click</button>",
    fun: function ( sys, items, opts ) {
        sys.btn.once("click", function (e) {
            console.log("hello, world");
        });
    }
}
```

一个事件的注销只能由侦听该事件的对象来执行，利用其它对象来注销是无效的。下面的`Index`组件实例自身侦听了`click`事件，但回调函数中`sys.btn`对象试图注销该事件，这是无效的。

```js
Index: {
    xml: "<button id='btn'>click</button>",
    fun: function ( sys, items, opts ) {
        this.on("click", function(e) {
            sys.btn.off("click");
            console.log("hello, world");
        });
    }
}
```

## 事件的派发

除了默认产生的事件外，组件还可以派发自定义的事件，系统函数`trigger`就专门干这事的。下面的构造函数通过对象`span`在结尾处派发了一个自定义事件，该事件最终被顶层对象`top`侦听到。

```js
Index: {
    xml: "<div id='top'>\
             <span id='span'>trigger</span>\
          </div>",
    fun: function(sys, items, opts) {
        sys.top.on("event", function(e) {
            console.log("hello, world");
        });
        sys.span.trigger("event");
    }
}
```

系统函数`trigger`在派发事件时可以携带数据，事件侦听方可以在回调函数中获取到数据。下面的`span`对象派发的事件携带了两个数据，该数据分别由侦听方的回调函数的第二和第三个形参获得。

```js
Index: {
    xml: "<div id='top'>\
             <span id='span'>trigger</span>\
          </div>",
    fun: function ( sys, items, opts ) {
        sys.top.on("event", function(e, a, b) {
            console.log(a, b); // 1 hello
        });
        sys.span.trigger("event", [1,"hello"]);
    }
}
```

## 事件的冒泡行为

默认情况下，许多事件是允许冒泡的。如下面的示例所示，按钮的父级`div`层可以侦听来自此按钮的点击事件。

```js
Index: {
    xml: "<div id='top'>\
             <Button/>\
          </div>",
    fun: function ( sys, items, opts ) {
        sys.top.on("click", function(e) {
            console.log("I'm in Index");
        });
    }
},
Button: {
    xml: "<button id='btn'></button>",
    fun: function ( sys, items, opts ) {
        sys.btn.on("click", function(e) {
            console.log("I'm in Button");
        });
    }
}
```

可以通过调用事件的`stopPropagation`函数来阻止事件的冒泡行为。下面的`Button`组件是在上面`Button`组件的基础上修改而来的，它阻止了事件的冒泡行为。

```js
Button: {
    xml: "<button id='btn'></button>",
    fun: function ( sys, items, opts ) {
        sys.btn.on("click", function(e) {
            e.stopPropagation();
            console.log("I'm in Button");
        });
    }
}
```

当派发自定义事件时，默认情况下是允许事件冒泡的。但当指定`trigger`函数的第二个参数为`false`值时，派发的事件就不是冒泡的，这时要传递的数据在函数的第三个参数中给出。在下面的示例中，由于`span`对象在派发事件时指定不冒泡，所以`top`对象是无法侦听到来自`span`对象的`event`事件。

```js
Index: {
    xml: "<div id='top'>\
             <span id='span'>trigger</span>\
          </div>",
    fun: function ( sys, items, opts ) {
        sys.top.on("event", function(e, a, b) {
            console.log(a, b); // 1 hello
        });
        sys.span.trigger("event", false, [1,"hello"]);
    }
}
```

## 阻止事件的默认行为

在浏览器端，默认情况下，当用户点击一个`url`链接时，浏览器会跳转到相应的页面。若要阻止这类的默认行为，可以通过调用事件的`preventDefault`函数来实现。

```js
Index: {
    xml: "<a id='link' href='/'>click</a>",
    fun: function ( sys, items, opts ) {
        sys.link.on("click", function(e) {
            e.preventDefault();
        });
    }
}
```

## 事件通信的介质

在`W3C`制定的`DOM`事件标准中，事件在`DOM`元素之间传递。虽然表面上系统中的事件的传递发生在组件对象之间，但在其本质上，事件的传递发生于`DOM`元素之间。在《嵌套》的章节中讲过，每一组件实例都与一个`DOM`元素相对应，从而`DOM`元素成为事件通信的介质就再自然不过了。现在通过下面的示例来看看空组件是如何传递事件的。

```js
Index: {
    xml: "<div id='top'>\
              <Widget id='widget'/>\
          </div>",
    fun: function ( sys, items, opts ) {
        sys.top.on("event", function(e) {
            console.log(e.target.elem());
        });
        sys.widget.trigger("event");
    }
},
Widget: {}
```

此示例包含一个空组件`Widget`，在组件`Index`的函数数项中，`widget`派发一个event事件，该事件由其父级组件`top`捕获。由于组件对象默认`widget`对应一个`DOM`元素`void`，对象`top`对应一个`DOM`元素`div`，所以由`widget`对象派发的事件就从`void`元素传递给`div`元素，让空组件也能传递事件。这可以说是系统为空组件生成`DOM`元素`void`的一个重要原因。