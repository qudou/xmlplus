# 参数映射

组件在初始化时，初始数据由函数项的第三个参数提供，并且此参数仅允许在函数项中使用。参数映射机制使得该参数的部分内容可以被拷贝到子组件对象中去，从而为子组件对象的初始化提供初始输入。参数映射分为两类，一类是到内部组件对象属性的映射，另一类是到组件配置项的映射。下面分别从这两个方面来讲述。

## 到内部组件对象属性的映射

这节要使用模块化技术对 HTML 文本框进行简单的封装扩展，增加数据的格式化输入输出能力。为了明确组件的功能，下面首先给出该组件的应用示例。

```js
// 06-01
Index: {
    xml: "<div id='index'>\
             <Input id='foo'/>\
             <Input id='bar' format='int'/>\
          </div>",
    fun: function (sys, items, opts) {
        items.foo.val = "hello, world";
        items.bar.val = 27.1828;
        console.log("foo", items.foo.val);
        console.log("bar", items.bar.val);
    }
} 
```

此示例实例化了两个组件 Input。组件 Input 允许接收一个 `format` 参数作为其静态接口输入，并提供一个属性 `val` 作为其动态输入输出接口。`format` 参数有三种可能的值：`string` (默认)、`int` 以及 `float`。这三种值分别对应三种数据类型：字符串型、整型和浮点型。属性 `val` 根据 `format` 的值来进行格式化输入输出。下面是示例的输出结果：

```
hello, world
227
```

组件对象 `foo` 的参数 `format` 的默认值是 `string`，所以输入值 `hello, world` 以字符串原样输出。组件对象 bar 的 `format` 值是 `int`，所以输入值 `27.1828` 会被格式化为整型数 `27` 输出。

在了解完组件 Input 的功能与行为后，现在给出的 Input 实现也就不难理解了。

```js
// 06-01
Input: {
    xml: "<input id='input' type='text'/>",
    opt: { format: "string" },
    fun: function (sys, items, opts) {
        var parse = {"int": parseInt, "float": parseFloat, "string": String}[opts.format];
        function getValue() {
            return parse(sys.input.prop("value"));
        }
        function setValue(value) {
            sys.input.prop("value", parse(value));
        }
        return Object.defineProperty({}, "value", { get: getValue, set: setValue });
    }
}
```

该实现包含一个格式化函数表，函数表根据 `format` 的值选择相应的格式化函数来格式化输入输出。当然，我们的目的不仅于此，还希望能保留部分原有的行为接口。下面试着通过组件 Input 来使用 input 标签的原始功能。

```js
// 06-02
Index: {
    xml: "<Input disabled='true'/>"
}
```

上述给 Input 标签设置了 disabled 属性。 然而，文本框并没有被禁用。回顾下前面的内容，这里的 `disabled` 属性最终会被拷贝到组件 Input 的函数项的第三个参数中去。而函数项中并没有设定 input 标签 `disabled` 属性的代码，所以文本框没有被禁用也就合情合理了。好了，现在来改造组件 Input，使它支持属性 `disabled` 的功能。

```js
// 06-03
Input: {
    xml: "<input id='input' type='text'/>",
    opt: { format: 'string' },
    fun: function (sys, items, opts) {
        var parse = {"int": parseInt, "float": parseFloat, "string": String}[opts.format];
        if (opts.disabled)
            sys.input.attr("disabled", opts.disabled);
        function getValue() {
            return parse(sys.input.prop("value"));
        }
        function setValue(value) {
            sys.input.prop("value", parse(value));
        }
        return Object.defineProperty({}, "value", { get: getValue, set: setValue });
    }
}
```
在新组件的函数项中，添加了设定属性 `disabled` 的代码。虽然，现在的组件 Input 已经支持 `disabled` 属性了，但是 input 的标签还有许多其它的属性，比如 `value、placeholder、readonly` 等等。自然可以在函数项中逐一添加进去，但这就显得有些烦索了。要简化这些操作，需要系统能自动完成从函数项的第三个参数 `opts` 到 input 属性的映射。这可以通过在组件 Input 的映射项中做些配置来实现。现在使用属性映射，重新构建组件 Input 如下：

```js
// 06-04
Input: {
    xml: "<input id='input' type='text'/>",
    opt: { format: 'string' },
    map: { attrs: { input: "disabled value placeholder readonly" } },
    fun: function (sys, items, opts) {
        var parse = {"int": parseInt, "float": parseFloat, "string": String}[opts.format];
        function getValue() {
            return parse(sys.input.prop("value"));
        }
        function setValue(value) {
            sys.input.prop("value", parse(value));
        }
        return Object.defineProperty({}, "value", { get: getValue, set: setValue });
    }
}
```

此组件的映射项包含一个 `attrs` 配置。该配置用于建立从函数项的第三个参数 `opts` 到相应内部对象属性的映射，这里指定的对象是唯一的 input 元素对象。需要映射的属性列由一字符串给出，该字符串由空格分隔且每一分隔项对应一个需要映射的属性名。下面是新组件的一个应用示例：

