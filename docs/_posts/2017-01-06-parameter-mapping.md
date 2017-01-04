# 参数映射

---

组件在初始化时，初始数据由函数项的第三个参数提供，并且这个参数只允许在函数项中使用。参数映射机制使得该参数的部分内容可以被拷贝到该组件内部的子组件中去，从而为子组件的初始化提供初始输入。参数映射分为两类，一类是到内部组件属性的映射，另一类是到组件配置项的映射。下面分别从这两个方面来讲述。

## 到组件属性的映射

对于默认的`html`文本框`input`，想必大家都用过，这节要通过组件化技术对其进行简单的封装扩展，增加数据的格式化输入输出能力。

为了明确最终组件的行为，下面首先给出该组件的应用示例：

```js
Index: {
    xml: "<div>\
             <Input id='foo'/>\
             <Input id='bar' format='int'/>\
          </div>",
    fun: function ( sys, items, opts ) {
        items.foo.val("hello, world");
        items.bar.val(27.1828);
        console.log("foo", items.foo.val());
        console.log("bar", items.bar.val());
    }
} 
```

示例中实例化了两个`Input`组件。`Input`组件允许接收一个`format`参数作为其静态接口输入，并提供一个函数`val`作为其动态输入输出接口。`format`参数有三种可能的值：`string`(默认)、`int`以及`float`，分别对应三种数据类型：字符串型、整型和浮点型。函数`val`根据`format`的值来进行格式化输入输出。下面是示例的输出结果：

>hello, world
>227

对象`foo`的`format`采用默认值`string`，所以输入`hello, world`以字符串原样输出。对象`bar`的`format`值是`int`，所以输入`27.1828`会被格式化为整型数`27`输出。

在了解完组件Input的功能与行为后，现在给出的Input实现也就不难理解了：

```js
Input: {
    xml: "<input id='input' type='text'/>",
    opt: { format: "string" },
    fun: function ( sys, items, opts ) {
        var parsers = {"int": parseInt, "float": parseFloat, "string": String};
        function val(value) {
            var parser = parsers[opts.format];
            if (value == undefined)
                return parser(sys.input.prop("value"));
            sys.input.prop("value", parser(value));
        }
        return { val: val };
    }
}
```

该实现包含一个格式化函数表，函数表根据`format`的值选择相应的格式化函数来格式化输入输出。我们的目的是扩展`input`标签的功能，但保留原有的行为接口。下面试着通过`Input`组件来使用`input`标签的原始功能。

```js
Index: {
    xml: "<Input id='foo' disabled='true'/>"
}
```

当然，文本框并没有被禁用。回顾下前面的内容，这里的`disabled`属性最终会被拷贝到`Input`组件的函数项的第三个参数中去。而函项数中并没有设定`input`标签`disabled`属性的代码，所以文本框没有被禁用也就合情合理了。好了，现在来改造`Input`组件，使它支持`disabled`的属性功能。

```js
Input: {
    xml: "<input id='input' type='text'/>",
    opt: { format: 'string' },
    fun: function ( sys, items, opts ) {
        var parsers = {"int": parseInt, "float": parseFloat, "string": String};
        if (opts.disabled)
            sys.input.attr("disabled", opts.disabled);
        function val(value) {
            var parser = parsers[opts.format];
            if (value == undefined)
                return parser(sys.input.prop("value"));
            sys.input.prop("value", parser(value));
        }
        return { val: val };
    }
}
```
新组件在其函数项中，添加了设定`disabled`属性的代码。现在`Input`已经支持`disabled`属性了，然而`input`的标签还有许多其它的属性，比如`value、placeholder、readonly`等等，自然可以在Input的构造函数中一个个添加进去，但这就显得有些烦索了。要简化这些操作，需要系统能自动完成从函数项的第三个参数`opts`到`input`属性的映射。这可以通过在`Input`组件的映射项中做些配置来实现。现在使用属性映射，重新构建`Input`组件如下：

```js
Input: {
    xml: "<input id='input' type='text'/>",
    opt: { format: 'string' },
    map: { attrs: { input: "disabled value placeholder readonly" } },
    fun: function ( sys, items, opts ) {
        var parsers = {"int": parseInt, "float": parseFloat, "string": String};
        function val(value) {
            var parser = parsers[opts.format];
            if (value == undefined)
                return parser(sys.input.prop("value"));
            sys.input.prop("value", parser(value));
        }
        return {val: val};
    }
}
```

