# 消息与通信

消息通信是除事件通信外的另一种组件之间的通信机制，它在许多方面类似于事件通信。

## 消息的派发与捕获

派发一个消息，使用系统函数`notify`。捕获一个消息，由系统函数`watch`来执行。对于下面的示例，在函数项执行完毕之前，`foo`对象派发了消息`msg`，该消息由`bar`对象捕获。

```js
Index: {
    xml: "<div>\
             <span id='foo'>foo</span>\
             <span id='bar'>bar</span>\
          </div>",
    fun: function(sys, items, opts) {
        sys.bar.watch("msg", function(e) {
            console.log(this.text());
        });
        sys.foo.notify("msg");
    }
}
```

侦听一个消息时，在回调函数中可以获取派发消息的对象引用。如下面的示例，`e.target`、`this`和`sys.foo`同属于一个对象的引用。

```js
Index: {
    xml: "<div>\
             <span id='foo'>foo</span>\
             <span id='bar'>bar</span>\
          </div>",
    fun: function(sys, items, opts) {
        sys.bar.watch("msg", function(e) {
            console.log(e.target == this, this == sys.foo); // true true
        });
        sys.foo.notify("msg");
    }
}
```

侦听一个消息时，在回调函数中可以获取侦听消息的对象引用，如下面的示例，`e.currentTarget`与`sys.bar`同属于一个对象的引用。

```js
Index: {
    xml: "<div>\
             <span id='foo'>foo</span>\
             <span id='bar'>bar</span>\
          </div>",
    fun: function(sys, items, opts) {
        sys.bar.watch("msg", function(e) {
            console.log(sys.bar == e.currentTarget); // true
        });
        sys.foo.notify("msg");
    }
}
```

`notify`函数在派发消息时可以携带数据。消息的侦听方在回调函数中可以获取到数据。下面示例中的`foo`对象派发的消息携带了两个数据：数值`37`和字符串`hello,world`，这两个数据依次由侦听方的回调函数的第二和第三个形参获得。

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

## 消息的注销

函数`unwatch`用于注销一个消息的侦听。`unwatch`函数需要一个称之为消息句柄的参数，消息句柄由`watch`函数返回。在下面这个例子中，由于在`sys.foo.watch`的回调函数中注销了被侦听的消息，所以这个回调函数只能被执行一次。

```js
Index: {
    xml: "<span id='foo'>foo</span>",
    fun: function(sys, items, opts) {
        var handler = sys.foo.watch("msg", function(e) {
            sys.foo.unwatch(handler);
            console.log(this.text());
        });
        sys.foo.notify("msg").notify("msg");
    }
}
```

一个消息的注销只能由侦听该消息的对象来执行，利用其它对象来注销是无效的。在下面示例的事件的侦听方的回调函数中，`sys.bar`对象试图注销由`sys.foo`注册的消息，这是无效的。

```js
Index: {
    xml: "<div>\
             <span id='foo'>foo</span>\
             <span id='bar'>bar</span>\
          </div>",
    fun: function(sys, items, opts) {
        var handler = sys.foo.watch("msg", function(e) {
            sys.bar.unwatch(handler);
            console.log(this.text());
        });
        sys.foo.notify("msg").notify("msg");
    }
}
```

## 消息的作用域

默认情况下，消息具有全局作用域，某对象派发一个消息，任何对象都可以对其进行捕获。当在组件的映射项中指定`msgscope`参数来限制消息的作用域时，由本组件及其子级派发的消息只能由本组件及其子级捕获。在下面的示例中，组件`Foo`的消息作用域被限制为本组件及其子级，所以在所有侦听消息`msg`的对象中，只有对象foo才能捕获该消息，而其它对象则无法捕获该消息。

```js
Index: {
    xml: "<div>\
             <Foo id='foo'/>\
             <span id='bar'>bar</span>\
          </div>",
    fun: function(sys, items, opts) {
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
    fun: function(sys, items, opts) {
        sys.span.watch("msg", function(e) {
            console.log("3", e.currentTarget.toString());
        });
    }
}
```

如果指定派发消息函数`notify`的第二个参数为`true`，那么消息是可以逃离作用域的，或者说系统是允许扩展消息的作用域的，这时若要传递数据，则在第三个参数中指定。下面的组件Foo是上面的改进版本，此版本的`Index`组件中的对象`bar`可以捕获来自对象`foo`的`msg`消息。

```js
Index: {
    xml: "<div>\
             <Foo id='foo'/>\
             <span id='bar'>bar</span>\
          </div>",
    fun: function(sys, items, opts) {
        sys.foo.watch("msg", function(e) {
            console.log("1", this.toString());
        });
        sys.bar.watch("msg", function(e) {
            console.log("2", this.toString());
        });
        sys.foo.notify("msg", true);
    }
}
```

当一个消息的作用域建立后，其它区域的对象无论派发什么消息，本作用域都无法接收。本作用域只能接收来自本作用域的消息。下面示例中，由于`Foo`组件建立了消息作用域，尽管Index组件中的bar对象派发了消息`msg`，`foo`对象也无法捕获该消息。

```js
Index: {
    xml: "<div>\
             <Foo id='foo'/>\
             <span id='bar'>bar</span>\
          </div>",
    fun: function(sys, items, opts) {
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

消息作用域的扩展有其限制，它只能往上一级扩展。下面的示例展示了这一点。

```js
Index: {
    xml: "<Foo id='foo'/>",
    fun: function(sys, items, opts) {
        this.watch("msg", function(e) {
            console.log("index");
        });
        sys.foo.watch("msg", function(e) {
            console.log("foo in Index");
        });
    }
},
Foo: {
    xml: "<Bar id='bar'/>",
    map: { msgscope: true },
    fun: function(sys, items, opts) {
        sys.bar.watch("msg", function(e) {
            console.log("foo in Foo");
        });
    }
},
Bar: {
    xml: "<span id='bar'>bar</span>",
    map: { msgscope: true },
    fun: function(sys, items, opts) {
        setTimeout(function() {
            sys.bar.notify("msg", true);
        }, 0);
    }
}
```

该示例中，`Index`组件包含`Foo`组件，`Foo`组件包含`Bar`组件，Bar组件由独立的`span`元素构成。`Foo`组件和`Bar`组件都建立了各自的消息作用域。最终由`Bar`组件对象内部派发的消息，只有其上一级Foo对象的实例才能接收，而其上上级`Index`组件对象则无法接收该消息。

消息通信与事件通信的异同

消息通信与事件通信是组件之间的两种不同的通信机制。

事件通信基于`W3C`制定的`DOM`事件标准，组件之间的事件通信实际上是浏览器上`DOM`元素之间的事件通信。而消息通信则是纯粹组件之间的通信，与`DOM`元素无关。

消息有作用域的概念，组件之间消息的传递发生的作用域之内，系统允许消息扩展其作用域。而事件则是以由下而上的冒泡方式来传递的，当然也可以控制事件是否冒泡。

事件是无法在除了由下而上的组件之间传递信息的，而消息则不然，这是事件机制的一个局限性。

在所有的事件集中，包含默认的浏览器事件，比如按钮的点击事件，鼠标的移动事件等等。而对于所有的消息，都是由组件自定义的，并不存在默认的消息集。