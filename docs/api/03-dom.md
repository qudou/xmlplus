# DOM

## text

```js
text()
```

- `Returns` : `String` 获取到的文本

该函数用于获取组件对象的文本，它相当于获取相应 HTML 元素的 `textContent` 值。

```js
text(value)
```

- `value` : `String` 要设置的文本
- `Returns` : `SystemObject` 函数的调用者

该函数用于设置组件对象的文本，这需要分两种情况看待。其一，如果组件对象的子级仅包含一个文本对象，那么它相当于设置相应 HTML 元素的 `textContent` 值。其二，如果组件对象的子级包含多个对象，那么该函数会先移除所有的儿子对象，然后以给定的文本创建一个文本对象。

```js
// 03-01
Example: {
    xml: "<h1 id='example'>hello</h1>",
    fun: function (sys, items, opts) {
        console.log(sys.example.text());  // hello
        sys.example.text("world");
        console.log(sys.example.text());  // world
    }
}
```

## prop

```js
prop(propertyName)
```

- `propertyName` : `String` 要获取的属性的名称
- `Returns` : `String` 属性的值

该函数根据给定的属性名，获取组件对象的属性值。

```js
prop(propertyName,value)
```

- `propertyName` : `String` 要设置的属性的名称
- `value` : `String` 要设置的属性值
- `Returns` : `SystemObject` 函数的调用者

该函数根据给定的属性名，设置组件对象的属性值。

```js
// 03-02
Example: {
    xml: "<input id='example' type='checkbox'/>",
    fun: function (sys, items, opts) {
        console.log(sys.example.prop("checked"));  // false
        sys.example.prop("checked", true);
        console.log(sys.example.prop("checked"));  // true
    }
}
```

## removeProp

```js
removeProp(propertyName)
```

- `propertyName` : `String` 要删除的属性的名称
- `Returns` : `SystemObject` 函数的调用者

该函数用于删除组件对象给定属性。

```js
// 03-03
Example: {
    xml: "<input id='example'/>",
    fun: function (sys, items, opts) {
        sys.example.prop("data", "hello,world");
        console.log(sys.example.prop("data"));   // hello,world
        sys.example.removeProp("data");
        console.log(sys.example.prop("data"));   // undefined
    }
}
```

## attr

```js
attr(attributeName)
```

- `attributeName` : `String` 要获取的属性的名称
- `Returns` : `String` 属性的值

该函数根据给定的属性名，获取组件对象的属性值。

```js
attr(attributeName,value)
```

- `attributeName` : `String` 要设置的属性的名称
- `value` : `String` 要设置的属性值
- `Returns` : `SystemObject` 函数的调用者

该函数根据给定的属性名，设置组件对象的属性值。

```js
// 03-04
Example: {
    xml: "<input id='example'/>",
    fun: function (sys, items, opts) {
        console.log(sys.example.attr("data"));   // null
        sys.example.attr("data", "hello");
        console.log(sys.example.attr("data"));   // hello
    }
}
```

## removeAttr

```js
removeAttr(attributeName)
```

- `attributeName` : `String` 要删除的属性的名称
- `Returns` : `SystemObject` 函数的调用者

该函数用于删除组件对象的给定属性。

```js
// 03-05
Example: {
    xml: "<input id='example'/>",
    fun: function (sys, items, opts) {
        sys.example.attr("data", "hello");
        console.log(sys.example.attr("data"));   // hello
        sys.example.removeAttr("data");
        console.log(sys.example.attr("data"));   // null
    }
}
```

## addClass

```js
addClass(className[,context])
```

- `className` : `String` 要添加到 `class` 属性的一个类或多个空格分隔的类。
- `context` : `SystemObject` 指代上下文的系统对象
- `Returns` : `SystemObject` 函数的调用者

该函数用于给组件对象添加类，该类名可以是独立的，也可以是由多个空格分隔的类集合。其中可选的参数 `context` 是一系统对象，用于指明该对象的宿主组件标识符。该标识符会替换掉参数 `className` 中出现的符号 `#`。

默认情况下，`context` 为函数 `addClass` 的调用者，请看下面示例。

```js
// 03-06
Example: {
    css: "#klass { color: blue; }",
    xml: "<div id='example'>\
            <Widget id='widget'/>\
            <h1 id='text'>hello, world</h1>\
          </div>",
    fun: function (sys, items, opts) {
        sys.text.addClass("#klass");                // 引用的是当前组件的 klass
    }
},
Widget: {
    css: "#klass { color: red; }",
    xml: "<h1 id='widget'>hello, world</h1>",
    fun: function (sys, items, opts) {
        sys.widget.addClass("#klass", this);        // 引用的是组件 Example 的 klass
    }
}
```

