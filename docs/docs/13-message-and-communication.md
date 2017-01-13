# 消息与通信

消息通信是除事件通信外的另一种组件之间的通信机制，它在许多方面类似于事件通信。

## 消息的派发与捕获

派发一个消息，使用系统函数 `notify`。捕获一个消息，由系统函数 `watch` 来执行。对于下面的示例，在函数项执行完毕之前，组件对象 foo 派发了消息 msg，该消息由组件对象 bar 捕获。

```js
Index: {
    xml: "<div>\
             <span id='foo'>foo</span>\
             <span id='bar'>bar</span>\
          </div>",
    fun: function ( sys, items, opts ) {
        sys.bar.watch("msg", function(e) {
            console.log(this.text());
        });
        sys.foo.notify("msg");
    }
}
```

侦听一个消息时，在回调函数中可以获取派发消息的对象引用。如下面的示例，`e.target`、`this` 和 `sys.foo` 同属于一个对象的引用。

```js
Index: {
    xml: "<div>\
             <span id='foo'>foo</span>\
             <span id='bar'>bar</span>\
          </div>",
    fun: function ( sys, items, opts ) {
        sys.bar.watch("msg", function(e) {
            console.log(e.target == this, this == sys.foo); // true true
        });
        sys.foo.notify("msg");
    }
}
```

侦听一个消息时，在回调函数中可以获取侦听消息的对象引用，如下面的示例，`e.currentTarget` 与 `sys.bar` 同属于一个对象的引用。

```js
Index: {
    xml: "<div>\
             <span id='foo'>foo</span>\
             <span id='bar'>bar</span>\
          </div>",
    fun: function ( sys, items, opts ) {
        sys.bar.watch("msg", function(e) {
            console.log(sys.bar == e.currentTarget); // true
        });
        sys.foo.notify("msg");
    }
}
```

系统函数 `notify` 在派发消息时可以携带数据。消息的侦听方在回调函数中可以获取到数据。下面示例中的组件对象 foo 派发的消息携带了两个数据：数值 `37` 和字符串 `hello,world` ，这两个数据依次由侦听方的回调函数的第二和第三个形参获得。

```js
Index: {
    xml: "<div>\
             <span id='foo'>foo</foo>\
             <span id='bar'>bar</span>\
          </div>",
    fun: function(sys, items, opts) {
        sys.bar.watch("msg", function(e, a, b) {
            console.log(a, b); // 37 hello,world
        });
        sys.foo.notify("msg", [37, "hello,world"]);
    }
}
```

## 指定消息侦听器的优先级别

默认情况下，对于侦听同一个消息的不同组件对象，先注册的比后注册的会优先得到回馈。如果想改变这样次序，可以为系统函数 `watch` 或者 `glance` 指定第三个参数。请看下面的示例。

```js
Index: {
    xml: "<div>\
             <span id='foo'>foo</foo>\
             <span id='bar'>bar</span>\
             <span id='alice'>alice</span>\
          </div>",
    fun: function ( sys, items, opts ) {
        sys.foo.watch("msg", function(e) {
            console.log("foo");
        });
        sys.bar.watch("msg", function(e) {
            console.log("bar");
        }, 1);
        sys.alice.notify("msg");
    }
}
```

在该示例的函数项中，如果对于 `sys.bar.watch` 不指定第三个参数，那么控制台会先打印 foo，再打印 bar。而现在的结果确是相反的，表明该参数改变了回调函数调用次序的。此参数是一个数值，不指定则等同于指定为 `-Infinity` 。数值越大的，则优先级越高，相应的回调函数也就越先被调用。

## 消息的注销

系统函数 `unwatch` 用于注销一个消息的侦听，下面是该函数的完整声明。此函数允许提供最多两个实参，分别是消息类型和侦听函数。如果不提供任何的实参，则该函数执行后将注销与相应对象相关联的所有侦听器。

```js
sys.target.unwatch([msgType][,listener])
```

在下面这个例子中，由于在 `sys.foo.watch` 的回调函数中注销了被侦听的消息，所以这个回调函数只能被执行一次。

