# 图标

网页上使用的图标分可为三种：文件图标、字体图标和 SVG 图标。对于文件图标，下面仅以 PNG 格式来说明。

## PNG 图标

对于 PNG 图标的引用，有两种方式。一种是直接由 HTML 元素 img 的 src 属性给出。下面是一个简单的示例。

```js
// 01-01
Icon: {
    css: `#icon { width: 68px; height: 68px; }`,
    xml: `<img id='icon'/>`,
    fun: function (sys, items, opts) {
        this.attr("src", "img/" + this + ".png");
    }
}
```

这个示例的图标文件位于组件所在文件的子级目录 `img/` 中。我们可以按如下的方式便捷地引用所需的图标。注意组件 Icon 巧妙地使 id 属性值与图片文件名关联，这样可以避免创建额外的属性。

```js
// 01-01
Index: {
    xml: `<div id='index'>
            <Icon id='msg'/>
            <Icon id='home'/>
            <Icon id='contact'/>
          </div>`
}
```

另一种引用 PNG 图标的方式是给相应的对象添加 `background-image` 样式，并且由样式中给出图标所在路径。下面是一个简单的示例。

```js
// 01-02
Icon: {
    css: `#icon { width: 68px; height: 68px; }`,
    xml: `<div id='icon'/>`,
    fun: function (sys, items, opts) {
        this.css("background-image", "url(img/" + this + ".png)");
    }
}
```

这种形式与前面由 img 标签给出的图标有许多相似之处。不同的是，前者动态指定的是 img 标签的 src 值 ，而后者动态指定的则是 div 元素的 css 样式。该组件与前面给出的 Icon 组件的使用方式完全一致，这里就不重复了。

对于以上给出的组件 Icon，使用的是离散的图标文件。实际应用中，通常给出的是一个包含许多图标的 PNG 文件。这种情况下该如何构建图标组件呢？请看下面给出的一种较为实用的方案。

```js
// 01-03
Icon: {
    css: `#msg { background-position:  0 0; }
          #home { background-position: 0 -48px; }
          #contact { background-position: 0 -96px; }
          #icon { width: 68px; height: 68px; background-image: url(img/icons.png); }`,
    xml: `<div id='icon'/>`,
    fun: function (sys, items, opts) {
        sys.icon.addClass("#" + this);
    }
}
```

此组件在样式项 `css` 中直接给出了图标文件所在路径，以及各种图标在文件内的位置。并且图标实例 id 与相应图标类名对应。当然，组件的使用方式与前面给出的组件是一致的。

下面给出的是另一种组件设计方案，它把位置信息移到了函数项中。此方案是可行的，但组件的执行效率不如前者。该组件每次实例化都要生成位置信息一次，而对于前者，由于样式项在组件实例化时，仅生成一次，所以保证了组件的执行性能。

```js
// 01-04
Icon: {
    css: `#icon { width: 48px; height: 48px; background-image: url(img/icons.png); }`,
    xml: `<div id='icon'/>`,
    fun: function (sys, items, opts) {
        var positions = {
            "msg": "0 0",
            "home": "0 -48px",
            "contact": "0 -96px"
        };
        sys.icon.css("background-position", positions[this]);
    }
}
```

注意，以上给出的一些图标组件的设计技巧同样也适用于图片组件的设计。

## 字体图标

字体图标通过引入包含图标的字体文件，将图标像文字一样使用。它与 PNG 图标相比，最关键一点在于它的矢量性。字体图标的引用方式有两种：通过类名的引用方式以及直接引用  unicode 的方式。

### 通过类名引用

这种类型的图标内容定义在样式项中，HTML 元素通过类名进行关联。

```js
// 01-05
Msg: {
    css: `#msg { font-size: 48px; width: 48px; height: 48px; line-height: 48px; }
          #msg:before { content: '\\e608'; }`,
    xml: "<div id='msg'/>"
}
```

### 直接引用 unicode

这种引用方式与前一种在本质上没什么不同，它只是将图标内容由样式项转移到视图项中而已。

```js
// 01-05
Home: {
    css: `#home { font-size: 48px; width: 48px; height: 48px; line-height: 48px; }`,
    xml: `<div id='home'>&#xe609;<div/>`
}
```

下面给出的示例展示了两种不同的引用字体图标的方式。注意，此示例简化了样式项中与兼容性相关的内容，详情请查阅配套源码。

```js
// 01-05
Index: {
    css: `@font-face { font-family: 'iconfont'; url('font/iconfont.ttf') format('truetype');}
          #msg, #home { font-family: 'iconfont'; font-style:normal; }
          #index > * { display: inline-block; padding: 10px; background: #F9F9F9; }`,
    xml: `<div id='index'>
            <Msg id='msg'/>
            <Home id='home'/>
          </div>`
}
```

## SVG 图标

最后来看看我们的重头戏，如何封装以及使用 SVG 图标。在 xmlplus 中，SVG 图标是推荐的图标使用形式，它允许直接嵌入代码，无需额外引用相关文件。

### 通过 `xlink:href` 引用

对于这种方式，首先你需要一个 svg 图标集，其包含的内容大概是下面这样子。

```html
<!-- 01-06 -->
<svg>
    <symbol id="icon" width='48px' height='48px' viewBox='0 0 24 24'>
        <g><polygon points='9,16.2 4.8,12 3.4,13.4 9,19 21,7 19.6,5.6'/></g>\
    </symbol>
	<!-- 还可以有更多的symbol -->
