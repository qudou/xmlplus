# 通信

与通信相关的 API 在文档的相关章节有详细介绍，这里仅给出个概要。更多内容请参考 [事件与通信](/docs#事件与通信) 以及 [消息与通信](/docs#消息与通信)。

## on

```js
on(eventType[,selector],handler)
```

- `eventType` : `String` 事件类型，比如 `click` 或者 `submit`
- `selector` : `String` xpath 表达式，比如 `*` 或者 `/div`
- `handler` : `Function(Event event)` 侦听器
- `Returns` : `SystemObject` 函数的调用者

该函数用于侦听一个事件，该事件可以是浏览器固有事件，也可以是系统对象接口 `trigger` 派发的事件。其中可选的 `selector` 参数用于筛选侦听的目标对象。更多内容请参考 [事件的侦听](/docs#事件与通信-事件的侦听)。

```js
// 06-01
Example: {
    xml: "<button id='example'>click</button>",
    fun: function (sys, items, opts) {
        sys.example.on("click", function(e) {
            console.log("hello, world");
        });
    }
}
```

## off

```js
off([handler])
off(selector[,handler])
off(eventType[,selector][,handler])
```

- `eventType` : `String` 事件类型，比如 `click` 或者 `submit`
- `selector` : `String` xpath 表达式，比如 `*` 或者 `/div`
- `handler` : `Function(Event event)` 侦听器
- `Returns` : `SystemObject` 函数的调用者

该函数用于取消一个事件的侦听，其中，不提供任何参数的函数调用将取消目标对象上注册的所有事件的侦听。更多内容请参考 [事件的注销](/docs#事件与通信-事件的注销)。

```js
// 06-02
Example: {
    xml: "<button id='example'>click</button>",
    fun: function (sys, items, opts) {
        sys.example.on("click", function (e) {
            sys.example.off("click");
            console.log("hello, world");
        });
    }
}
```

## once

```js
once(eventType[,selector],handler)
```

- `eventType` : `String` 事件类型，比如 `click` 或者 `submit`
- `selector` : `String` xpath 表达式，比如 `*` 或者 `/div`
- `handler` : `Function(Event event)` 侦听器
- `Returns` : `SystemObject` 函数的调用者

该函数用于侦听一个事件，它与函数 `on` 的差别仅在于，前者仅侦听一次事件，后者可以多次侦听同一事件。更多内容请参考 [事件的侦听](/docs#事件与通信-事件的侦听)。

```js
// 06-03
Example: {
    xml: "<button id='example'>click</button>",
    fun: function (sys, items, opts) {
        sys.example.once("click", function (e) {
            console.log("hello, world");
        });
    }
}
```

## trigger

```js
trigger(eventType[,data])
```

- `eventType` : `String` 事件类型，比如 `click` 或者 `submit`
- `data` : `Anything` 一个数组或者其他的任意的数据类型。
- `Returns` : `SystemObject` 函数的调用者

该函数用于派发一个事件，可选参数 `data` 可以携带额外的数据。更多内容请参考 [事件的派发](/docs#事件与通信-事件的派发)。

```js
// 06-04
Example: {
    xml: "<div id='example'>\
             <span id='span'>trigger</span>\
          </div>",
    fun: function (sys, items, opts) {
        sys.example.on("event", function(e) {
            console.log("hello, world");
        });
        sys.span.trigger("event");
    }
}
```

## watch

```js
watch(messageType,handler[,priority])
```

- `messageType` : `String` 消息类型，比如 `push` 或者 `ok`
- `handler` : `Function(Message message)` 侦听器
- `priority` : `Number` 优先级，可以是 Infinity
- `Returns` : `SystemObject` 函数的调用者

该函数用于侦听一个消息，该消息仅由系统函数 `notify` 派发。其中可选的 `priority` 参数用于指定回调函数的优先级。更多内容请参考 [消息的派发与捕获](/docs#消息与通信-消息的派发与捕获)。

```js
// 06-05
Example: {
    xml: "<div id='example'/>",
    fun: function (sys, items, opts) {
        sys.example.watch("msg", function(e) {
            console.log(this.toString());
        }).notify("msg");
    }
}
```

## unwatch

```js
unwatch([handler])
unwatch(messageType[,handler])
```

- `messageType` : `String` 事件类型，比如 `push` 或者 `ok`
- `handler` : `Function(Message message)` 侦听器
- `Returns` : `SystemObject` 函数的调用者

该函数用于取消一个消息的侦听，其中，不提供任何参数的函数调用将取消目标对象上注册的所有消息的侦听。更多内容请参考 [消息的注销](/docs#消息与通信-消息的注销)。

```js
// 06-06
Example: {
    xml: "<span id='example'>foo</span>",
    fun: function (sys, items, opts) {
        sys.example.watch("msg", function(e) {
            sys.example.unwatch("msg");
            console.log(this.text());
        });
        sys.example.notify("msg").notify("msg");
    }
}
```

## glance

```js
glance(messageType,handler[,priority])
```

- `messageType` : `String` 消息类型，比如 `push` 或者 `ok`
- `handler` : `Function(Message message)` 侦听器
- `priority` : `Number` 优先级，可以是 Infinity
- `Returns` : `SystemObject` 函数的调用者

该函数用于侦听一个消息，它与函数 `watch` 的差别仅在于，前者仅侦听一次消息，后者可以多次侦听同一消息。更多内容请参考 [消息的派发与捕获](/docs#消息与通信-消息的派发与捕获)。

```js
// 06-07
Example: {
    xml: "<span id='example'>foo</span>",
    fun: function (sys, items, opts) {
        sys.example.glance("msg", function(e) {
            console.log(this.text());
        });
        sys.example.notify("msg").notify("msg");
    }
}
```

## notify

```js
notify(messageType[,data])
```

- `messageType` : `String` 一个事件类型，比如 `push` 或者 `ok`
- `data` : `Anything` 一个数组或者其他的任意的数据类型
- `Returns` : `SystemObject` 函数的调用者

该函数用于派发一个消息，可选参数 `data` 可以携带额外的数据。更多内容请参考 [消息的派发与捕获](/docs#消息与通信-消息的派发与捕获)。

```js
// 06-08
Example: {
    xml: "<div id='example'>\
             <span id='foo'>foo</span>\
             <span id='bar'>bar</span>\
          </div>",
    fun: function (sys, items, opts) {
        sys.bar.watch("msg", function(e, a, b) {
            console.log(a, b); // 37 hello,world
        });
        sys.foo.notify("msg", [37, "hello,world"]);
    }
}
```