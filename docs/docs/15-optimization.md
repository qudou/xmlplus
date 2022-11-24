# 优化

一个好的应用，既应该对维护者友好，还应该对使用者友好。这一章主要谈谈如何通过一些措施优化应用的性能，这属于对使用者友好的范畴。

## 减少组件对象的命名

对于未命名的组件对象，默认不会对其生成系统对象和值对象。对于某些对象，如果仅在样式项中使用，那么可以通过一些小技巧以避免对相关的组件对象命名。请看下面的示例。

```js
// 15-01
Index: {
    css: "#index button { color: blue; }",
    xml: "<div id='index'>\
            <button>hell</button>\
            <button>world</button>\
          </div>"
}
```

在这个示例中，包含两个 `button` 元素对象，且仅在样式项中设定它们的颜色样式。这种情况下，就没有必要给这两个 `button` 元素对象命名了。

## 使用文档碎片

在浏览器端，系统默认开启文档碎片功能，也就是全局函数 `startup` 执行时，会使用如下的代码先创一个文档碎片对象。

```js
document.createDocumentFragment()
```

之后所有的新建 HTML 元素都会被添加到该对象上。等这些工作都完成后，文档碎片对象才被追加到目标 HTML 元素上。

使用文档碎片特性可以明显地提升应用的性能，因为只需一次屏幕的刷新，就可以完成页面的显示。然而，当动态添加组件对象时，系统默认不使用文档碎片，但我们可以手动使用该功能，请看下面的示例。

```js
// 15-02
Index: {
    xml: "<div id='index'>\
            <button id='btn'>append</button>\
          </div>",
    fun: function (sys, items, opts) {
        sys.btn.once("click", function () {
            var fragment = document.createDocumentFragment();
            for (var i = 0; i < 100; i++)
                sys.index.append("<h2>foo</h2>", null, fragment);
            sys.index.elem().appendChild(fragment);
        });
    }
}
```

该示例中，我们在 index 组件下追加了 100 个 h2 节点，在调用 `append` 函数时给第三个参数提供了文档碎片实例 `fragment`。这样当函数执行时并不将目标对象直接添加到 DOM 节点上，而是添加到 `fragment` 上。待所有节点添加完成后，所有的目标节点才被一次性添加到 DOM 节点上。

除了 `append` 系统函数外，系统函数 `before`，也可以进行类似操作，只是稍微麻烦一点，请参考下面示例：

```js
// 15-03
Index: {
    xml: "<div id='index'>\
            <button id='btn'>before</button>\
          </div>",
    fun: function (sys, items, opts) {
        sys.btn.once("click", function () {
            var fragment = document.createDocumentFragment();
            fragment.appendChild(document.createElement("div"));
            var lastChild = fragment.lastChild;
            for (var i = 0; i < 100; i++)
                sys.btn.before("<h2>foo</h2>", null, lastChild);
            fragment.removeChild(lastChild);
            sys.index.elem().insertBefore(fragment, sys.btn.elem());
        });
    }
}
```

## 应用延迟实例化特性

如果你的应用足够复杂，不妨考虑将部分组件对象延迟实例化。这在大型应用中，它能明显地提升应用的用户体验。

```js
// 15-04
Index: {
    xml: "<div id='index'>\
             <span id='foo'>foo</span>\
             <button id='bar'>bar</button>\
          </div>",
    map: { defer: "foo" },
    fun: function (sys, items, opts) {
        sys.bar.once("click", sys.foo.show);
    }
}
```

上面的示例来自 [延迟实例化](/docs#延迟实例化)，该示例中，组件对象 `foo` 被设计成延迟实例化的。当然这个示例较为简单，你可以尝试把组件对象 `foo` 替换成复杂的，需要初始化较长时长的组件对象以观察延迟实例化特性的功效。

更近一步，你可以利用 `require.js` 等工具动态获取组件包并导入系统，然后实例化相关的组件对象。此方案适用于体积较大的应用，它能按需分块加载组件集，使得应用的初始化快速进行。

## 复用已创建的组件对象

下面通过一个简单的示例来说明如何通过复用已创建的组件对象来提升应用的性能。下面给出的是两个组件，其中组件 Item 是 HTML 元素 `li` 的简单封装。列表组件 `List` 接收一个数组作为数据源并创建列表子项。

```js
// 15-05
List: {
    xml: "<ul id='list'/>",
    fun: function (sys, items, opts) {
        function setValue(array) {
            var list = sys.list.kids();
            for ( var i = 0; i < array.length; i++ )
                (list[i] || sys.list.append("Item")).show().text(array[i]);
            for ( var k = i; k < list.length; k++ )
                list[k].hide();
        }
        return Object.defineProperty({}, "value", { set: setValue });
    }
},
Item: {
    xml: "<li id='item'/>"
}
```

注意，函数 `setValue` 中的两个 `for` 语句。其中第一个 `for` 语句会尝试复用已创建的组件对象，只有当未存在已创建对象时才新建一个。第二个 `for` 语句则隐藏剩余未利用的组件对象，而不是将其移除。下面是一个应用示例。

```js
// 15-06
Index: {
    xml: "<List id='list'/>",
    fun: function (sys, items, opts) {
        items.list.value = ["hello","world"];
        items.list.value = ["1","2","3","4"];
    }
}
```

上述应用示例的函数项中，第二个语句将利用第一个语句创建的两个 `Item` 组件对象，所以该语句只创建两个新的组件对象，而不是四个。