</svg>
```

svg 图标集有两种存在方式，一个是以文件形式存在，这时 `xlink:href` 属性值需要明确指明文件的 url，下面是一个示例。

```html
<!-- 01-06 -->
<svg>
   <use xlink:href='http://example.com/file.svg#home'/>\
</svg>
```

另一种形式是，图标集直接存在于页内，这种方式叫做页内引用，它无需指明 url，只要指定相应 symbol 的 ID 值就好了。

```html
<!-- 01-07 -->
<svg>
   <use xlink:href='#home'/>\
</svg>
```

### 对 svg 图标的直接封装

相对于通过 `xlink:href` 引用图标，使用 xmlplus 的组件化技术直接封装会是一种更好的方式。请看下面的一个 SVG 图标组件。

```js
// 01-08
Icon: {
    xml: "<svg width='48px' height='48px' viewBox='0 0 24 24'>\
            <g><polygon points='9,16.2 4.8,12 3.4,13.4 9,19 21,7 19.6,5.6'/></g>\
          </svg>",
    fun: function (sys, items, opts) {
        this.attr("fill", '' + this);
    }
}
```

这是一个钩形图标，组件中仅包含视图项以及函数项成份。根据函数项的内容可以知道，图标颜色由组件实例的 id 属性值给出。下面来看看如何使用该图标。


```js
// 01-08
Index: {
    css: `#example > * { padding: 10px; background: #F9F9F9; }
          #example > *:hover { fill: #fff; background: #563d7c; }`,
    xml: `<div id='index'>
            <Icon id='red'/>
            <Icon id='green'/>
            <Icon id='blue'/>
          </div>`,
    fun: function (sys, items, opts) {
        sys.example.on("click", "*", e => console.log(this + " clicked"));
    }
}
```

此示例展示了三个不同颜色的图标，并且侦听了图标的点击事件，打开浏览器控制台，当点击不同图标时，可以看到相应的输出。

另外，有一种常见的 SVG 图标的封装方式，它把 SVG 文本经过 URL 编码后直接在 img 的 `src` 属性或者样式 `background-image` 中给出。就像下面这样子。

```js
// 01-09
Icon: {
    css: `#icon {width: 16px; height: 16px; background-image: url('data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D...')}`,
    xml: "<div id='icon'/>"
}
```

这种方式与上一种方式比起来，有两个缺点：其一，你看不出 SVG 的源文件。其二，你失去了对 SVG 图标的操作权。当然，这种方式也并非不能用。如果你不需要对图标进行后续的操作，使用这种方式也是可以接受的。另外，与之相似的一种图标使用方式是对图标 base64 编码后的内嵌引用。下面是一个简单的示范：


```js
// 01-10
Icon: {
    xml: `<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIcAAA...' />`
}
```

这种方式与上一种 SVG 图标的封装方式是类似的。不过相对于 SVG 图标组件的直接封装，你同样失去了对图标的操作权。