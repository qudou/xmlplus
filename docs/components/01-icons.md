# 图标

网页上使用的图标分为三种：文件图标、字体图标和 SVG 图标。对于文件图标，下面仅以 PNG 格式来说明。

## PNG 图标

对于 PNG 图标的引用，有两种方式。一种是直接由 HTML 元素 img 的 src 属性给出。下面是一个简单的示例。

```js
Icon: {
    css: "#icon { width: 68px; height: 68px; }",
    xml: "<img id='icon'/>",
    fun: function ( sys, items, opts ) {
        this.attr("src", '/images/components/' + this + ".png");
    }
}
```

这里假定图标文件位于目录 `/images/components/` 中，于是可以按如下的方式便捷地引用所需的图标。注意组件 Icon 巧妙地使 id 属性值与图片文件名关联，这样可以避免创建额外的属性。

<i:Example xmlns:i='xp/icons/png'></i:Example>

```js
Example: {
    css: "#example > * { padding: 10px; background: #F9F9F9; }",
    xml: "<div id='example' class='bs-example'>\
            <Icon id='msg'/>\
            <Icon id='home'/>\
            <Icon id='contact'/>\
          </div>"
}
```

另一种引用 PNG 图标的方式是给相应的对象添加 `background-image` 样式，并且由样式中给出图标所在路径。下面是一个简单的示例。

```js
Icon: {
    css: "#icon { width: 68px; height: 68px; }",
    xml: "<div id='icon'/>",
    fun: function ( sys, items, opts ) {
        this.css("background-image", '/images/components/' + this + ".png");
    }
}
```

这种形式与前面由 img 标签给出的图标有许多相似之处。不同的是，前者动态指定的是 img 标签的 src值 ，而后者动态指定的则是 div 元素的 css 样式。该组件与前面给出的 Icon 组件的使用方式完全一致，这里就不重复了。

对于以上给出的组件 Icon，使用的是离散的图标文件。实际应用中，通常给出的是一个包含许多图标的 PNG 文件。这种情况下该如何构建图标组件呢？请看下面给出的一种较为实用的方案。

```js
Icon: {
    css: "#msg { background-position:  0 0; }\
          #home { background-position: -48px 0; }\
          #contact { background-position: -96px 0; }\
          #icon { width: 68px; height: 68px; background-image: url(/images/components/icons.png); }",
    xml: "<div id='icon'/>",
    fun: function ( sys, items, opts ) {
        sys.icon.addClass("#" + this);
    }
}
```

此组件在样式项 `css` 中直接给出了图标文件所在路径，以及各种图标在文件内的位置。并且图标实例 id 与相应图标类名对应。当然，组件的使用方式与前面给出的组件是一致的。

下面给出的是另一种组件设计方案，它把位置信息移到了函数项中。

```js
Icon: {
    css: "#icon { width: 48px; height: 48px; background-image: url(/images/components/icons.png); }",
    xml: "<div id='icon'/>",
    fun: function ( sys, items, opts ) {
        var positions = {
            "msg": "0 0",
            "home": "-48px 0",
            "contact": "-96px 0"
        }
        sys.icon.css("background-position", positions[this]);
    }
}
```

此方案是可行的，但组件的执行效率不如前者。该组件每次实例化都要生成位置信息一次，而对于前者，由于样式项在组件实例化时，仅生成一次，所以保证了组件的执行性能。

## 字体图标

对于字体图标，它是通过引入包含图标的字体文件，将图标像文字一样使用。它与 PNG 图标相比，最关键一点在于它的矢量性。字体图标的引用方式有两种。

下面先给出应用示例，该示例展示了由两种不同方式引用的字体图标。

<i:Example xmlns:i='xp/icons/font'></i:Example>

```js
Example: {
    css: "@font-face { font-family: 'iconfont'; url('iconfont.ttf') format('truetype');}\
          #msg, #home { font-family: 'iconfont'; font-style:normal; }\
          #example > * { display: inline-block; padding: 10px; background: #F9F9F9; }",
    xml: "<div id='example' class='bs-example'>\
            <Msg id='msg'/>\
            <Home id='home'/>\
          </div>"
}
```

注意，这里对简化了样式项中与兼容性相关的内容，详情请查阅配套源码。

### 通过类名引用

```js
Msg: {
	css: "#msg { font-size: 48px; width: 68px; height: 68px; line-height: 48px; }\
          #msg:before { content: '\\e608'; }",
    xml: "<div id='msg'/>"
}
```

这种图标由定义在样式项中，HTML 元素通过类名进行引用。

### 直接引用 unicode

```js
Home: {
	css: "#home { font-size: 48px; width: 68px; height: 68px; line-height: 48px; }",
    xml: "<div id='home'>&#xe609;<div/>"
}
```

这种方式与前一种本质上没什么不同，它只是将图标内容由样式项转移到视图项中。

## SVG 图标

最后来看看我们的重头戏，如何封装以及使用 SVG 图标。在 xmlplus 中，SVG 图标是推荐的图标使用形式，它允许直接嵌入代码，无需额外引用相关文件。

### 通过 `xlink:href` 引用

对于这种方式，首先你需要一个包含 svg 图标集，其包含的内容大概是下面这样子。

```html
<svg>
    <symbol id="icon" width='48px' height='48px' viewBox='0 0 24 24'>
        <g><polygon points='9,16.2 4.8,12 3.4,13.4 9,19 21,7 19.6,5.6'/></g>\
    </symbol>
	<!-- 还可以有更多的symbol -->
</svg>
```

svg 图标集有两种存在方式，一个是以文件形式存在，这时 `xlink:href` 属性值需要明确指明文件的 url，下面是一个示例。

```html
<svg>
   <use xlink:href='http://example.com/file.svg#icon'/>\
</svg>
```

另一种形式是，图标集直接存在于页内，这种方式叫做页内引用，它无需指明 url，只要指定相应 symbol 的 id 就好了。

```html
<svg>
   <use xlink:href='#icon'/>\
</svg>
```

对于通过 xlink:href 引用图标，只需要有所了解就行了，因为我们还有更好的引用图标的方式。

### 对 svg 图标的直接封装

相对于通过 xlink:href 引用图标，使用 xmlplus 的组件化技术直接封装会是一种更好的方式。请看下面的一个 SVG 图标组件。

```js
Icon: {
    xml: "<svg width='48px' height='48px' viewBox='0 0 24 24'>\
            <g><polygon points='9,16.2 4.8,12 3.4,13.4 9,19 21,7 19.6,5.6'/></g>\
          </svg>",
    fun: function ( sys, items, opts ) {
        this.attr("fill", '' + this);
    }
}
```

这是一个钩形图标，组件中仅包含视图项以及函数项成份。根据函数项的内容可以知道，图标颜色由组件实例的 id 属性值给出。下面来看看如何使用该图标。

<i:Example xmlns:i='xp/icons/svg'></i:Example>

```js
Example: {
    css: "#example > * { padding: 10px; background: #F9F9F9; }\
          #example > *:hover { fill: #fff; background: #563d7c; }",
    xml: "<div id='example' class='bs-example'>\
            <Icon id='red'/>\
            <Icon id='green'/>\
            <Icon id='blue'/>\
          </div>",
    fun: function ( sys, items, opts ) {
        sys.example.on("click", "*", function (e) {
            console.log(this + " clicked"); 
        });
    }
}
```

此示例展示了三个不同颜色的图标，并且侦听了图标的点击事件，打开浏览器控制台，当点击不同图标时，可以看到相应的输出。