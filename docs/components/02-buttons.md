# 按钮

除了图标以外，按钮也许是最简单的组件了，现在来看看如何定义按钮组件。

## 使用 Bootstrap 样式

如果你的项目在视觉上没有特别要求的话。使用 Bootstrap 样式来定义按钮组件是一个好主意。按传统方式使用 Bootstrap 按扭，你需要像下面这样使用。

<div id='example' class='bs-example'>
    <button type="button" class="btn btn-default">Default</button>
    <button type="button" class="btn btn-primary">Primary</button>
    <button type="button" class="btn btn-success">Success</button>
</div>

```html
<button type="button" class="btn btn-default">Default</button>
<button type="button" class="btn btn-primary">Primary</button>
<button type="button" class="btn btn-success">Success</button>
```

请认真观察，你是不是觉得它给你的比你要求的要多。你不但发现了好多的 `type=button`，还发现了好多的 `btn`。现在下面给出一个组件，它基于 Bootstrap 样式，但它明显地简化了按钮的使用方式。

```js
Button: {
    xml: "<button type='button' class='btn'/>",
    fun: function ( sys, items, opts ) {
        this.addClass("btn-" + opts.type);
    }
}
```

此按钮组件封装了原始按钮需要重复书写的内容，在使用时，仅需提供 `type` 属性即可指明目标按钮，让使用起来更为便捷。下面给出的是新按钮组件的使用方式。

```xml
<Button type='default'>Default</Button>
<Button type='primary'>Primary</Button>
<Button type='success'>Success</Button>
```

## 自定义你的按钮组件

使用类似 Bootstrap 等开源框架，你可以避免重造轮子。然而，当这些开源项目无法满足你的需求时，你就需要自己动手了。

为简单起见，现在假定上述 Bootstrap 框架并不存在，那么如何设计一套上述的按钮？这样的实践是非常有意义的，它有助于你举一反三。

现在让我们重新对上面的按钮组件作观察。你会发现，Bootstrap 设计了一些可以组合的样式类，其中 `btn` 是每一个按钮都需要的，另外像 `btn-default`、`btn-primary` 等等都根据需要与 btn 形成组合样式类。好了，根据这个思路，我们就可以设计出如下的组件框架。

```js
Button: {
    css: "#btn { 这里是按钮基本的样式 }\
          #default { 这里是default样式 }\
          #primary { 这里是primary样式 }",
    xml: "<button type='button'/>",
    fun: function ( sys, items, opts ) {
        this.addClass("#btn #" + opts.type, this);
    }
}
```

上述的设计思路与前面直接使用 Bootstrap 样式定义按钮不同点在于，前者已经为你定义好了各个全局的样式类，你只需要直接引用就可以了。而此处你需要在按扭组件内部自行定义相关样式类。从封装的角度看，后者的内聚性要强于前者，因为它并不暴露全局类名。下面是该组件的使用示例。

<i:Example xmlns:i='xp/buttons/self'></i:Example>

```js
Example: {
	xml: "<div id='example' class='bs-example'>\
			<Button type='default'>Default</Button>\
			<Button type='primary'>Primary</Button>\
			<Button type='success'>Success</Button>\
		  </div>"
}
```

注意，这里的自定义按钮组件略去了 `hover`、`active` 样式，所以与 Bootstrap 按钮有些不一样。