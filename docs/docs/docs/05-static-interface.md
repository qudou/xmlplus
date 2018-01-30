# 静态接口

静态接口可以理解为组件在初始化时允许提供的参数。它与一些应用的配置文件类似，在组件实例化之前就准备就绪的。静态接口由组件的标签属性、配置项以及参数项按一定的优先级综合指定，最后生成的参数值会被当作函数项的第三个参数传入。

## 使用默认初始值

任何一个自定义组件都包含一个显式的或者隐式的参数项 `opt`，它提供了组件实例化时所使用的默认的初始参数值。

下面给出的一个按钮组件，它对 button 元素作了简单的封装。此组件的参数项包含一个名为 `fontSize` 的初始输入值。在组件实例化过程中，该参数会被复制到函数项的第三个参数 `opts` 中去。然后，函数项中用此值设置 button 元素的字体大小。这个值为 `24` 的 `fontSize` 给组件在初始化时提供了一个默认值。

```js
// 05-01
Button: {
    opt: { fontSize: 24 },
    xml: "<button id='foo'>hello</button>",
    fun: function (sys, items, opts) {
        sys.foo.css("font-size", opts.fontSize + "px");
    }
} 
```

## 通过对象名指定初始值

参数项指定了元素的初始值，组件实例化时，有时需要覆盖初始值，这可以通过在被实例化的组件的配置项中重新设定来实现。下面是使用组件 Button 的一个示例：

```js
// 05-02
Index: {
    cfg: { foo: { fontSize: 16 } },
    xml: "<Button id='foo'/>"
}
```

示例中，配置项指定组件对象 foo 的 `fontSize` 初始输入值为 `16`。该初始值会覆盖默认值 `24`，于是实例化后的按钮字体大小会是 `16px`。

这里需要明确区分配置项 `cfg` 与参数项 `opt` 之间的异同。上面示例中，配置项指的是缩主组件 Index 的配置项，它会改变目标组件 Button 中已定义好的参数项 `opt` 的初始参数值。而目标组件 Button 中的配置项在组件 Index 中是不可见的。

## 通过集体名指定初始值

前面, 我们通过个体对象的名称在配置项中指定该对象的初始值，现在来看如何通过集体对象名来给多个对象指定相同初始值。

```js
// 05-03
Index: {
    cfg: { button: { fontSize: 16 } },
    xml: "<div id='index'>\
              <Button id='foo'/>\
              <Button id='bar'/>\
          </div>",
    ali: { button: "//Button" }
}
```

在该示例中，别名项指定所有的 Button 组件对象的名称为 "button"。于是在配置项中，`fontSize` 的目标对象也就包含了所有的 Button 组件对象，从而组件对象 foo 和 bar 的 `fontSize` 初始值都会被设置成 `16`。

## 属性值作为输入初始值

除了以上的初始参数的设定方式外，还有一种更为便捷的初始参数设定方式。那就是直接通过组件的标签属性值来更改组件对象参数的初始值。

```js
// 05-04
Index: {
    xml: "<Button fontSize='16'/>"
}
```

上面的 `fontSize` 值在实例化时会以字符串的形式被主动映射到组件 Button 的参数项中，从而覆盖原始的默认值。这种指定初始值的方式是最方便，但也有其局限性。因为它只能提供简单形式的输入。如果初始输入是一个复杂的对象，它就无能为力了。

默认情况下，属性值会以字符串的形式被映射到组件的参数项中。如果期望得到的是数值型或者布尔型，就要在组件的映射项中指定格式化参数 `format`。

```js
// 05-05
Index: {
    xml: "<Format fontSize='16'/>"
},
Format: {
    opt: { setp: "28.5", fontSize: "24", width: "28px", disabled: "true" },
    map: { format: {"int": "step", "float": "fontSize width", "bool": "disabled"} },
    fun: function (sys, items, opts) {
        console.log(opts.step, typeof opts.step);
        console.log(opts.fontSize, typeof opts.fontSize);
        console.log(opts.width, typeof opts.width);
        console.log(opts.disabled, typeof opts.disabled);
    }
}
```

组件 Format 的映射项中的 `format` 参数指明如何格式化输入参数。在此组件中，`step` 被格式化为整型，`fontSize` 和 `width` 被格式化为浮点型，而 `disabled` 则被格式化为布尔型。

注意，对于类型为 `bool` 的参数，如果相应的值是字符串 `true`，则为真值，否则为假值。

## 四种参数设定方式的优先级

上面描述了四种设定初始参数值的方式。现在来看看它们之间的优先级是怎样的。下面的示例给组件对象 foo 同时提供了 `fontSize` 的四种初始参数值，其中默认值为 `24`。

```js
// 05-06
Index: {
    cfg: { foo: { fontSize: 10 }, button: { fontSize: 11 } },
    xml: "<Button id='foo' fontSize='12'/>",
    ali: { button: "//button" }
}
```

为了便于说明它们的优先级别，现在给各种情形编号如下：

- A：使用默认的 `fontSize`，其值为 `24`
- B：使用 `cfg` 中 foo 的设置，其值为 `10`
- C：使用 `cfg` 中 button 的设置，其值为 `11`
- D：使用属性值，其值为 `12`

为了测定优先级，你可以每次测定出最高优先级的输入后，将其记录下来，然后移除它。之后再测定出次优先级别的配置，以此类推。那么你最终得到的优先级次序是这样的：

```
D > B > C > A
```

也就是说组件的标签属性值具有最高有优先级，配置项中的值次之，然后是通过别名项设定的值，而默认值的优先级是最低的。