```js
// 06-04
Index: {
    xml: "<Input placeholder='please input' value='hello world'/>"
}
```

## 到组件配置项的映射

将组件对象的初始参数映射到配置项与映射到内部组件对象的属性部分，所做的配置是类似的。

现在有这么一个需求，它要求将上面实现的两个 Input 组件组合成一个新组件。新组件仅需要一个 `format` 输入值，该值最终会被映射给内部的两个 Input 组件对象。同时新组件还提供一个只读属性接口 `val`，该接口可将两个 Input 的值组合成数组输出。我们首先想到的是使用上述的属性映射来实现。

```js
// 06-05
Form: {
    xml: "<div id='form'>\
             price: <Input id='foo' value='2.2'/><br/>\
             count: <Input id='bar' value='3.3'/>\
          </div>",
    map: { attrs: { foo: "format", bar: "format" } },
    fun: function (sys, items, opts) {
        function getValue() {
            return [items.foo.value, items.bar.value];
        }
        return Object.defineProperty({}, "val", { get: getValue });
    }
}
```

这样的实现是完全没有问题的。然而，还有一种实现方式是使用配置项映射。它不是将参数项中的参数映射给相关对象属性，而是映射到当前组件的配置项中去。请看下面的实现。

```js
// 06-06
Form: {
    xml: "<div id='form'>\
             price: <Input id='foo' value='2.2'/><br/>\
             count: <Input id='bar' value='3.3'/>\
          </div>",
    cfg: { foo: {format: "string"}, bar: {format: "string"} },
    map: { cfgs: { foo: "format", bar: "format" } },
    fun: function (sys, items, opts) {
        function getValue() {
            return [items.foo.value, items.bar.value];
        }
        return Object.defineProperty({}, "value", { get: getValue });
    }
}
```

为了清楚地了解映射行为是如何发生的，上面的组件明确给出配置项，尽管该配置项是多余的。配置项中的内容与标签的属性类似，它给出了相关对象的部分初始输入值。请注意映射项中的 `cfgs` 参数，它的值与前面的 `attrs` 是一样的。该参数指出在本组件实例化时，函数项的第三个参数 `opts` 中的 `format` 值会被拷贝到哪里。对于此示例，该位置是与组件对象 foo 和 bar 相关联的配置项。现在来看使用该组件的一个示例。

```js
// 06-06
Index: {
    xml: "<div id='index'>\
            <Form id='foo' format='int'/>\
            <Form id='bar' format='float'/>\
            <button id='btn'>check</button>\
          </div>",
    fun: function (sys, items, opts) {
        sys.btn.on("click", function(e) {
            console.log("foo", items.foo.value);
            console.log("bar", items.bar.value);
        });
    }
}
```

该示例中，组件对象 `foo` 设置 `format` 的值为 `int`，组件对象 `bar` 设置 `format` 的值为 `float`。它们会被映射到组件 Form 的配置项的相应项中，最终作用于组件内部的两个子组件 Input。读者可以在文本框中输入不同的内容，以验证输出情况是否符合预期。

下面给出组件 Form 的另一种写法。它首先在组件的别名项命名一个集体对象 inputs，然后在配置项和映射项中使用此集体名来做相关的配置。这种做法达到的效果与前面是一致的。当要对众多对象作相同的配置时，采用这种方式会更方便些。

```js
// 06-07
Form: {
    xml: "<div id='form'>\
             price: <Input id='foo' value='2.2'/><br/>\
             count: <Input id='bar' value='3.3'/>\
          </div>",
    ali: { inputs: "//Input" },
    map: { cfgs: { inputs: "format" } },
    fun: function (sys, items, opts) {
        function getValue() {
            return [items.foo.value, items.bar.value];
        }
        return Object.defineProperty({}, "value", { get: getValue });
    }
}
```

现在思考一个问题：在组件 Form 中，无论使用到属性的映射还是到配置项的映射，都能达到所要求的目的。那么对于 Input 组件，情况还是一样吗？答案是否定的。这是由于 Input 组件包含了基本的 HTML 元素标签 input，input 元素在实例化时，并不使用配置项的指定值，它只使用节点的属性值。所以，对于组件 Input 而言，只能选择到属性的映射，这是属性映射机制存在的一个重要理由。

## 同名映射与异名映射

前面所讲的映射都是同名映射，也就是原来属性名或者对象名是什么，映射后目标的对象名也就是什么。现在来看如何进行异名映射，请看下面的示例。

```js
// 06-08
Input_1: {
    xml: "<input id='foo'/>",
    opt: { val: "hello, world" },
    map: { attrs: { foo: "val->value" } }
}
```

在这个例子中，参数项中包含一个名为 `val` 的字符串。同时，映射项中包含一个异名映射描述，该描述包含一个单向箭头。该描述指出，参数项中的名为 `val` 的字符串被映射给组件对象 foo 的 `value` 属性。下面的示例描述了到指定对象的异名配置项映射。

```js
// 06-08
Input_2: {
    xml: "<Input id='foo'/>",
    opt: { val: "hello, world" },
    map: { cfgs: { foo: "val->value" } }
}
```