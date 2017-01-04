# 继承

继承是组件复用的一种方式，自定义组件只能继承其它的自定义组件，而无法继承来自匿名空间的组件。一个组件要继承另一个组件，需要在该组件的映射项中用`extend`项指明。下面的`Button`组件继承了当前命名空间的组件`Widget`。`extend`中的`from`项指明了被继承的原组件。

```js
Widget: {
    css: ".$btn { color: blue }",
    xml: "<button id='btn'>label</button>"
},
Button: {
    css: ".$btn { border: 1px solid red; }",
    map: { extend: {"from": "@:Widget"} }
}
```

## 样式项的继承

对于原组件样式项的继承，默认情况下将采用字符串拼接的方式。如上例中，最终得到组件的样式项将会是如下的样子。

```css
.$btn { color: blue }
.$btn { border: 1px solid red; }
```


如果希望替换掉原组件的样式项，可以在`extend`项中指明，下面的`Button`组件指明了不使用继承项的样式，而只用组件自有的样式项。

```js
Button: {
    css: ".$btn { border: 1px solid red; }",
    map: { extend: {"from": "@:Widget", css: "r"} } // 这里r的意思是replace
} 
```

## 视图项的继承

对于视图项的继承，如果组件中不包含视图项，那么就采用继承组件的视图项。如下面的`Button`组件，它直接引用来自`Widget`组件的视图项。

```js
Button: {
    map: { extend: {"from": "Widget"} }
}
```

如果组件中指定了视图项，那么就采用组件自身的视图项。如下面的`Button`组件，它使用的是自已的视图项。

```js
Button: {
    xml: "<span>label</span>",
    map: { extend: {"from": "Widget"} }
}
```
 
## 函数项的继承

对于函数项的继承，分四种情况讨论。

首先，如果继承组件中存在函数项的替换配置，那么继承组件的函数项会替换掉被继承组件的函数项，而不论被继承组件是否包含函数项。如下面的示例所示，组件`Button`最终会采用的自身的函数项。

```js
Widget: {
    xml: "<button id='btn'>label</button>",
    fun: function (sys, items, opts) {
        console.log("hello, widget");
    }
},
Button: {
    map: { extend: {"from": "Widget", fun: "r"} },
    fun: function (sys, items, opts) {
        console.log("hello, button");
    }
}
```

其次，若继承组件中不存在函数项的替换配置，且被继承组件不含函数项，这时会采用自身的函数项。下面的示例给出了这种情况。

```js
Widget: {
    xml: "<button id='btn'>label</button>"
},
Button: {
    map: { extend: {"from": "Widget"} },
    fun: function (sys, items, opts) {
        console.log("hello, button");
    }
}
```

第三种情况是，继承组件中不存在函数项的替换配置，且继承组件自身也不含函数项，这时会延用的继承组件的函数项。下面的示例给出了这种情况。

```js
Widget: {
    xml: "<button id='btn'>label</button>",
    fun: function (sys, items, opts) {
        console.log("hello, widget");
    }
},
Button: {
    map: { extend: {"from": "@:Widget"} }
}
```

最后一种情况是，继承组件中不存在函数项的替换配置，且继承组件和被继承组件均包含函数项。在这种情况下，函数项将由下面的函数替代。

```js
function () {
    var foo = source.fun.apply(this, [].slice.call(arguments));
    var bar = target.fun.apply(this, [].slice.call(arguments));
    return bar ? $.extend(bar, foo) : foo;
} 
```

其中的`source`代表继承组件自身，`target`代表被继承组件。可以看出，最终函数的导出接口会由两个函数综合给出，只是后者的具有更高的优先级。

## 其它项的继承

除了上面的组件项外，其它项包括别名项、参数项、配置项以及映射项，这些项具有相同的继承方式。如果继承组件中存在指定项的替换配置，那么就使用继承组件的相关项。比如下面的Button组件，它会使用自身的参数项。

```js
Widget: {
    xml: "<button id='btn'>label</button>",
    opt: { border: "2px", background: "red" }
},
Button: {
    opt: { border: "1px" color: "blue" },
    map: { extend: {"from": "@:Widget", opt: "r"} }
} 
```

如果继承组件中不存在指定项的替换配置，那么由继承组件的项来有保留地覆盖被继承组件的相关项来得到最终项。就拿上面的`Button`组件来说，如果除去参数项的替换配置，那么最终采用的会是如下所示的参数项。

```js
{ border: "1px", background: "red", color: "blue" }
```

此参数项是这样得到的，首先，由于组件`Button`中不存在`background`样式，所以组件`Widget`中的`background`样式得以保留。其次，组件`Widget`和组件`Button`都包含`border`样式。此时，组件`Button`的`border`样式就会覆盖组件`Widget`的`border`样式。