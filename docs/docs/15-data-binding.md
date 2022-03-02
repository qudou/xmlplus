# 数据绑定

所谓数据绑定是指将 JSON 数据对象与相应的组件对象进行绑定，之后通过操作数据即可间接地操作 DOM 节点。同时，DOM 节点上相关的数据变化也可以及时反馈到数据上来。

## 数据绑定的三种类型

根据绑定数据类型的不同，可分为三种情况讨论：

一、绑定的数据是字面量 `String | Number | Boolean`

下面示例中，由 `div` 元素创建的组件对象 `index` 绑定了一个字符串：`"hello, world"`。

```js
// 15-01
Index: {
    xml: "<div id='index'/>",
    fun: function (sys, items, opts) {
        sys.index.bind("hello, world");
    }
}
```

注意，由 HTML 元素创建的组件对象只能绑定字面量，不允许绑定普通对象，但自定义的系统对象却可以。

```js
// 15-02
Index: {
    xml: "<Input id='index' type='text'/>",
    fun: function (sys, items, opts) {
        sys.index.bind("hello, world");
    }
},
Input: {
    xml: "<input id='index' type='text'/>"
}
```

此例中，系统对象 index 绑定了字面量 `"hello, world"`。对于这种情况，被绑定的组件对象的任意子级必需有个 HTML 元素对象与被绑定的组件对象同名。

上面示例中，对于 `Input` 组件，我们可以对其内部的 `input` 元素对象命名为 `index`。但假定上述的 `Input` 组件是第三方提供，其内部的 `input` 元素对象的名称是 `foo`，那我们又该如果描述绑定的目标对象呢？请看下面的示例：

```js
// 15-03
Index: {
    xml: "<Input id='index' type='text'/>",
    map: {bind: {model: {skey: "foo"}}},
    fun: function (sys, items, opts) {
        sys.index.bind("hello, world");
    }
},
Input: {
    xml: "<input id='foo' type='text'/>"
}
```

在这里，我们在映射项 `map` 中对要绑定的目标数据指定了检索目标名 `foo`，这样系统就会按此目标名去检索要绑定的对象。

注意，由于字面量是单一的数据，所以系统会默认给他分配一个名为 `model` 的键名。

二、绑定的数据类型是普通对象

类型为普通对象的数据只能与自定义对象相绑定，下面是一个简单的示例：

```js
// 15-04
Index: {
    xml: "<input id='index' type='text'/>",
    fun: function (sys, items, opts) {
        this.bind({index: "hello, world"});
    }
}
```

该示例中，绑定数据包含一个键为 `index`，值为 `"hello, world"` 的键值对。所以，若想成功绑定，被绑定的组件对象中必需有个称作 `index` 的命名对象。请注意，这里的被绑定对象是 `this`，与前一个示例有所不同。该示例中的键值对绑定的是个体对象，当然也可以是集体对象，请看下面的示例：

```js
// 15-05
Index: {
    xml: "<div id='index'>\
            <input id='text1' type='text'/>\
            <input id='text2' type='text'/>\
          </div>",
    ali: {text: "//input"},
    fun: function (sys, items, opts) {
        this.bind({text: "hello, world"});
    }
}
```

此示例中的键值对绑定的是集体对象 `text`，它包含了 `text1` 和 `text2` 两个组件对象。

下面我们来个更复杂的例子，绑定的数据对象包含两个键值对，每个键值对各绑定两个组件对象。

```js
// 15-06
Index: {
    xml: "<div id='index'>\
            <input type='text'/>\
            <input type='text'/>\
            <input type='radio' name='n' value='USA'/>\
            <input type='radio' name='n' value='China'/>\
          </div>",
    ali: {text: "//input[@type='text']", radio: "//input[@type='radio']", },
    fun: function (sys, items, opts) {
        this.bind({text: "hello, world", radio: "China"});
    }
}
```

下面再给出一个联动表单的示例。这里将单选按钮列表与菜单列表绑定到同一个数据对象，它们中的任何一方改变，都会导致另一方的选中项发生变更。

```js
// 15-07
Index: {
    xml: "<div id='index'>\
            <input type='radio' name='n' value='USA'/>\
            <input type='radio' name='n' value='China'/>\
            <select id='select'>\
                <option>USA</option>\
                <option>China</option>\
            </select>\
          </div>",
    ali: {country: "//input | //select", },
    fun: function (sys, items, opts) {
        this.bind({country: "China"});
    }
}
```

三、绑定的数据类型是数组

这种情况下，作为被绑定的组件对象成为数据的渲染器。当执行绑定后，系统会为数组中的每一个子项生成一个与渲染器类型相同的组件对象，并将数据与该对象绑定。请看下面的示例：

