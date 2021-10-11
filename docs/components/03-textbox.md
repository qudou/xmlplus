# 文本框

文本框是页面中最常用的输入组件，这一章就来看看各种文本框组件的设计与使用。

<img src="https://xmlplus.cn/img/textbox.png" class="img-responsive"/>

## 原生的文本框

原生的文本框组件非常简单，它只包含一个 input 元素，下面是它的一个使用示例。

```html
// 03-01
Index: {
    xml: "<input id='index' type='text'/>",
    fun: function (sys, items, opts) {
        sys.index.on("input", e => {
            console.log(sys.index.prop("value"));
        });
    }
}
```

对于组件对象文本的设置与获取，你需要使用系统函数 `prop`，而不能使用 `attr`，这与 JQuery 的相关接口的用法是一致的。

## 使用 Bootstrap 样式

Bootstrap 框架提供了不少输入框组的样式，与上一章一样，我们也可以通过封装以简化对它们使用。下面是一个简单的例子。

```html
// 03-02
TextBox: {
    xml: `<div class="input-group">
              <span class="input-group-addon">https://example.com/users/</span>
              <input id="input" class="form-control" aria-describedby="basic-addon3">
          </div>`,
    fun: function (sys, items, opts) {
        return sys.input;
    }
}
```

该示例封装了一个允许输入 URL 剩余部分的网址输入框。注意，我们需要在函数项中导出原始文本框对象的系统接口，这样才能方便地对其进行后续操作。

## 具有格式化功能的文本框

在官方文档中的 [参数映射](http://xmlplus.cn/docs#参数映射) 的相关内已经讲过如何自定义一个可以进行格式化输入输出的文本框，现将已定义的文本框组件重新列出如下：

```js
// 03-03
TextBox: {
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

自定义文本框的基本思路是封装原生的文本框组件并对其进行扩展，上面给出的文本框增加了原文本框的格式化输入输出能力。上一节给出的使用 Bootstrap 样式封装的文本框本质上也可以归类为自定义文本框的一种，只是它利用了第三方的内容。

## 带有选择定位文本功能的文本框

这一节我们来看一个带有选择文本功能的文本框组件。该组件包含两个接口，其中 `select` 用于选中指定开头和结尾的文本，`focus` 则用于控制光标的位置。

```js
// 03-04
TextBox: {
    xml: "<input id='input' type='text'/>",
    map: { attrs: { input: "disabled value placeholder readonly" } },
    fun: function (sys, items, opts) {
        var e = sys.input.elem();
        function select(start, end){
            start == undefined && (start = 0);
            end == undefined && (end = e.value.length);
            e.focus();
            e.setSelectionRange(start,end);
        }
        function focus(ptr) {
            ptr == undefined && (ptr = e.value.length);
            return select(ptr, ptr);
        }
        return {focus: focus, select: select};
    }
}
```

你可以尝试着使用 xmlplus 的继承特性把上一节的组件功能与这一节的组件功能整合在一起。这样你就会得到一个既具备格式化功能，又具备便捷的选择文本与控制光标功能的文本框组件了。