注意，参数 `className` 中出现的符号 `#` 所代表的内容与样式项中出现的符号 `$` 所代表的内容一致。对于类名中出现的通配符，详细内容请参考 [样式项中的通配符](/docs#命名-样式项中的通配符)。

## removeClass

```js
removeClass([className])
```

- `className` : `String` 要从 `class` 属性删除的一个类或多个空格分隔的类。
- `Returns` : `SystemObject` 函数的调用者

该函数用于移除当前对象的相关类，该类名可以是独立的，也可以是由多个空格分隔类集合。如果不指定类名，则默认移除组件对象相关的所有类。

```js
// 03-07
Example: {
    css: "#klass { color: blue; }",
    xml: "<h1 id='example'>hello,world</h1>",
    map: { nofragment: true },
    fun: function (sys, items, opts) {
        sys.example.addClass("#klass");
        console.log(sys.example.css("color")); // rgb(0, 0, 255)
        sys.example.removeClass("#klass");
        console.log(sys.example.css("color")); // rgb(0, 0, 0)
    }
}
```

注意，此示例中需要禁用文档碎片管理，否则语句 `sys.example.css("color")` 将返回空值。关于文档碎片的更多内容请参考 [使用文档碎片](/docs#优化-使用文档碎片)。

## contains

```js
contains(target)
```

- `target` : `HTMLElement | SystemObject`
- `Returns` : `Boolean`

该函数用于判定当前组件对象是否包含给定的对象。该函数的判定逻辑是，当前组件对象对应的 HTML 元素与给定对象对应的 HTML 元素存在上下级关系或者相等关系，那么该函数返回 `true`，否则返回 `false`。

```js
// 03-08
Example: {
    xml: "<div id='example'>\
            <h1 id='hello'>hello</h1>\
          </div>",
    fun: function (sys, items, opts) {
        console.log(sys.example.contains(null));             // false
        console.log(sys.example.contains(document.body));    // false
        console.log(sys.example.contains(sys.example));      // true
        console.log(sys.example.contains(sys.hello));        // true
        console.log(sys.example.contains(sys.hello.elem())); // true
    }
}
```

## css

```js
css(propertyName)
```

- `propertyName` : `String` 要获取的 CSS 属性名称
- `Returns` : `String` CSS 属性值

该函数根据给定的属性名，获取组件对象的 CSS 属性值。

```js
css(propertyName,value)
```

- `propertyName` : `String` 要设置的 CSS 属性名称
- `value` : `String` 要设置的 CSS 属性值

该函数根据给定的属性名，设置组件对象的 CSS 属性值。

```js
// 03-09
Example: {
    xml: "<h1 id='example'>hello, world</h1>",
    map: { nofragment: true },
    fun: function (sys, items, opts) {
        console.log(sys.example.css("color")); // rgb(0, 0, 0)
        sys.example.css("color", "blue");
        console.log(sys.example.css("color")); // blue
    }
}
```

注意，此示例中需要禁用文档碎片管理，否则第一个获取颜色值的语句 `sys.example.css("color")` 将返回空值。关于文档碎片的更多内容请参考 [使用文档碎片](/docs#优化-使用文档碎片)。

## show

```js
show()
```

- `Returns` : `SystemObject` 函数的调用者

该函数用于显示组件对象。在服务端，它相当于移除相关 HTML 元素的 `display` 样式。在浏览器端，它会设定 `display` 样式为初始值。

```js
// 03-10
Example: {
    css: "#hello { display: none; }",
    xml: "<div id='example'>\
             <h1 id='hello'>hello, world</h1>\
             <button id='button'>show</button>\
          </div>",
    fun: function (sys, items, opts) {
        sys.button.once("click", sys.hello.show);
    }
}
```

## hide

```js
hide()
```

- `Returns` : `SystemObject` 函数的调用者

该函数用于隐藏组件对象，它相当于设定相关 HTML 元素的 `display` 样式值为 `none`。

```js
// 03-11
Example: {
    xml: "<div id='example'>\
             <h1 id='hello'>hello, world</h1>\
             <button id='button'>hide</button>\
          </div>",
    fun: function (sys, items, opts) {
        sys.button.once("click", sys.hello.hide);
    }
}
```

## width

```js
width()
```

- `Returns` : `Number` 返回的宽度值

该函数用于获取组件对象的宽度值。

```js
width(value)
```

- `value` : `Number` 需要设定的宽度值
- `Returns` : `SystemObject` 函数的调用者

该函数用于设置组件对象的宽度值。

```js
// 03-12
Example: {
    xml: "<h1 id='example'>hello, world</h1>",
    map: { nofragment: true },
    fun: function (sys, items, opts) {
        sys.example.width(100);
        console.log(sys.example.width());
    }
}
```

注意，此示例中需要禁用文档碎片管理，否则语句 sys.example.width() 将返回 `0`。关于文档碎片的更多内容请参考 [使用文档碎片](/docs#优化-使用文档碎片)。

## height

```js
height()
```

- `Returns` : `Number` 返回的高度值

该函数用于获取组件对象的高度值。

```js
height(value)
```

- `value` : `Number` 需要设定的高度值
- `Returns` : `SystemObject` 函数的调用者

该函数用于设置组件对象的高度值。

```js
// 03-13
Example: {
    xml: "<h1 id='example'>hello, world</h1>",
    map: { nofragment: true },
    fun: function (sys, items, opts) {
        sys.example.height(100);
        console.log(sys.example.height());
    }
}
```

注意，此示例中需要禁用文档碎片管理，否则的语句 sys.example.height() 将返回 `0`。关于文档碎片的更多内容请参考 [使用文档碎片](/docs#优化-使用文档碎片)。

## offset

```js
offset()
```

- `Returns` : `PlainObject` 组件对象的偏移坐标

返回组件对象的偏移坐标。返回的对象包含两个整型属性：`top` 和 `left`，以像素计。此函数仅对可见元素有效。

```js
offset(value)
```

- `value` : `PlainObject` 要设置的偏移坐标对象
- `Returns` : `SystemObject` 函数的调用者

设置组件对象的偏移坐标。它可以是一个值对，比如 `{ top:100, left:0 }`，或者带有 `top` 和 `left` 属性的对象。

```js
// 03-14
Example: {
    css: "#example { position: relative; }"
    xml: "<div id='example'>\
            <p id='text'>hello,world</p>\
          </div>",
    map: { nofragment: true },
    fun: function (sys, items, opts) {
        var offset = sys.example.offset();
        console.log(offset.top, offset.left);  // 16 8
        sys.example.offset({top:100, left:0});
        offset = sys.example.offset();
        console.log(offset.top, offset.left);  // 100 0
    }
}
```

注意，此示例中需要禁用文档碎片管理，否则语句 sys.example.offset() 将返回 `{ top:0, left:0 }`。关于文档碎片的更多内容请参考 [使用文档碎片](/docs#优化-使用文档碎片)。

## position

```js
position()
```

- `Returns` : `PlainObject` 组件对象相对于父元素的位置（偏移）

该函数返回组件对象相对于父元素的位置（偏移）。返回的对象包含两个整型属性：top 和 left，以像素计。此函数仅对可见元素有效。

```js
// 03-15
Example: {
    xml: "<div id='example'>\
            <p id='text'>hello,world</p>\
          </div>",
    map: { nofragment: true },
    fun: function (sys, items, opts) {
        var p = sys.text.position();
        console.log(p.left, p.top);  // 8 0
    }
}
```

## scrollTop

```js
scrollTop()
```

- `Returns` : `Number` 垂直偏移值

该函数用于返回组件对象的滚动条的垂直位置。此位置指的是滚动条相对于其顶部的偏移。

```js
scrollTop(offset)
```

- `Returns` : `SystemObject` 函数的调用者

该函数用于设置组件对象的滚动条的垂直位置。offset 指的是滚动条相对于其顶部的偏移。

```js
// 03-16
Example: {
    css: "#doc { border:1px solid black; width:200px; height:200px; overflow:auto; }",
    xml: "<div id='example'>\
            <div id='doc'>\
                This is some text. This is some text. This is some text. This is some text. \
                This is some text. This is some text. This is some text. This is some text. \
                This is some text. This is some text. This is some text. This is some text. \
                This is some text. This is some text. This is some text. This is some text. \
            </div>\
            <button id='getting'>get scrollbar top offset</button>\
            <button id='setting'>set scrollbar top offset to 30px</button>\
          </div>",
    fun: function (sys, items, opts) {
        sys.getting.on("click", function() {
            console.log(sys.doc.scrollTop());
        });
        sys.setting.on("click", function () {
            sys.doc.scrollTop(30);
        });
    }
}
```

## scrollLeft

```js
scrollLeft()
```

- `Returns` : `Number` 水平偏移值

该函数用于返回组件对象的滚动条的水平位置。此位置指的是滚动条相对于其左侧边的偏移。

```js
scrollLeft(offset)
```

- `Returns` : `SystemObject` 函数的调用者

该函数用于设置组件对象的滚动条的水平位置。offset 指的是滚动条相对于其左侧边的偏移。

```js
// 03-17
Example: {
    css: "#doc { border:1px solid black; width:100px; height:130px; overflow:auto }",
    xml: "<div id='example'>\
            <div id='doc'>\
                The longest word in the english dictionary is: pneumonoultramicroscopicsilicovolcanoconiosis. \
            </div>\
            <button id='getting'>get scrollbar left offset</button>\
            <button id='setting'>set scrollbar left offset to 30px</button>\
          </div>",
    fun: function (sys, items, opts) {
        sys.getting.on("click", function () {
            console.log(sys.doc.scrollLeft());
        });
        sys.setting.on("click", function () {
            sys.doc.scrollLeft(30);
        });
    }
}
```