```js
// 15-08
Index: {
    xml: "<div id='index'>\
            <input id='input' type='text'/>\
          </div>",
    fun: function (sys, items, opts) {
        sys.input.bind([1,2,3,4]);
    }
}
```

该示例中，名为 `input` 的组件对象绑定了数组 `[1,2,3,4]`。绑定后，系统会生成 4 个组件对象并将数组中的数据依次赋值给它们。

数组中的元素除了可以为字面量，还可以是普通对象或者数组，这将形成递归绑定。请参考下面的示例：

```js
// 15-09
Index: {
    xml: "<div id='index'>\
            <Input id='text' type='text'/>\
          </div>",
    fun: function (sys, items, opts) {
        sys.text1.bind([{foo: 1},{foo: 2}]);
    }
},
Input {
    xml: "<input id='foo' type='text'/>"
}
```

最后，请注意根节点不允许绑定数组，否则系统会报错。

## 解除绑定

上面讲的是如何将组件对象与数据进行绑定，现在我们来看下如何将它们解绑。请看下面的示例：

```js
// 15-10
Index: {
    xml: "<div id='index'>\
            <span/>\
            <input type='text'/>\
          </div>",
    ali: {text: "//span | //input"},
    fun: function (sys, items, opts) {
        var ret = this.bind({text: "hello, world"});
        setTimeout(ret.unbind, 10*1000);
    }
}
```

这个示例中，我们将一个字符串绑定到一个 `span` 组件对象和一个 `input` 组件对象。然后设置了一个定时器，10 秒钟之后，定时器触发，代理对象的解绑函数得到执行。此后，在文本框中输入任何内容，`span` 组件对象都不会同步更新。

## 取值与赋值函数

系统对于被绑定的 HTML 元素对象，有默认的取值与赋值操作。当然，你可以自定义取值与赋值函数以覆盖默认行为。请看下面的示例所示：

```js
// 15-11
Index: {
    xml: "<input id='index' type='text'/>",
    map: { bind: { model: {get: e=>{return e.value.replace(/#/,'')}, set: (e,v)=>{e.value='#'+v}}} },
    fun: function (sys, items, opts) {
        window.ret = sys.index.bind("hello, world");
    }
}
```

此例在映射项中对被绑定对象 `text` 配置自定义的取值与赋值操作函数。其中取值函数 `get`，对于取到值会先替换掉首字符 `'#'` 再返回。而赋值函数 set，则在赋值之前会给数据值添加首字符 `'#'` 后才对被绑定对象赋值。

## 操作绑定后的数据

通过绑定结果的 `model` 对象进行相应操作，我们可以对被绑定对象进行间接处理。请看下面的示例：

```js
// 15-12
Index: {
    xml: "<input id='index' type='text'/>",
    fun: function (sys, items, opts) {
        window.ret = sys.index.bind("hello, world");
    }
}
```

此示例对 `index` 对象绑定了某字符串，现在我们通过控制台操作它。我们可以用下面的命令改变这个字符串。

```js
ret.model = "hello, welcome"
```

现在我们再删除它，看会发生什么。

```js
delete ret.model
ret.model = "hello, welcome"
```

当 `delete ret.model` 语句执行时，发现 `text` 组件对象也被删除了，并且下面的赋值语句变成了常归操作。

现在我们刷新页面，先执行解绑操作，再进行赋值，看会发生什么。

```js
ret.model.unbind()
ret.model = "hello, welcome"
```

通过这个示例可以发现，解绑后，再执行赋值会对数重新进行绑定。实现上，如果对于未解绑的 `model` 进行赋值，系统会先解绑后再执行绑定操作。此时的赋值操作等效于下面两个语句：

```js
ret.model.unbind()
sys.text.bind("hello, welcome")
```

上面操作的是字面量，现在来看下怎么对绑定数据类型为数组的返回代理执行操作。请看下面的示例：

```js
// 15-13
Index: {
    xml: "<div id='index'>\
            <input id='text' type='text'/>\
          </div>",
    fun: function (sys, items, opts) {
        window.ret = sys.text.bind([1,2,3,4]);
    }
}
```

现在我们依次执行赋值、push、pop 等操作，看会发生什么。

```js
ret.model[2] = 9    // 数组值变为 [1,2,9,4]，同时第3个文本框的值变为 9
ret.model.pop()     // 数组值变为 [1,2,9]，返回值 "4"，第4个文本框消失
ret.model.push(5)   // 数组值变为 [1,2,9,5]，新增一个文本框，其内容为 5
```

## 数据导出

接上面的示例我们知道，通过函数 `bind` 返回的是代理对象。但我们通常需要返回普通的 JSON 对象值，这可以通过 `export` 函数实现。

```js
ret.export()
```

对于绑定的数据，导出的对象与它具有相同的结构。