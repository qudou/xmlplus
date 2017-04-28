# 组件与空间

## 组件

组件是应用的基本构造块，它是一个普通对象。所谓普通对象指的是使用 `{}` 或 `new Object` 创建的对象。例如，`{}` 是组件，而 `RegExp` 不是组件；`{"key":"value"}` 是组件，而 `[]` 不是组件。

组件内部可以包含七种可能的数据项，而忽略其它的数据项。这七种数据项分别为：

- css：样式项，一个字符串，描述了组件的样式
- xml：视图项，一个符合 XML 格式的字符串，描述了一个子组件对象集
- ali：别名项，一个普通对象，为视图项中的部分组件对象提供集体名称
- fun：函数项，一个函数，完成组件对象的初始化和公有接口的导出
- opt：参数项，一个普通对象，给函数项提供默认的初始参数值
- cfg：配置项，一个普通对象，给视图项中的子组件对象提供初始参数配置
- map：映射项，一个普通对象，为组件本身提供额外的配置

组件可以不必包含这些项，也可以仅包含某些项。下面是一些合法的组件描述。

```js
{ }
{ css: "" }
{ xml: "<div/>", fun: new Function }
{ opt: {}, map: {}, ali: {} } 
```

而下面组件描述都是不符合要求的。

```js
[]                                   // 数组不能成为组件描述
{ css: {} }                          // 样式项必需是字符串
{ xml: [], fun: new Function }       // 视图项必需是 XML 字符串
{ opt: {}, map: {}, ali: /[a-z]/i }  // 别名项不能是正则表达式
```

组件还可以是基本的 HTML 元素。HTML 元素是基组件，前面所说的组件叫做自定义组件。基组件是不可分解的，自定义组件可以由基组件或者其它自定义组件组合而成。比如下面的组件，它由基组件 div 和自定义组件 Calendar 组合而成的。

```js
{ xml: "<div><Calendar/></div>" } 
```

文本也作为组件而存在，且属于基组件。下面的组件由两个子组件组合而成，其中 h1 是一 HTML 元素，`hello, world` 是一文本。

```js
{ xml: "<h1>hello, world</h1>" } 
```
 
一段 CDATASection 描述也被看作组件，下面的组件包含了一个 CDATASection 子组件。CDATASection 描述也属于基组件。

```js
{ xml: "<![CDATA[hello, world] ]>" } 
```

一段注释也是组件，下面的组件包含了一段注释子组件。注释也属于基组件。

```js
{ xml: "<!--这是一段注释-->" }
```

在视图项中，对组件集的描述应该是一个仅包含一个根节点并且格式良好的 XML 字符串，而不能是其他的不合法描述。下面几个对视图项的描述就是不符合要求的。

```js
{ xml: "<div/><span/>" }      // 缺少根节点
{ xml: "div</span>" }         // 开头缺少<span>
{ xml: "<span><div></span>" } // div未闭合
```

应该注意区分组件与组件对象。组件可以看作一些面向对象编程语言里面的类或者模板。而组件对象也叫组件实例，它是组件实例化的结果，一个组件可以实例化出若干个组件对象。自定义组件实例化后称之为自定义组件对象。一个 HTML 元素、一段文本、一段 CDATASection 描述以及一段注释都称作组件。当它们实例化后，则分别称之为 HTML 元素对象、文本对象、CDATASection 对象以及注释对象。后续章节对相关内容的引用将遵守这些名称约定。

## 命名空间

命名空间是组件的容器，任何一个组件必然属于某一个特定的命名空间。命名空间可以是空的，它不包含任何的组件。下面的代码定义了一个命名空间 `//xp`，该命名空间为根命名空间，它不包含任何组件。

```js
xmlplus("xp", function (xp, $_, t) {
   // 一个空的命名空间，不包含任何组件
});
```

一个命名空间的完整引用必需从根命名空间开始，并且以双斜杆开头。下面的代码定义了另一个根命名空间 `//xp`，它包含组件 Input 和组件 Calendar。这两个组件由函数 `$_().imports` 导入，其中不带参数的函数调用 `$_()`，用于表示函数 `imports` 导入的组件属于根命名空间 `//xp`。

```js
xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Input: {},
        Calendar: {}
    });
});
```

