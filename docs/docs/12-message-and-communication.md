# 消息与通信

消息通信是除事件通信外的另一种组件对象之间的通信机制。下面列出的是与消息通信相关的系统函数，它与事件通信有许多相似之处。

- [watch](/api#通信_watch)：侦听消息
- [unwatch](/api#通信_unwatch)：取消消息侦听
- [glance](/api#通信_glance)：仅一次侦听消息
- [notify](/api#通信_notify)：派发消息

## 消息的派发与捕获

派发一个消息，使用系统函数 `notify`。捕获一个消息，由系统函数 `watch` 来执行。对于下面的示例，在函数项执行完毕之前，组件对象 foo 派发了消息 msg，该消息由组件对象 bar 捕获。

```js
// 12-01
Index: {
    xml: "<div id='index'>\
             <span id='foo'>foo</span>\
             <span id='bar'>bar</span>\
          </div>",
    fun: function (sys, items, opts) {
        sys.bar.watch("msg", function (e) {
            console.log(this.text());
        });
        sys.foo.notify("msg");
    }
}
```

侦听一个消息时，在侦听器中可以获取派发消息的对象引用。如下面的示例，`e.target`、`this` 和 `sys.foo` 同属于一个对象的引用。

```js
// 12-02
Index: {
    xml: "<div id='index'>\
             <span id='foo'>foo</span>\
             <span id='bar'>bar</span>\
          </div>",
    fun: function (sys, items, opts) {
        sys.bar.watch("msg", function (e) {
            console.log(e.target == this, this == sys.foo); // true true
        });
        sys.foo.notify("msg");
    }
}
```

侦听一个消息时，在侦听器中还可以获取侦听消息的对象引用，如下面的示例，`e.currentTarget` 与 `sys.bar` 同属于一个对象的引用。

```js
// 12-03
Index: {
    xml: "<div id='index'>\
             <span id='foo'>foo</span>\
             <span id='bar'>bar</span>\
          </div>",
    fun: function (sys, items, opts) {
        sys.bar.watch("msg", function (e) {
            console.log(sys.bar == e.currentTarget); // true
        });
        sys.foo.notify("msg");
    }
}
```

系统函数 `notify` 在派发消息时可以携带数据，同时在消息的侦听器中可以获取到数据。下面示例中的组件对象 foo 派发的消息携带了两个数据：数值 `37` 和字符串 `hello,world` ，这两个数据依次由侦听器的第二和第三个形参获得。

```js
// 12-04
Index: {
    xml: "<div id='index'>\
             <span id='foo'>foo</span>\
             <span id='bar'>bar</span>\
          </div>",
    fun: function(sys, items, opts) {
        sys.bar.watch("msg", function (e, a, b) {
            console.log(a, b); // 37 hello,world
        });
        sys.foo.notify("msg", [37, "hello,world"]);
    }
}
```

在示例中，派发消息时，数据是以数组格类型出现的。如果数据非数组类型并且仅传递一个数据对象，那么该数据可以无需要封装成数组对象而直接发送，正如下面的语句所示。

```js
sys.foo.notify("msg", "hello,world");
```

## 指定消息侦听器的优先级别

默认情况下，对于侦听同一个消息的不同组件对象，先注册的侦听器比后注册的会优先得到回馈。如果想改变这种默认的次序，可以为系统函数 `watch` 指定第三个参数。请看下面的示例。

```js
// 12-05
Index: {
    xml: "<div id='index'>\
             <span id='foo'>foo</span>\
             <span id='bar'>bar</span>\
             <span id='alice'>alice</span>\
          </div>",
    fun: function (sys, items, opts) {
        sys.foo.watch("msg", function (e) {
            console.log("foo");
        });
        sys.bar.watch("msg", function (e) {
            console.log("bar");
        }, 1);
        sys.alice.notify("msg");
    }
}
```

在该示例的函数项中，对于系统函数 `sys.bar.watch`，如果不指定第三个参数，那么控制台会先打印 foo，再打印 bar。而现在的结果却是相反的，这表明该优先级参数改变了侦听器的调用次序。此参数是一个数值，不指定则等同于 `-Infinity`。此参数值越大的，优先级越高，相应的侦听器也就越先被调用。

## 消息的注销

系统函数 `unwatch` 用于注销一个消息的侦听。此函数允许提供最多两个实参，分别是消息类型和侦听函数。如果不提供任何的实参，则该函数执行后将注销与相应对象相关联的所有侦听器。

在下面这个例子中，由于在 `sys.foo.watch` 的回调函数中注销了被侦听的消息，所以这个回调函数只能被调用一次。

```js
// 12-06
Index: {
    xml: "<span id='index'>foo</span>",
    fun: function (sys, items, opts) {
        sys.index.watch("msg", function (e) {
            sys.index.unwatch("msg");
            console.log(this.text());
        });
        sys.index.notify("msg").notify("msg");
    }
}
```

另外，可以使用系统函数 `glance` 达到与上例同样的目的，这时无需在回调函数中显示地移除侦听器。该函数确保注册的侦听器仅被调用一次，下面的示例展示了这一点。

```js
// 12-07
Index: {
    xml: "<span id='foo'>foo</span>",
    fun: function (sys, items, opts) {
        sys.foo.glance("msg", function (e) {
            console.log(this.text());
        });
        sys.foo.notify("msg").notify("msg");
    }
}
```

一个消息的注销只能由侦听该消息的对象来执行，利用其它对象来注销是无效的。在下面示例的事件的侦听方的回调函数中，组件对象 `sys.bar` 试图注销由组件对象 `sys.foo` 注册的消息，这是无效的。

```js
// 12-08
Index: {
    xml: "<div id='index'>\
             <span id='foo'>foo</span>\
             <span id='bar'>bar</span>\
          </div>",
    fun: function (sys, items, opts) {
        sys.foo.watch("msg", function (e) {
            sys.bar.unwatch("msg");
            console.log(this.text());
        });
        sys.foo.notify("msg").notify("msg");
    }
}
```

## 消息的作用域

默认情况下，消息具有全局作用域，某对象派发一个消息，任何对象都可以对其进行捕获。当在组件的映射项中指定 `msgscope` 参数来限制消息的作用域时，由本组件及其子级派发的消息只能由本组件及其子级捕获。在下面的示例中，组件 Foo 的消息作用域被限制为本组件及其子级，所以在所有侦听消息 msg 的对象中，只有 `id` 属性值为 `foo` 的组件对象才能捕获该消息，而组件对象 bar 则无法捕获该消息。

```js
// 12-09
Index: {
    xml: "<div id='index'>\
             <Foo id='foo'/>\
             <span id='bar'>bar</span>\
          </div>",
    fun: function (sys, items, opts) {
        sys.foo.watch("msg", function (e) {
            console.log("I can receive message.");
        });
        sys.bar.watch("msg", function(e) {
            console.log("I can't receive message.");
        });
        sys.foo.notify("msg");
    }
},
Foo: {
    xml: "<span id='foo'>foo</span>",
    map: { msgscope: true },
    fun: function (sys, items, opts) {
        sys.foo.watch("msg", function (e) {
            console.log("I can receive message too.");
        });
    }
}
```

另外，当一个消息作用域建立后，其它区域的对象无论派发什么消息，本作用域都无法接收。本作用域只能接收来自本作用域的消息。下面示例中，由于 Foo 组件建立了消息作用域，尽管 Index 中的组件对象 bar 派发了消息 msg ，组件对象 foo 也无法捕获该消息。

```js
// 12-10
Index: {
    xml: "<div id='index'>\
             <Foo id='foo'/>\
             <span id='bar'>bar</span>\
          </div>",
    fun: function (sys, items, opts) {
        sys.foo.watch("msg", function (e) {
            console.log("I can't receive message.");
        });
        sys.bar.notify("msg");
    }
},
Foo: {
    xml: "<span id='foo'>foo</span>",
    map: { msgscope: true }
}
```

## 消息通信与事件通信的异同

事件通信基于 W3C 制定的 DOM 事件标准，组件对象之间的事件通信实际上是浏览器上 DOM 元素之间的事件通信。而消息通信则是纯粹组件对象之间的通信，与 DOM 元素无关。

消息有作用域的概念，组件之间消息的传递发生的作用域之内。而事件则是以由下而上的冒泡方式来传递的，当然也可以控制事件是否冒泡。

事件是无法在除了由下而上的组件之间传递信息的，而消息则不然，这是事件机制的一个局限性，当然也算是优点。

如果在浏览器端，在所有的事件集中，包含默认的浏览器事件，比如按钮的点击事件，鼠标的移动事件等等。而对于所有的消息，都是由组件自定义的，并不存在默认的消息集。