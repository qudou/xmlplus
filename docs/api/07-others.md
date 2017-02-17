# 其它

## value

```js
value()
```

- `Returns` : `ValueObject` 值对象

该函数用于返回组件对象的值对象。值对象可以是 `String`、`null` 以及 `undefined` 等任何类型。在下面示例中，组件 Target 的函数项的返回值即所谓的值对象，此处的值对象与 `items.example` 相等。

```js
// 07-01
Example: {
    xml: "<Target id='example'/>",
    fun: function (sys, items, opts) {
        var value = sys.example.value();
        console.log(value.text, value == items.example); // hello,world true
    }
},
Target: {
    fun: function (sys, items, opts) {
        return { text: "hello,world" };                  // 值对象由此返回
    }
}
```

## localName

```js
localName()
```

- `Returns` : `String` 组件名

该函数用于返回组件对象的组件名。注意，只有 HTML 元素对象和自定义组件对象才有组件名，也就是只有这两种对象才包含该函数接口。

```js
// 07-02
Example: {
    xml: "<div id='example'>\
            <Target id='target'/>\
          </div>",
    fun: function (sys, items, opts) {
        console.log(sys.example.localName());  // div
        console.log(sys.target.localName());   // Target
    }
},
Target: {}
```

## namespace

```js
namespace()
```

- `Returns` : `String` 组件的命名空间

该函数返回组件的命名空间，命名空间以绝对路径形式给出。下面示例中，组件 Example 和 Target 均位于命名空间 `//xp` 中。

```js
// 07-03
Example: {
    xml: "<Target id='example'/>",
    fun: function (sys, items, opts) {
        console.log(sys.example.namespace());  // //xp
    }
},
Target: {}
```

## guid

```js
guid()
```

- `Returns` : `String` 组件对象标识符

该函数返回组件对象的标识符。每一组件对象都有一个唯一的标识符，该标识符由全局函数 [guid](/api#全局-guid) 生成。

```js
// 07-04
Example: {
    xml: "<div id='example'/>",
    fun: function (sys, items, opts) {
        console.log(sys.example.guid());  // 一个组件对象标识符
    }
}
```

## toString

```js
toString()
```

- `Returns` : `String` 组件对象名或标识符

用于获得组件对象名或者标识符，仅当组件对象相应的 XML 元素不包含 `id` 属性时才返回唯一标识符，此时返回的标识符与系统函数 `guid` 返回的内容一致。

```js
// 07-05
Example: {
    xml: "<div id='example'><span/></div>",
    fun: function (sys, items, opts) {
        console.log(sys.example.toString());         // example
        console.log(sys.example.first().toString()); // 组件对象标识符
    }
}
```

## serialize

```js
serialize([serializeXML])
```

- `serializeXML` : `Boolean` 是否序列化组件的视图项，默认为 false
- `Returns` : `String` 一个 HTML 字符串

用于序列化视图项或者视图项所对应的 HTML DOM 文档树。注意，下面示例中的注释内容是去除了空格以后的结果。

```js
// 07-06
Example: {
    xml: "<div id='example'>\
            <Target id='target'/>\
          </div>",
    fun: function (sys, items, opts) {
        console.log(sys.example.serialize());      // <div><h1>hello, world</h1></div>
        console.log(sys.example.serialize(true));  // <div><Target id='target'/></div>
    }
},
Target: {
    xml: "<h1>hello, world</h1>"
}
```

## data

```js
data(key)
```

- `key` : `String` 关键字
- `Returns` : `Anything` 获取到的数据

该函数根据提供的关键字获取组件对象所绑定的数据。

```js
data(key,value)
```

- `key` : `String` 关键字
- `value` : `Anything` 与关键字相关联的值
- `Returns` : `SystemObject` 函数的调用者

该函数在组件对象上存储一个键值对。

```js
// 07-07
Example: {
    xml: "<div id='example'/>",
    fun: function (sys, items, opts) {
        sys.example.data("key", "value");
        console.log(sys.example.data("key"));   // value
    }
}
```

## removeData

```js
removeData(key)
```

- `key` : `String` 关键字
- `Returns` : `SystemObject` 函数的调用者

该函数根据提供的关键字移除组件对象所绑定的数据。

```js
// 07-08
Example: {
    xml: "<div id='example'/>",
    fun: function (sys, items, opts) {
        sys.example.data("key", "value");
        console.log(sys.example.data("key"));    // value
        sys.example.removeData("key");
        console.log(sys.example.data("key"));    // undefined
    }
}
```

## emptySystemCall

```js
emptySystemCall()
```

- `Returns` : `SystemObject` 函数的调用者

该函数的执行会使后续同一对象的系统接口调用失效，注意仅失效一次。

```js
// 07-09
Example: {
    xml: "<h1 id='example'>hello, world</h1>",
    fun: function (sys, items, opts) {
        sys.example.emptySystemCall();
        sys.example.css("color", "blue");             // 此语句无任何效果
        sys.example.css("border", "1px solid red");   // 此语句生效
    }
}
```