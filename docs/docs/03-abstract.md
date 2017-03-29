# 抽象

前面两章，我们面对的都是一些简单的组件，并且对于如何创建自定义组件还没有足够的了解。这章就来探讨如何扩展基组件并创建实用的自定义组件，从而为复杂应用进行模块化设计奠定坚实的基础。

## 定义 IPv4 输入框组件

为了探讨抽象这个主题，本章会实现一个 IP 输入框，并达到类似下图右侧所示的输入框的效果。

<img src="/assets/images/docs/ipv4.jpg"/>

这种输入框包含四个小文本框，文本框之间以句点相间隔且仅允许输入最多三位的十进制数字。当文本框中输入数字达到三位时，焦点会自动跳转到下一文本框并选中该框文本。如果焦点位于最后一个文本框，则不进行跳转。如前面章节所述，一个组件需属于某一特定的命名空间。为简单起见，现在将其置于命名空间 `//xp` 中，该空间还包含另一个组件 Index，它是用于测试 IPv4Box 组件的。下面是代码的框架结构，具体实现细节由后面给出。

```js
// 03-01
xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {},
        IPv4Box: {}
    });
});
```

下面首先给出的是该组件的视图项，此视图项描述了该组件由哪些基组件组合而成。

```html
<!-- 03-01 -->
<div id='box'>
    <input/>.<input/>.<input/>.<input/>
</div> 
```

该视图项的顶层元素被命名为 box，box 的子级包含 4 个文本框以及 3 个分隔句点。下面给出它们的样式项：

```css
/* 03-01 */
#box { border:1px solid #ABADB3; display: inline-block; }
#box input { width: 28px; line-height: 19px; border:0; text-align:center; outline:none; } 
```

样式项设置了相应文本框的边框、颜色、尺寸和显示方式等样式。如果纯粹从外观上看，已经达到目的了，下面就来实现函数项部分，使得剩余功能得以生效。

```js
// 03-01
function (sys, items, opts) {
    var inputs = sys.box.children();
    sys.box.on("keypress", "input", function(e) {
        var next, ch = String.fromCharCode(e.which);
        if (!/[0-9]/.test(ch))
            return e.preventDefault();
        if (this.prop("value").length == 2) {
            next = this.next();
            next && next.elem().select();
        }
    });
    function getValue() {
        return inputs.map(function (item) {
            return item.prop("value")
        }).join('.');
    }
    function setValue(input) {
        var input = input.split(".");
        for (var i = 0; i < inputs.length; i++)
            inputs[i].prop("value", input[i]);
    }
    return Object.defineProperty({}, "value", { get: getValue, set: setValue });
}
```

在函数项中，组件对象 `sys.box` 侦听了各文本框对象的 `keypress` 事件，回调函数过滤非数字输入，且当输入达到 3 个字符长时，光标自动跳转到下一输入框并选中该框内容。此外，函数项还返回了一个用于设置和读取 IP 值的接口。此处涉及到事件通信相关的内容，后续会有专门的章节讲述，这里先略过。

## 使用 IPv4 输入框组件

现在已经定义好 IP 输入框组件，下面来看看如何使用该组件。

```js
// 03-01
Index: {
    css: "#addr { margin-bottom: 5px; }",
    xml: "<div id='index'>\
              地址：<IPv4Box id='addr'/><br/>\
              掩码：<IPv4Box id='musk'/>\
          </div>",
    fun: function (sys, items, opts) {
        items.addr.value = "192.168.0.1";
        items.musk.value = "255.255.255.0";
        console.log("addr", items.addr.value);
        console.log("musk", items.musk.value);
    }
}
```

由于组件 IPv4Box 与 Index 同属于一个命名空间，所以可以忽略命名空间的引用。在组件 Index 中，实例化了两个 IPv4Box 组件，分别命名为 addr 和 musk。函数项通过参数 `items` 引用了值对象 addr 和 musk，并调用接口 `value` 获取与设置相应的 IP 值。

注意，这里调用的组件 IPv4Box 返回的 `value` 接口是通过 `items.addr` 和 `items.musk` 得到的。参数 `sys` 包含同名的系统对象 addr 和 musk 的引用，并且也有一个 `value` 函数，但与值对象接口中的 `value` 是两个不同的东西。

## 组件 Ipv4Box 所定义的抽象

前面我们定义了组件 Ipv4Box，并通过引用如下代码段实例化了该组件。

```xml
<Ipv4Box id='addr'/>
<Ipv4Box id='musk'/>
```

然后通过组件 addr 和 musk 的开放接口读取与设置 IP 值。所谓抽象，就是隐藏实现细节，只暴露使用者应该了解的接口。在 Index 中使用组件 IPv4Box 并不需要知道其内部是如何实现的，该组件只开放了接口 `value`，通过该接口可以设置或者获取 IP 值，这就是组件 Ipv4Box 所提供的抽象。从抽象的角度来看，基组件可以看作是原生抽象，而自定义组件则属于自定义抽象。