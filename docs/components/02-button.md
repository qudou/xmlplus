# 按钮

除了图标组件以外，按钮也许是最简单的组件了，这章就来看看如何定义按钮组件。

<img src="https://xmlplus.cn/img/button.png" class="img-responsive"/>

## 使用原生按钮组件

在 xmlplus 中，HTML 元素也以组件的方式存在。所以，你可以直接通过使用 button 标签或者 input 标签来使用按钮组件。如下面的示例所示：

```js
// 02-01
Index: {
    xml: `<div id='index'>
              <button>Default</button>
              <input type='submit'>Primary</input>
         </div>`
}
```

虽然原生按钮外观不那么吸引人，但原生按钮未经特殊包装，所以渲染起来最快，执行效率最高。

## 使用 Bootstrap 样式的按钮

如果你的项目在视觉上没有特别要求的话，使用 Bootstrap 样式来定义按钮组件是一个好主意。按传统方式使用 Bootstrap 按扭，你需要像下面这样使用：

```html
<button type="button" class="btn btn-default">Default</button>
<button type="button" class="btn btn-primary">Primary</button>
<button type="button" class="btn btn-success">Success</button>
```

请认真观察，你是不是觉得它给你的比你要求的要多。你不但发现了好多的 `type=button`，还发现了好多的 `btn`。现在下面给出一个组件，它基于 Bootstrap 样式，但它明显地简化了按钮的使用方式。

```js
// 02-02
Button: {
    xml: "<button type='button' class='btn'/>",
    fun: function (sys, items, opts) {
        this.addClass("btn-" + opts.type);
    }
}
```

此按钮组件封装了原始按钮需要重复书写的内容，在使用时，仅需提供 `type` 属性即可指明要生成的目标按钮，使用起来更为便捷。下面给出的是新定义的按钮组件的使用方式。

```xml
<!-- 02-02 -->
<Button type='default'>Default</Button>
<Button type='primary'>Primary</Button>
<Button type='success'>Success</Button>
```

## 带有图标的按钮

按钮上除了文字外，还可以附带图标。合适的图标可以使按扭的使用意图更加生动直观。这里以 EasyUI 的图标按钮为例来说明如何封装并使用图标按钮。我们首先来看看，EasyUI 图标按钮的原始使用方式。

```html
<div style="padding:5px 0;">
    <a href="#" class="easyui-linkbutton" data-options="iconCls:'icon-add'">Add</a>
    <a href="#" class="easyui-linkbutton" data-options="iconCls:'icon-remove'">Remove</a>
    <a href="#" class="easyui-linkbutton" data-options="iconCls:'icon-save'">Save</a>
</div>
```

与上一节对 Bootstrap 按钮的封装类似，通过观察提炼出重复出现的部分，将变化的部分以接口形式展现。上面的按钮仅图标类型名和文本是可变的，所以我们可以做出如下的设计：

```js
// 02-03
Button: {
    xml: "<a href="#" class="easyui-linkbutton"/>",
    fun: function (sys, items, opts) {
        this.attr("data-options", "iconCls:'icon-" + opts.type + "'");
        $(this.elem()).linkbutton();
    }
}
```

请注意该组件的函数项，由于这里的所以 HTML 元素都是动态生成的，所以需要使用函数 `linkbutton` 动态对按钮进行渲染，而不能指望 easyui 帮你自动帮你完成。下面是新图标的使用方式，它明显比原始的使用方式简洁多了。

```html
<!-- 02-03 -->
<div style="padding:5px 0;">
    <Button type='add'>Add</Button>
    <Button type='remove'>Reomve</Button>
    <Button type='save'>Save</Button>
    <Button type='cut'>Cut</Button>
</div>
```

## 自定义按钮组件

使用类似 Bootstrap, EasyUI 等现成的开源框架，可以非常方便使用按钮。然而，当这些开源项目无法满足你的需求时，你就需要自己动手了。为简单起见，现在假定上述框架并不存在，那么如何设计一套具有 Bootstrap 样式的按钮呢？这样的实践是非常有意义的，它有助于你举一反三。

现在让我们重新对上面的按钮组件作观察。你会发现，Bootstrap 设计了一些可以组合的样式类，其中 `btn` 是每一个按钮都需要的，另外像 `btn-default`、`btn-primary` 以及`btn-success` 等等都根据需要与 btn 形成组合样式类。好了，根据这个思路，我们就可以设计出如下的组件框架。

```js
// 02-04
Button: {
    css: `#button { 这里是按钮基本的样式 }
          #default { 这里是 default 样式 }
          #primary { 这里是 primary 样式 }
          #success { 这里是 success 样式 }`,
    xml: "<button type='button'/>",
    fun: function (sys, items, opts) {
        this.addClass("#" + opts.type, this);
    }
}
```

上述的设计思路与前面直接使用 Bootstrap 样式定义按钮不同点在于，前者已经为你定义好了各个全局的样式类，你只需要直接引用就可以了。而此处你需要在按扭组件内部自行定义相关样式类。从封装的角度看，后者的内聚性要强于前者，因为它并不暴露全局类名。注意，为了简化起见，这里的自定义按钮组件略去了 `hover`、`active` 样式，所以与 Bootstrap 按钮有些不一样。下面是该按钮组件的使用示例。当然，它与前面封装的 Bootstrap 按钮的使用示例没什么不同。

```xml
<!-- 02-04 -->
<Button type='default'>Default</Button>
<Button type='primary'>Primary</Button>
<Button type='success'>Success</Button>
```

另外，切记一点，尽量避免定义功能大而杂的按钮组件。当然，定义其它类型的组件也是一样的。轻量、按需、足够使用就好。
