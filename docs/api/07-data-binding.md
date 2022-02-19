# 数据绑定

## bind

```js
bind(target)
```

- `target` : `String | Number | Boolean | Object | Array` 被绑定的数据
- `Returns` : `Proxy` 数据绑定后的代理对象

##　数据绑定的三种类型

该函数用于将一个组件对象与一个数据对象相绑定。根据绑定的数据类型的不同，可分三种情况：

1. 绑定的数据类型是字面量 `String | Number | Boolean`。

下面示例中，由 div 元素创建的组件对象 example 绑定了一个字符串："hello, world"。

```js
// 07-01
Example: {
    xml: "<div id='example'/>",
    fun: function (sys, items, opts) {
        sys.example.bind("hello, world");
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

数组中的元素除了可以为字面量，还可以是数组或者普通对象。下面是一个示例：

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

## 解除绑定

上面讲的是如何将组件对象与数据进行绑定，现在我们来看下如何将它们解绑。请看下面的示例：

```js
// 07-01
Example: {
    xml: "<div id='example'>\
            <input id='input'/>\
            <button id='bind'>绑定</button>\
            <button id='unbind'>解绑</button>\
          </div>",
    fun: function (sys, items, opts) {
        sys.bind.on("click", function (e) {
            window.ret = sys.input.bind("hello, world");
        });
        sys.unbind.on("click", function (e) {
            window.ret.unbind();
        });
    }
}
```

这个示例中，我们创建了两个按钮，分别用于触发绑定与解绑定。其中，解绑操作需要通过绑定函数的返回值的 unbind 函数进行。通过实现可以发现，绑定操作不能重复进行，否则会有错误提示，除非解绑后才可以。

## 操作绑定后的数据

通过绑定结果的 model 对象进行相应操作，我们可以对被绑定对象进行间接处理。请看下面的示例：

```js
// 07-01
Example: {
    xml: "<div id='example'>\
            <input id='input'/>\
            <button id='bind'>绑定</button>\
            <button id='unbind'>解绑</button>\
          </div>",
    fun: function (sys, items, opts) {
        window.ret = sys.input.bind("hello, world");
    }
}
```

此示例对 input 对象绑定了某字符串，现在我们通过控制台操作它。我们可以用下面的命令改变这个字符串。

```js
ret.model = "hello, welcome"
```

现在我们再删除它，看会发生什么。

```js
delete ret.model
ret.model = "hello, welcome"
```

当 `delete ret.model` 语句执行时，发现 label 组件对象也被删除了，并且下面的赋值语句变成了常归操作。

现在我们刷新页面，先执行解绑操作，再进行赋值，看会发生什么。

```js
ret.model.unbind()
ret.model = "hello, welcome"
```

通过这个示例可以发现，解绑后，再执行赋值会对数重新进行绑定。实现上，如果对于未解绑的 model 进行赋值，系统会先解绑后再执行绑定操作。此时的赋值操作等效于下面两个语句：

```js
ret.model.unbind()
sys.input.bind("hello, welcome")
```

## 数据导出
