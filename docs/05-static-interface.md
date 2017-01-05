# 静态接口

静态接口，它是组件在初始化时允许提供的参数。它与应用的配置文件类似，在组件实例化之前就准备就绪的。静态接口由标签属性、配置项以及初始项按一定的优先级综合指定，最后生成的参数值会被当作构造函数的第三个参数传入。

## 使用默认初始值

任何一个用户自定义组件都包含一个参数项`opt`，它提供了组件实例化时所使用的默认的初始参数值。

下面给出的一个按钮组件，它对`button`元素作了简单的封装。此组件的参数项包含一个名为`fontSize`的初始输入值，在组件实例化的过程中，该参数会被复制到函数项的第三个参数`opts`中去。然后，函数项中用此值设置`button`元素的字体大小。这个值为`24`的`fontSize`给组件在初始化时提供了一个默认值。

```js
Button: {
    opt: { fontSize: 24 },
    xml: "<button id='foo'>hello</button>",
    fun: function( sys, items, opts ) {
        sys.foo.css("font-size", opts.fontSize + "px");
    }
} 
```

## 通过对象名指定初始值

参数项指定了元素的初始值，组件实例化时，有时需要覆盖初始值，这可以通过在被实例化的组件的配置项中重新设定来实现。下面是使用`Button`组件的一个示例：

```js
Index: {
    cfg: { foo: { fontSize: 16 } },
    xml: "<Button id='foo'/>"
}
```

示例中，配置项指定`foo`对象的`fontSize`初始输入值为`16`，它将覆盖默认值`24`，于是实例化后的按钮字体大小会是`16px`。

这里需要明确区分配置项`cfg`与参数项`opt`之间的异同，配置项完成已目标组件对象初始参数值的更改，也就是它会改变目标组件中已定义好的opt中的初始值。而参数项提供的是目标组件初始参数的默认值。

## 通过集体名指定初始值

前面是通过个体对象名在配置项中指定对象的初始值，现在来看如何通过集体对象名来给多个对象指定相同初始值。

```js
Index: {
    cfg: { button: { fontSize: 16 } },
    xml: "<div>\
              <Button id='foo'/>\
              <Button id='bar'/>\
          </div>"
    ali: { button: "div > *" }
}
```

在该示例中，别名项指定名称`button`为所有的`Button`组件。所以，配置项中`fontSize`的目标对象包含了所有的`Button`组件，故对象`foo`和`bar`的`fontSize`初始值都会被设置成16。

## 属性值作为输入初始值

除了以上的初始参数的设定方式外，还有一种更为便捷的初始参数设定方式。那就是直接通过属性输入值来更改组件参数的初始值。

```js
Index: {
    xml: "<Button fontSize='16'/>"
}
```

上面的fontSize值在实例化时会以字符串的形式被主动映射到`Button`组件的参数项`opt`中，从而覆盖原始的默认值。这种指定初始值的方式是最方便，但也有其局限性，它只能提供简单形式的输入，如果初始输入是一个复杂的对象，它就无能为力了。

默认情况下，属性值会以字符串的形式被映射到组件的参数项中，如果期望得到的数值型或者布尔型，就要在组件的映射项`map`中指定格式化参数`format`。

```js
Format: {
    opt: { fontSize: "24", width: "28px", disabled: "true" },
    map: { format: {"fontSize width": Number, "disabled": Boolean} },
    fun: function( sys, items, opts ) {
        console.log(opts.fontSize, typeof opts.fontSize);
        console.log(opts.width, typeof opts.width);
        console.log(opts.disabled, typeof opts.disabled);
    }
}
Index: {
    xml: "<Format fontSize='16'/>"
}
```

`Format`组件的映射项中的`format`指明如何格式化输入参数，在此组件中，`fontSize`和`width`最终会以数值方式出现在`opts`中。而`disabled`则会以布尔值出现在`opts`中。对于指定为Boolean的参数，如果相应的值是字符串'true'，则为真值，否则为假值。这里要注意格式化发生的时间，格式化是在参数被映射到`opts`后才发生的。

## 四种参数设定方式的优先级

现在有了四种设定初始参数值的方式，现在来看看它们之间的优先级别是怎样的，下面的示例给组件对象`foo`同时提供了`fontSize`的四种初始参数值，其中默认值为`24`。

```js
Index: {
    cfg: { foo: { fontSize: 10 }, button: { fontSize: 11 } },
    xml: "<Button id='foo' fontSize='12'/>"
    ali: { button: "div > *" }
}
```

为了便于说明它们的优先级别，现在给各种情形编号如下：

- A：使用默认的`fontSize`，其值为`24`
- B：使用`cfg`中`foo`的设置，其值为`10`
- C：使用`cfg`中`button`的设置，其值为`11`
- D：使用属性值，其值为`12`

那么它们的优先级次序是这样的：

>`D > B > C > A`

也就是说属性值具有最高有优先级，配置项中的值次之，然后到通过别名项设定的值，默认值的优先级是最低的。