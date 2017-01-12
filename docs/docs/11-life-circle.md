# 生命周期

默认情况下，视图项中包含的组件集，随着父级组件的实例化而实例化。除此以外，组件还可以在运行时动态地实例化。任何已经实例化的组件对象都可以被销毁或者替换。

## 组件实例的追加

系统函数`append`用于在指定的实例子级追加一组件实例。它与《组件与空间》中组件的启动函数`startup`在许多方面是类似的，可以作类比。下面是一个示例，它通过点击一个按钮来动态追加一个`Widget`组件对象。

```js
Index: {
    xml: "<div id='top'>\
              <button id='foo'>append</button>\
          </div>",
    fun: function ( sys, items, opts ) {
        sys.foo.on( "click", function (e) {
            sys.top.append("./Widget"); // 注意：这里需要明确给出组件所在的路径
        });
    }
},
Widget: {
    xml: "<button>hello, world</button>"
}
```

下面是另一种追加方式，它明确给出`xml`字符串。这与前一种方式是等价的。

```js
sys.top.append("<Widget xmlns='.'/>");
```

还可以先解析出`xml`节点，然后追加解析后的节点，这与前两种方式等价。

```js
var xml = "<Widget xmlns='.'/>";
var xmlNode = xmlplus.parseXML(xml).lastChild;
sys.top.append(xmlNode);
```

以上给`append`函数提供的都是自定义组件的描述。当然，提供基组件的描述也是可以的。下面的第一行会创建一个`span`元素对象，第二行会创建一个值为`hello,world`的文本对象。

```js
sys.top.append("<span/>");
sys.top.append("hello,world!");
```

上面的第一条语句创建的是一个span元素对象而不是创建一个文本对象。这是由于系统函数`append`在遇到输入为字符串的参数时，会首先调用`parseXML`函数，将其当成`xml`字符串来解析。如果解析失败了，才把它当成文本来解析。所以，如果想要得到"<span/>"文本对象，只能给`append`函数提供一个相应的`xml`文本节点，这样创建的就是所需的文本对象了。

```js
var textNode = document.createTextNode("<span/>");
sys.top.append(textNode);
```
`append`函数第二个参数是可选的，它为追加的对象提供初始输入值。如下面的示例所示，由于`append`函数的第二个参数提供了按钮的文本值，所以最终追加的按钮对象的文本不再是"hello,world"，而是"I'm Button!"。

```js
Index: {
    xml: "<div id='top'>\
              <button id='foo'>append</button>\
          </div>",
    fun: function ( sys, items, opts ) {
        sys.foo.on("click", function (event) {
            sys.top.append("./Widget", { label: "I'm Button!" });
        });
    }
},
Widget: {
    xml: "<button id='btn'>hello, world</button>",
    fun: function ( sys, items, opts ) {
        opts.label && sys.btn.text(opts.label);
    }
}
```

## 组件实例的插入

通过系统函数`before`，可以在一个组件实例之前插入一个新的组件实例，请看下面的示例。

```js
Index: {
    xml: "<div id='top'>\
              <button id='foo'>before</button>\
          </div>",
    fun: function ( sys, items, opts ) {
        sys.foo.on("click", function (event) {
            sys.foo.before("./Widget");
        });
    }
},
Widget: {
    xml: "<button>hello, world</button>"
}
```

该示例通过点击按钮来在按钮对象之前动态插入一个`Widget`组件。不过，不要试图在`top`对象之前插入组件对象，否则系统将抛出错误。因为`top`对象属于`xml`的顶层元素，系统函数`before`是无法在一个顶级元素对象之前插入组件对象的。

系统函数`before`最多只能包含两个参数，它的意义与`append`函数的前两个参数一致，只是插入的位置有别。

## 移除已经实例化的组件

对于已经实例化的组件，可以调用系统函数`remove`来将其移除。执行`remove`函数不用输入任何参数。

```js
Index: {
    xml: "<div>\
             <button id='foo'>destory</button>\
             <h1 id='bar'>Hello, world</h1>\
          </div>",
    fun: function ( sys, items, opts ) {
        sys.foo.once("click", sys.bar.remove);
    }
}
```

该示例的视图项包含了一个`button`元素对象`foo`和一个`h1`元素对象`bar`。对象`foo`注册了`click`事件的侦听器。当点击按钮时，`bar`对象的系统函数`remove`得到执行。此`remove`函数用于移除`bar`对象本身。

## 替换已实例化的组件

替换一个已经实例化的组件，使用系统函数`replace`，该函数包含两个参数，第一个是欲替换的目标组件，第二个是目标组件的初始化输入值。它们与系统函数`append`的前两个参数意义一致。

```js
Index: {
    xml: "<div id='top'>\
             <button id='foo'>replace</button>\
          </div>",
    fun: function ( sys, items, opts ) {
        sys.foo.once("click", function (e) {
            sys.foo.replace("<h1>Hello, world</h1>");
        });
    }
}
```

当点击`replace`按钮时，按钮本身会被替换成相应的`h1`元素对象。

## 使用动态实例化的组件

通过系统函数的返回值，可以获取已动态实例化的组件对象的引用，从而可以访问其相关接口。下面是一个简单的例子，它通过引用系统函数`append`的返回值设置了`h1`元素对象的下划线。

```js
Index: {
    xml: "<div id='top'>\
             <button id='foo'>append</button>\
          </div>",
    fun: function ( sys, items, opts ) {
        sys.foo.on( "click", function (event) {
            var xml = "<h1>Hello, world</h1>";
            var result = sys.top.append(xml);
            result.css("text-decoration", "underline");
        });
    }
}
```

当然，如果相关的对象是命名过的，也可以通过名称直接访问。下面的示例中，通过目标对象的名称`text`直接访问该对象，达到的效果与上面的一致。

```js
Index: {
    xml: "<div id='top'>\
             <button id='foo'>append</button>\
          </div>",
    fun: function ( sys, items, opts ) {
        sys.foo.on("click", function (e) {
            var xml = "<h1 id='text'>Hello, world</h1>";
            sys.top.append(xml);
            sys.text.css("text-decoration", "underline");
        });
    }
}
```