此组件映射项包含了一个attrs配置，该配置用于建立从函数项的第三个参数`opts`到相应内部对象属性的映射，这里指定的对象是唯一的`input`标签，需要映射的属性列由一字符串给出，字符串由空格分隔，每一分隔项对应一个需要映射的属性名。下面是使用新的Input组件的一个示例：

```js
Index: {
    xml: "<Input id='foo' readonly='true' value='hello world!'/>"
}
```

如果一切顺利的话，运行上面示例，应该可以看到一个只读的文本框。

## 到组件配置项的映射

将组件的初始参数映射到当前组件的配置项与映射到相应内部组件的属性部分，所做的配置是类似的。

现在假定有这么一个需求，它要求将上面实现的两个Input组件组合成一个新的组件Form，Form组件仅仅需要一个format输入，该format值最终会被映射给内部的两个Input组件，同时它还提供一个动态接口函数val，函数val将两个Input的值组合成数组输出。我们首先想到的是使用系统的属性映射来实现。

```js
Form: {
    xml: "<div xmlns:i='@'>\
             price: <i:Input id='foo' value='2'/><br/>\
             count: <i:Input id='bar' value='3'/>\
          </div>",
    map: { attrs: { foo: ["format"], bar: ["format"] } },
    fun: function ( sys, items, opts ) {
        function val() {
            return [items.foo.val(), items.bar.val()];
        }
        return { val: val };
    }
}
```

这样的实现是完全没有问题的，还有一种实现方式是使用配置项映射。它不是将函数项的第三个参数opts中参数映射到组件内的相关对象的属性中去，而是映射到当前组件的配置项中去，且看下面的实现：

```js
Form: {
    xml: "<div xmlns:i='@'>\
             price: <i:Input id='foo' value='2'/><br/>\
             count: <i:Input id='bar' value='3'/><br/>\
          </div>",
    cfg: { foo: {format: "int"}, bar: {format: "int"} },
    map: { cfgs: { foo: "format", bar: "format" } },
    fun: function ( sys, items, opts ) {
        function val() {
            return [items.foo.val(), items.bar.val()];
        }
        return { val: val };
    }
}
```

为了清楚地了解映射行为是如何发生的，上面的组件明确给出配置项cfg，配置项cfg与标签的属性类似，它给出了相关对象的部分初始输入值。组件中，实例foo和bar的format初始值都被设定为"int",它覆盖了默认的初始值"string"。现在请注意映射项中的cfgs参数，它的值与前面的attrs是一样的，它指出在本组件实例化时，函数项的第三个参数opts中的format值会被拷贝到与foo对象和bar对象相关联的配置项中。

```js
Index: {
    xml: "<div xmlns:i='@'>\
            <i:Form id='foo'/>\
            <i:Form id='bar' format='float'/>\
            <button id='btn'>check</button>
          </div>",
    fun: function ( sys, items, opts ) {
        sys.btn.on("click", function(e) {
            console.log("foo", sys.foo.val());
            console.log("bar", sys.bar.val());
        });
    }
}
```

上面是组件Form的一个使用示例，foo对象不提供format输入，将采用默认值，根据前面的分析，它是`int`，`bar`对象设置`format`的值为`float`，它会被映射到组件`Form`的配置项的相应项中，最终作用于组件内部的两个子组件Input。读者可以在文本框中输入不同的内容，以验证输出情况是否符合预期。

下面给出组件Form的另一种写法，它首先在组件的别名部分命名一个集体对象`form`，然后在配置项和映射项中引用此集体名以作配置，达到的效果是一样的。当要对众多对象作相同的配置时，采用这种方式会更方便些。

```js
Form: {
    xml: "<div xmlns:i='@'>\
             price: <i:Input id='foo' value='2'/><br/>\
             count: <i:Input id='bar' value='3'/>\
          </div>",
    ali: { form: "Input" },
    cfg: { form: { format: "int" } },
    map: { cfgs: { form: "format" } },
    fun: function ( sys, items, opts ) {
        function val() {
            return [items.foo.val(), items.bar.val()];
        }
        return { val: val };
    }
}
```

现在思考一个问题，Form组件中无论使用到属性的映射还是到配置项的映射，都能达到所要求的目的。那么对于Input组件，情况还是一样吗？答案是否定的，这是由于Input组件包含了基本的html元素标签input，input元素在实例化时，并不使用配置项的指定值，它只使用节点的属性值。所以，对于Input组件而言，只能选择到属性的映射，这是属性映射机制存在的一个重要理由。