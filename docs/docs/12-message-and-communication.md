# 消息与通信

消息通信是除事件通信外的另一种组件对象之间的通信机制。下面列出的是与消息通信相关的系统函数，它与事件通信有许多相似之处。

- [watch](/api#通信_watch)：侦听消息
- [unwatch](/api#通信_unwatch)：取消消息侦听
- [glance](/api#通信_glance)：仅一次侦听消息
- [notify](/api#通信_notify)：派发消息
- [messages](/api#通信_messages)：获取系统对象消息作用域内的所有已被侦听的消息字符串

## 消息的派发与捕获

派发一个消息，使用系统函数 `notify`。捕获一个消息，由系统函数 `watch` 来执行。对于下面的示例，在函数项执行完毕之前，组件对象 index 派发了消息 msg，该消息由组件对象 foo 捕获。

```js
// 12-01
Index: {
    xml: "<div id='index'>\
             <span id='foo'>foo</span>\
          </div>",
    fun: function (sys, items, opts) {
        sys.foo.watch("msg", function (e) {
            console.log("hello, world");
        });
        sys.index.notify("msg");
    }
}
```

侦听一个消息时，在侦听器中可以获取派发消息的对象引用。如下面的示例，`e.target` 和 `sys.index` 同属于一个对象的引用。

```js
// 12-02
Index: {
    xml: "<div id='index'>\
             <span id='foo'>foo</span>\
          </div>",
    fun: function (sys, items, opts) {
        sys.foo.watch("msg", function (e) {
            console.log(e.target == sys.index); // true
        });
        sys.index.notify("msg");
    }
}
```

侦听一个消息时，在侦听器中还可以获取侦听消息的对象引用，如下面的示例，`e.currentTarget`、`this` 与 `sys.foo` 同属于一个对象的引用。

```js
// 12-03
Index: {
    xml: "<div id='index'>\
             <span id='foo'>foo</span>\
          </div>",
    fun: function (sys, items, opts) {
        sys.foo.watch("msg", function (e) {
            console.log(e.currentTarget == this, this == sys.foo); // true true
        });
        sys.index.notify("msg");
    }
}
```

系统函数 `notify` 在派发消息时可以携带数据，同时在消息的侦听器中可以获取到数据。下面示例中的组件对象 index 派发的消息携带了两个数据：数值 `37` 和字符串 `hello,world` ，这两个数据依次由侦听器的第二和第三个形参获得。

```js
// 12-04
Index: {
    xml: "<div id='index'>\
             <span id='foo'>foo</span>\
          </div>",
    fun: function(sys, items, opts) {
        sys.foo.watch("msg", function (e, a, b) {
            console.log(a, b); // 37 hello,world
        });
        sys.index.notify("msg", [37, "hello,world"]);
    }
}
```

在示例中，派发消息时，数据是以数组类型出现的。如果数据非数组类型并且仅传递一个数据对象，那么该数据可以无需要封装成数组对象而直接发送，正如下面的语句所示。

```js
sys.index.notify("msg", "hello,world");
```

## 消息的注销

系统函数 `unwatch` 用于注销一个消息的侦听。此函数允许提供最多两个实参，分别是消息类型和侦听函数。如果不提供任何的实参，则该函数执行后将注销与相应对象相关联的所有侦听器。

在下面这个例子中，由于在 `sys.foo.watch` 的回调函数中注销了被侦听的消息，所以这个回调函数只能被调用一次。

```js
// 12-05
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
// 12-06
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

一个消息的注销只能由侦听该消息的对象来执行，利用其它对象来注销是无效的。对于下面的示例，事件侦听方的回调函数中，组件对象 `sys.bar` 试图注销由组件对象 `sys.foo` 注册的消息，这是无效的。

```js
// 12-07
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

消息的作用域与派发消息的对象密切相关，它包含派发对象及其所有的子级。所以，非派发对象的子孙节点是接收不到派发对象所派发的消息的。

```js
// 12-08
Index: {
    xml: "<div id='index'>\
             <span id='foo'>foo</span>\
             <span id='bar'>bar</span>\
          </div>",
    fun: function (sys, items, opts) {
        sys.bar.watch("msg", function(e, info) {
            console.log(info);
        });
        sys.foo.notify("msg", "from foo");
		sys.index.notify("msg", "from index");
    }
}
```

此示例中，组件对象 foo 与 组件对象 bar 属于兄弟节点关系。所以，对于组件对象 foo 派发的消息，组件对象 bar 是无法接收的。但对于组件对象 index 派发的消息，组件对象 bar 是可以接收的。

## 消息过滤器

默认情况下，当一个组件对象派发某消息时，该对象及其所有的子级都可以对其进行侦听。但如果我们在自定义组件的 map 项中定义 msgFilter 选项，则可以对指定的消息进行过滤。

```js
// 12-09
Index: {
    xml: "<div id='index'>\
             <Bar id='bar'/>\
          </div>",
    fun: function (sys, items, opts) {
        sys.index.notify("msg").notify("info");
    }
},
Bar: {
    xml: "<span id='bar'>bar</span>",
	map: { msgFilter: /msg/ },
	fun: function (sys, items, opts) {
	    sys.bar.watch("msg", function(e) {
		    console.log("I can't receive msg!");
		});
		sys.bar.watch("info", function(e) {
		    console.log("I can receive info!");
		});
	}
}
```

在该示例中，组件对象 bar 的 map 项中定义了 msgFilter 选项。msgFilter 是一个正则表达式，它描述了不允许通过的消息集。所以，对于组件对象 index 派发的两个消息，只有 info 能被组件对象 bar 侦听到。

消息过滤仅针对组件对象的父级及父级以上的节点对象，而不包含组件对象自身。如果我们把上面示例的派发消息的对象换成 bar，那么，在 bar 组件对象中，msg 消息也可以被接收。

## 消息通信与事件通信的异同

事件通信基于 W3C 制定的 DOM 事件标准，组件对象之间的事件通信实际上是 DOM 元素之间的事件通信。而消息通信则是纯粹组件对象之间的通信，与 DOM 元素无关。

消息有作用域的概念，组件之间消息的传递发生的作用域之内。而事件则是以由下而上的冒泡方式来传递的，当然也可以控制事件是否冒泡。

事件是在由下而上的组件之间传递信息的，而消息则相反，它在由上而下的组件之间传递信息。

如果在浏览器端，在所有的事件集中，包含默认的浏览器事件，比如按钮的点击事件，鼠标的移动事件等等。而对于所有的消息，都是由组件自定义的，并不存在默认的消息集。