```js
Index: {
    xml: "<span id='foo'>foo</span>",
    fun: function ( sys, items, opts ) {
        sys.foo.watch("msg", function(e) {
            sys.foo.unwatch("msg");
            console.log(this.text());
        });
        sys.foo.notify("msg").notify("msg");
    }
}
```

另外，可以使用系统函数 `glance` 达到与上例同样的目的，这时无需在回调函数中显示地移除侦听器。该函数确保注册的回调函数只能被执行一次，下面的示例展示了这一点。

```js
Index: {
    xml: "<span id='foo'>foo</span>",
    fun: function ( sys, items, opts ) {
        sys.foo.glance("msg", function(e) {
            console.log(this.text());
        });
        sys.foo.notify("msg").notify("msg");
    }
}
```

一个消息的注销只能由侦听该消息的对象来执行，利用其它对象来注销是无效的。在下面示例的事件的侦听方的回调函数中，组件对象 `sys.bar` 试图注销由组件对象 `sys.foo` 注册的消息，这是无效的。

```js
Index: {
    xml: "<div>\
             <span id='foo'>foo</span>\
             <span id='bar'>bar</span>\
          </div>",
    fun: function ( sys, items, opts ) {
        var handler = sys.foo.watch("msg", function(e) {
            sys.bar.unwatch(handler);
            console.log(this.text());
        });
        sys.foo.notify("msg").notify("msg");
    }
}
```

## 消息的作用域

默认情况下，消息具有全局作用域，某对象派发一个消息，任何对象都可以对其进行捕获。当在组件的映射项中指定 `msgscope` 参数来限制消息的作用域时，由本组件及其子级派发的消息只能由本组件及其子级捕获。在下面的示例中，组件 Foo 的消息作用域被限制为本组件及其子级，所以在所有侦听消息 msg 的对象中，只有组件对象 foo 以及 span 才能捕获该消息，而组件对象 bar 则无法捕获该消息。

```js
Index: {
    xml: "<div>\
             <Foo id='foo'/>\
             <span id='bar'>bar</span>\
          </div>",
    fun: function ( sys, items, opts ) {
        sys.foo.watch("msg", function(e) {
            console.log("1", e.currentTarget.toString());
        });
        sys.bar.watch("msg", function(e) {
            console.log("2", e.currentTarget.toString());
        });
        sys.foo.notify("msg");
    }
},
Foo: {
    xml: "<span id='span'>foo</span>",
    map: { msgscope: true },
    fun: function ( sys, items, opts ) {
        sys.span.watch("msg", function(e) {
            console.log("3", e.currentTarget.toString());
        });
    }
}
```

另外，当一个消息的作用域建立后，其它区域的对象无论派发什么消息，本作用域都无法接收。本作用域只能接收来自本作用域的消息。下面示例中，由于 Foo 组件建立了消息作用域，尽管 Index 中的组件对象 bar 派发了消息 msg ，组件对象 foo 也无法捕获该消息。

```js
Index: {
    xml: "<div>\
             <Foo id='foo'/>\
             <span id='bar'>bar</span>\
          </div>",
    fun: function ( sys, items, opts ) {
        sys.foo.watch("msg", function(e) {
            console.log(this.toString());
        });
        sys.bar.notify("msg");
    }
},
Foo: {
    xml: "<span id='span'>foo</span>",
    map: { msgscope: true }
}
```

## 消息通信与事件通信的异同

事件通信基于 W3C 制定的 DOM 事件标准，组件之间的事件通信实际上是浏览器上 DOM 元素之间的事件通信。而消息通信则是纯粹组件之间的通信，与 DOM 元素无关。

消息有作用域的概念，组件之间消息的传递发生的作用域之内。而事件则是以由下而上的冒泡方式来传递的，当然也可以控制事件是否冒泡。

事件是无法在除了由下而上的组件之间传递信息的，而消息则不然，这是事件机制的一个局限性。

如果在浏览器端，在所有的事件集中，包含默认的浏览器事件，比如按钮的点击事件，鼠标的移动事件等等。而对于所有的消息，都是由组件自定义的，并不存在默认的消息集。