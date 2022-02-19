# 数据绑定

## bind

```js
bind(target)
```

- `target` : `String | Number | Boolean | Object | Array` 被绑定的数据
- `Returns` : `Proxy` 数据绑定后的代理对象

该函数用于将一个组件对象与一个数据对象相绑定。根据绑定的数据类型的不同，可分三种情况：

1. 绑定的数据类型是字面量 `String | Number | Boolean`。

下面示例中，由 div 元素创建的组件对象 example 绑定了一个字符串："hello, world"。

```js
// 07-01
Example: {
    xml: "<div id='example'/>",
    fun: function (sys, items, opts) {
        sys.example.bind("hello, world");
        // 下面的语句不允许，会抛出异常
        //sys.example.bind({key: "str"});
    }
}
```

注意，由 html 元素创建的组件对象只能绑定字面量，不允许绑定普通对象(PlainObject)。但自定义的系统对象(SystemObject)却可以。

```js
// 07-04
Example: {
    xml: "<Input id='example' type='text'/>",
    fun: function (sys, items, opts) {
        sys.example.bind("hello, world");
    }
},
Input {
    xml: "<input id='model' type='text'/>
}
```

上面示例中，系统对象 example 绑定了字面量 "hello, world"。但对于这种情况，有个硬性规定：被绑定的组件对象中必需有个称作 model 的命名对象。


2. 绑定的数据类型是普通对象 `PlainObject`。

类型为 `PlainObject` 的数据只能与自定义对象相绑定，下面是一个简单的示例：

```js
// 07-02
Example: {
    xml: "<main id='example'>\
            <input id='input' type='text'/>\
          </main>",
    fun: function (sys, items, opts) {
        this.bind({input: "hello, world"});
    }
}
```

该示例中，绑定数据包含一个键为 input，值为 "hello, world" 的键值对。所以，若想成功绑定，被绑定的组件对象中必需有个称作 input 的命名对象。

上面示例中的键值对绑定的是个体对象，当然也可以是集体对象，请看下面的示例：

```js
// 07-02
Example: {
    xml: "<main id='example'>\
            <input id='text1' type='text'/>\
            <input id='text2' type='text'/>\
          </main>",
    ali: {input: "//input"},
    fun: function (sys, items, opts) {
        this.bind({input: "hello, world"});
    }
}
```

此示例中的键值对绑定的是集体对象 input，它包含了 text1 和 text2 两个对象。

下面是一个更复杂点的例子，绑定的数据对象包含两个键值对，每个键值对各绑定两个对象。

```js
// 07-02
Example: {
    xml: "<main id='example'>\
            <input type='text'/>\
            <input type='text'/>\
            <input type='radio' name='r' value='USA'/>\
            <input type='radio' name='r' value='China'/>\
          </main>",
    ali: {text: "//input[@type='text']", radio: "//input[@type='raido']"},
    fun: function (sys, items, opts) {
        this.bind({text: "hello, world", radio: "China"});
    }
}
```

3. 绑定的数据类型是数组 `Array`。

这种情况下，作为被绑定的组件对象成为数据的渲染器。当执行绑定后，系统会为数组中的每一个数据生成一个与渲染器类型相同的组件对象，并将数据赋值给该对象。请看下面的示例：

```js
// 07-03
Example: {
    xml: "<main id='example'>\
            <input id='input' type='text'/>\
          </main>",
    fun: function (sys, items, opts) {
        sys.input.bind([1,2,3,4]);
    }
}
```

该示例中，名为 input 的组件对象绑定了数组 [1,2,3,4]。绑定后，系统会生成 4 个 input 组件对象并将数组中的数据依次赋值给它们。

```js
// 07-04
Example: {
    xml: "<main id='example'>\
            <Input id='input' type='text'/>\
          </main>",
    fun: function (sys, items, opts) {
        sys.input.bind([{foo: 1},{foo: 2}]);
    }
},
Input {
    xml: "<input id='foo' type='text'/>
}
```