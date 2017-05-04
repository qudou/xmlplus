# 生命周期

组件对象的生命周期包含两方面的内容，一个是组件对象的创建，另一个是组件对象的移除。视图项中包含的组件集，随着父级组件的实例化而实例化，这属于组件对象的创建。除此以外，组件还可以在运行时动态地实例化，这也属于组件的创建。

任何已经实例化的组件对象都可以被移除或者替换。由于组件的替换可以分为新组件对象的创建与旧组件对象的移除，所以本质上组件对象的生命周期仅包含组件对象的创建与移除这两方面的内容。下面给出的是相关的系统对象接口，后面会逐一讲述。

- [append](/api#生命周期_append)：给当前组件对象子级追加一个组件对象
- [before](/api#生命周期_before)：在当前组件对象之前插入一个组件对象
- [replace](/api#生命周期_replace)：用新的组件对象替换掉当前组件对象
- [remove](/api#生命周期_remove)：移除掉当前组件对象

## 组件对象的追加
 
系统函数 `append` 用于在指定的组件对象子级追加一个组件对象, 它与[《组件与空间》](/docs#组件与空间)中的启动函数 `startup` 在许多方面是类似的。下面是动态追加组件的一个示例，它通过点击按钮来动态追加一个组件对象 Widget。

```js
// 10-01
Index: {
    xml: "<div id='index'>\
              <button id='foo'>append</button>\
          </div>",
    fun: function (sys, items, opts) {
        sys.foo.on("click", function (e) {
            sys.index.append("Widget");
        });
    }
},
Widget: {
    xml: "<button>hello, world</button>"
}
```

下面是组件对象另一种追加方式，它明确给出 xml 字符串。这与前一种方式是等价的。

```js
sys.index.append("<Widget xmlns='.'/>");
```

还可以先解析出 xml 节点，然后追加解析后的节点，这与前两种方式等价。

```js
var xml = "<Widget xmlns='.'/>";
var xmlNode = xmlplus.parseXML(xml).lastChild;
sys.index.append(xmlNode);
```

以上给系统函数 `append` 提供的都是自定义组件的描述。当然，提供基组件的描述也是可以的。下面的第一行会创建一个 span 元素对象，第二行会创建一个值为 `hello,world` 的文本对象。

```js
sys.index.append("<span/>");
sys.index.append("hello,world");
```

上面的第一条语句创建的是一个 span 元素对象而不是一个文本对象。这是由于函数 `append` 在遇到输入为字符串的参数时，会首先调用函数 `parseXML`，将其当成 xml 字符串来解析。如果解析失败了，才把它当成文本来解析。所以，如果想要得到值为 `<span/>` 的文本对象，只能给函数 `append` 提供一个 xml 文本节点。

```js
var textNode = document.createTextNode("<span/>");
sys.index.append(textNode);
```
系统函数 `append` 第二个参数是可选的，它为追加的组件对象提供初始输入值。如下面的示例所示，由于系统函数 `append` 的第二个参数提供了按钮的文本值，所以最终追加的按钮对象的文本不再是 `hello,world`，而是 `I'm Button!`。

```js
// 10-02
Index: {
    xml: "<div id='index'>\
              <button id='foo'>append</button>\
          </div>",
    fun: function (sys, items, opts) {
        sys.foo.on("click", function (event) {
            sys.index.append("Widget", { label: "I'm Button!" });
        });
    }
},
Widget: {
    xml: "<button id='widget'>hello, world</button>",
    fun: function (sys, items, opts) {
        sys.widget.text(opts.label);
    }
}
```

## 组件对象的插入

通过系统函数 `before` ，可以在一个组件对象之前插入一个新的组件对象，请看下面的示例。

```js
// 10-03
Index: {
    xml: "<div id='index'>\
              <button id='foo'>before</button>\
          </div>",
    fun: function (sys, items, opts) {
        sys.foo.on("click", function (e) {
            sys.foo.before("Widget");
        });
    }
},
Widget: {
    xml: "<button>hello, world</button>"
}
```

该示例通过点击按钮来在按钮对象之前动态插入一个 Widget 组件。不过，不要试图在组件对象 index 之前插入组件对象，否则系统将抛出错误。因为组件对象 index 属于 xml 的顶层元素，系统函数 `before` 是无法在一个顶级元素对象之前插入组件对象的。

系统函数 `before` 最多只能包含两个参数，它的意义与系统函数 `append` 的前两个参数一致，只是插入的位置有别。

## 组件对象的替换

系统函数 `replace` 用于替换一个已经实例化的组件。该函数包含两个参数，第一个是欲替换的目标组件，第二个是目标组件的初始化输入值。它们与系统函数 `append` 的两个参数意义一致。

```js
// 10-04
Index: {
    xml: "<div id='index'>\
             <button id='foo'>replace</button>\
          </div>",
    fun: function (sys, items, opts) {
        sys.foo.once("click", function (e) {
            sys.foo.replace("<h1>Hello, world</h1>");
        });
    }
}
```

该实例侦听按钮的 `click` 事件。当点击按钮时，按钮本身会被替换成相应的 h1 元素对象。


## 组件对象的移除

对于已经实例化的组件，可以调用系统函数 `remove` 来将其移除。对于此函数的调用，你不用提供任何参数。

```js
// 10-05
Index: {
    xml: "<div id='index'>\
             <button id='foo'>destory</button>\
             <h1 id='bar'>Hello, world</h1>\
          </div>",
    fun: function (sys, items, opts) {
        sys.foo.once("click", sys.bar.remove);
    }
}
```

该示例的视图项包含了一个 button 元素对象 foo 和一个 h1 元素对象 bar。组件对象 foo 注册了 `click` 事件的侦听器。当点击按钮时，组件对象 bar 的系统函数 `remove` 得到执行。此系统函数 `remove` 用于移除组件对象 bar 本身。注意，这里按钮的点击事件仅被侦听一次，如果多次侦听将会抛出错误。因为当一个组件对象被移除后，该对象上的所有接口就失效了。

组件对象被移除后，原来绑定在该对象上的所有的事件侦听器和消息侦听器一并被清除。虽然一个组件对象被移除了，但系统还是尽可能地保留了组件对象的部分部件，这样下回创建新的同类型组件对象时就可以复用这些缓存的部分，使得创建新对象的开销降到最低。

## 使用已动态实例化的组件

通过系统函数 `append` 或者 `replace` 的返回值，可以获取已动态实例化的组件对象的引用，从而可以访问其相关接口。下面是一个简单的例子，它通过引用系统函数 `append` 的返回值设置了 h1 元素对象的下划线。

```js
// 10-06
Index: {
    xml: "<div id='index'>\
             <button id='foo'>append</button>\
          </div>",
    fun: function (sys, items, opts) {
        sys.foo.on( "click", function (e) {
            var xml = "<h1>Hello, world</h1>";
            var result = sys.index.append(xml);
            result.css("text-decoration", "underline");
        });
    }
}
```

当然，如果相关的对象是命名过的，也可以通过名称直接访问。下面的示例中，我们通过目标对象的名称直接访问该对象，达到的效果与上面的一致。

```js
// 10-07
Index: {
    xml: "<div id='index'>\
             <button id='foo'>append</button>\
          </div>",
    fun: function (sys, items, opts) {
        sys.foo.on("click", function (e) {
            var xml = "<h1 id='text'>Hello, world</h1>";
            sys.index.append(xml);
            sys.text.css("text-decoration", "underline");
        });
    }
}
```