下面的代码定义了一个根命名空间 `//mx`，它包含组件 Input 和组件 Calendar。另外还定义了一个 `//mx` 的子命名空间 `//mx/ui/layout`，它包含了组件 Tab 和组件 ViewStack。这两个组件由函数 `$_("ui/layout").imports` 导入，其中带参数的函数调用 `$_("ui/layout")` 用于表示命名空间 `//mx/ui/layout`。

```js
xmlplus("mx", function (xp, $_, t) {
    $_().imports({
        Input: {},
        Calendar: {}
    });
    $_("ui/layout").imports({
        Tab: {},
        ViewStack: {}
    });
});
```

上面定义的命名空间叫做自定义命名空间。除了自定义命名空间外，系统中还存在着一个匿名的空间，该空间包含了所有的基组件。如上面所讲的 HTML 元素、文本等基组件都属于匿名空间。

在应用中，允许存在多个不同的根命名空间。如下面所示，该示例中定义了两个根命名空间，分别是 `//alice` 和 `//bob`。

```js
xmlplus("alice", function (xp, $_, t) {
    // 组件定义区
});
xmlplus("bob", function (xp, $_, t) {
    // 组件定义区
});
```

## 路径

前面说过一个命名空间的完整引用必需从根命名空间开始，并且以双斜杆开头。这种方式的组件引用方式叫做绝对路径引用。除此以外，还有另一种组件的引用方式，叫做为相对路径引用。下面对这两者分别进行论述。

### 绝对路径

如前所述，绝对路径必需以双斜杆 `//` 开头，其后跟着的是根命名空间名称。请看下面的示例。

```js
xmlplus("mx", function (xp, $_, t) {
    $_().imports({
        Calendar: {}
    });
});
xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<i:Calendar xmlns:i='//mx'/>"
        }
    });
});
```

该示例中包含两个根命名空间，分别是 `//mx` 和 `//xp`。其中，根命名空间 `//mx` 包含组件 Calendar，根命名空间 `//xp` 包含组件 Index，并且在组件 Index 的视图项中通过绝对路径 `//mx` 引用了组件 Calendar。

### 相对路径

与绝对路径不同，相对路径不再从根命名空间开始，而是以组件当前所在路径作为基地址。与相对路径相关的通配符有三个。一个是斜杆 `/`，它代表根命名空间。另一个是单句点 `.`，它代表当前组件所在的路径。还有一个是双句点 `..`，它代表当前组件所在路径的上一级路径。下面分别介绍。

下面示例中，组件 Calendar 位于命名空间 `//xp/form` 中，组件 Index 位于命名空间 `//xp` 中。现在将 `//xp` 代之以 `/`，从而在组件 Index 的视图项中可以通过路径 `/form` 来引用组件 Calendar。

```js
xmlplus("xp", function (xp, $_, t) {
    $_("form").imports({
        Calendar: {}
    });
    $_().imports({
        Index: {
            xml: "<i:Calendar xmlns:i='/form'/>"
        }
    });
});
```

下面示例中，组件 Index 和组件 Calendar 属于同级组件，它们都属于根命名空间 `//xp`。现在将 `//xp` 代之以 `.`，从而在组件 Index 的视图项中可以通过路径 `.` 来引用同级组件 Calendar。

```js
xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<i:Calendar xmlns:i='.'/>" // 或者<Calendar/>也可以
        },
        Calendar: {}
    });
});
```

正如上面注释内容所述，在不会造成冲突的情况下，当前路径标识 `.` 也可以忽略不写，直接写成 `<Calendar/>`，这样显得更为简洁。

现在对前一个示例做些修改，把组件 Index 移到命名空间 `//xp/form` 中。那么，相对组件 Index 而言，组件 Calendar 位于其上一层级。于是可以将 `//xp` 代之以 `..`，从而在组件 Index 的视图项中可以通过路径 `..` 来引用组件 Calendar。

```js
xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Calendar: {}
    });
    $_("form").imports({
        Index: {
            xml: "<i:Calendar xmlns:i='..'/>"
        }
    });
});
```

最后需要说明的是，对于同根命名空间组件的引用，应尽可能使用相对路径的方式。这有两个好处：一来可以简化引用空间来源的书写；另外，当要更改根空间名称时，只需改动一个地方即可。

## 组件的实例化

定义好组件之后，就可以通过 xmlplus 提供的 `startup` 函数实例化一个指定的组件。下面的代码实例化了一个位于命名空间 `//xp` 的组件 Calendar。

```js
var parent = document.getElementById("parent");
xmlplus.startup("//xp/Calendar", parent); 
```

函数 `startup` 的第二个参数指定了组件实例化后被追加到的 DOM 元素对象. 该参数可以是某一 DOM 元素对象或者该 DOM 元素对象的 `id` 属性值。相比而言，后者更为简洁，比如上面两行可以简写如下。

```js
xmlplus.startup("//xp/Calendar", "parent"); 
```

另外如果不提供第二个参数，那么将采用默认值作为组件实例化后被追加到的 DOM 元素对象。在浏览器端该默认值为 `window.body`，在服务端该值由系统内部创建。

下面是另一种组件的执行方式，它明确给出了组件的 XML 字符串描述，这与前一种方式等价。

```js
var xml = "<i:Calendar xmlns:i='//xp/Calendar'/>";
xmlplus.startup(xml, "parent");
```

还可以先解析出 XML 节点再执行，这与前两种方式等价。

```js
var xml = "<i:Calendar xmlns:i='//xp/Calendar'/>";
var xmlNode = xmlplus.parseXML(xml).lastChild;
xmlplus.startup(xmlNode, "parent");
```

当然，直接提供基组件也是可以的，但必需是 HTML 元素。下面的第一行会创建一个 span 元素对象，第二行则会抛出一个错误。

```js
xmlplus.startup("<span/>", "parent");
xmlplus.startup("hello, world", "parent");
```

函数 `startup` 还有可选的第三个参数，该参数可以为目标组件提供初始输入值。如下面的示例，组件 Calendar 在初始化时将采用第三个参数提供的初始日期值。关于组件参数方面的详细内容，后续会有章节专门介绍，这里可先跳过。

```js
xmlplus.startup("//xp/Calendar", "parent", {date: "2016/01/01"});
```

当代码运行于浏览器端时，一般不显示地调用函数 `startup`。请看下面的示例，该示例直接在 HTML 中以 XML 的形式书写要实例化的组件。

```html
<!DOCTYPE html>
<html>
    <head>
        <script src="xmlplus.js"></script>
        <script src="index.js"></script>
    </head>
    <body>
        <i:Index xmlns:i="//xp"></i:Index>
    </body>
</html>
```

如果要禁用这种解析方式，并以函数 `startup` 启动当然也是可以的，只要给 body 添加属性 `noparse` 即可。例如，默认情况下，下面示例中的组件 Index 不会实例化，除非你使用函数 `startup` 显示地实例化它。

```html
<!DOCTYPE html>
<html>
    <head>
        <script src="xmlplus.js"></script>
        <script src="index.js"></script>
    </head>
    <body noparse="true">
        <i:Index xmlns:i="//xp"></i:Index>
    </body>
</html>
```

## 一个完整的示例

有别于前面零碎的代码片断，现在给出一个完整的可运行的示例。该示例由三个文件组成，下面是第一个文件，它是一个纯 JavaScript 文件，它向系统导入了一个名为 Index 的组件。现将其命名为 `index.js`。

```js
// 01-01
xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            css: "#text { color: red; }",
            xml: "<h1 id='text'>hello, world</h1>",
            fun: function (sys, items, opts) {
                sys.text.css("font-size", "28px");
            }
        }
    });
});
```

下面是第二个文件，它是一个 HTML 文件，它引用了框架代码文件以及如上的第一个文件。现将其命名为 `index.html`。

```html
<!-- 01-01 -->
<!DOCTYPE html>
<html>
    <head>
        <script src="xmlplus.js"></script>
        <script src="index.js"></script>
    </head>
    <body>
        <i:Index xmlns:i="//xp"></i:Index>
    </body>
</html>
```

确保三个文件位于同一个目录下，通过浏览器打开 `index.html` 文件，你将会看到一行红色的、字体大小为 `28px`、值为 `hello, world` 的文本。这个示例中涉及到部分本章未提及的内容，可不必深究，仅需有点印象即可，后面的章节会有详细的讲述。