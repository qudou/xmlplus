# 组件与空间

---

## 组件

组件是应用的基本构造块，它是一个朴素的JSON对象。比如，`{}`是组件，而`RegExp`不是组件；`{key:"value"}`是组件，而`[]`不是组件。

组件内部可以包含七种可能的数据项，而忽略其他的数据项。这七种数据项分别为：

- css：样式项，它是一个字符串，描述了组件的样式
- xml：视图项，它是一个符合XML格式的字符串，描述了一个子组件对象集
- ali：别名项，它是一个朴素的对象，为视图项中的部分子组件对象提供集体名称
- fun：函数项，它是一个函数，完成组件对象的初始化和公有接口的导出
- opt：参数项，它是一个朴素的对象，给函数项提供默认的初始参数值
- cfg：配置项，它是一个朴素的对象，给视图项中的子组件对象提供初始参数配置
- map：映射项，它是一个朴素的对象，为组件本身提供额外的配置

组件可以不必包含这些项，也可以仅包含某些项。下面是一些合法的组件描述。

```javascript
{ }
{ css: "" }
{ xml: "<div/>", fun: new Function }
{ opt: {}, map: {}, ali: {} } 
```

而下面组件描述都是不符合要求的。

```javascript
[]
{ css: {} }
{ xml: [], fun: new Function }
{ opt: {}, map: {}, ali: /[a-z]/i } 
```

组件还可以是基本的`HTML`元素。HTML元素是基组件，前面所说的组件叫做自定义组件。基组件是不可分解的，自定义组件可以由基组件或者其它自定义组件组合而成。比如下面的组件，它由两个基组件div和span组合而成的。

```javascript
{ xml: "<div><span/></div>" } 
```

文本也作为组件而存在，且属于基组件。下面的组件由两个子组件组合而成，其中h1是一HTML元素，"hello, world"是一文本。

```javascript
{ xml: "<h1>hello, world</h1>" } 
```
 
一段`CDATASection`描述也被看作组件，下面的组件包含了一个`CDATASection`子组件。`CDATASection`描述也属于基组件。

```javascript
{ xml: "<![CDATA[hello, world] ]>" } 
```

一段注释也是组件，下面的组件包含了一段注释子组件。注释也属于基组件。

```javascript
{ xml: "<!--这是一段注释-->" }
```

在视图项中，对组件集的描述应该是一个仅包含一个根节点的XML字符串，而不能是其他的不合法的描述。下面几个对视图项的描述就是不符合要求的。

```javascript
{ xml: "<div/><span/>" }      // 缺少根节点
{ xml: "div<span/>" }         // 开头缺少<span>
{ xml: "<span><div></span>" } // div未闭合
```

应该注意区分组件与组件对象。组件可以看作一些面向对象编程语言里面的类或者模板。而组件对象也叫组件实例，它是组件实例化的结果，一个组件可以实例化出若干个组件对象。自定义组件实例化后称之为自定义组件对象。一个HTML元素、一段文本、一段CDATASection描述以及一段注释都称作组件，当它们实例化后，则分别称之为HTML元素对象、文本对象、CDATASection对象以及注释对象。后续章节对相关内容的引用将遵守这些名称约定。

## 命名空间

命名空间是组件的容器，任一个组件必然属于某一个特定的命名空间。命名空间可以是空的，它不包含任何的组件。下面的代码定义了一个命名空间ui，该命名空间为根命名空间，它不包含任何组件。

```javascript
xmlplus("ui", function (xp, $_, t) {
   // 一个空的命名空间，不包含任何组件
});
```

下面的代码定义了一个根命名空间ui，它包含了组件Input和组件Calendar。这两个组件由函数`$_().imports`导入，其中不带参数的函数调用$_()，用于表示根命名空间`ui`。

```javascript
xmlplus("ui", function (xp, $_, t) {
    $_().imports({
        Input: {},
        Calendar: {}
    });
});
```

下面的代码定义了一个根命名空间`mx`，它包含了组件Input和组件Calendar。另外还定义了一个"mx"的子命名空间`mx/layout`，它包含了组件Tab和组件ViewStack。这两个组件由函数`$_("ui/layout").imports`导入，其中带参数的函数调用`$_("ui/layout")`，用于表示命名空间`mx/ui/layout`。

```javascript
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

除了自定义空间外，系统中还存在着一个匿名的空间，该空间包含了所有称之为基组件的对象。如上面所讲的HTML元素、文本等基组件都属于匿名空间。

允许存在多个不同的根命名空间，如下面所示，该示例中定义了两个根命名空间，分别为"alice"和"bob"。

```javascript
xmlplus("alice", function (xp, $_, t) {
    // 组件定义区
});
xmlplus("bob", function (xp, $_, t) {
    // 组件定义区
});
```

## 启动执行一个组件

定义好了组件之后，就可以通过xmlplus提供的startup接口启动执行一个指定的组件。下面的代码执行了一个位于命名空间ui/widget的组件Calendar。

```javascript
var parent = document.getElementById("parent");
xmlplus.startup("ui/widget/Calendar", parent); 
```

startup函数的第二个参数指定了组件实例化后被追加到的DOM元素对象，它也可以是某一DOM元素对象的id值，这种形式最为简洁，像下面这样。

```javascript
xmlplus.startup("ui/widget/Calendar", "parent"); 
```

下面是另一种组件的执行方式，它明确给出了组件的xml字符串描述。这与前一种方式等价。

```javascript
var xml = "<i:Calendar xmlns:i='ui/widget/Calendar'/>";
xmlplus.startup(xml, "parent");
```

还可以先解析出xml节点再执行，这与前两种方式等价。

```javascript
var xml = "<i:Calendar xmlns:i='ui/widget/Calendar'/>";
var xmlNode = xmlplus.parseXML(xml).lastChild;
xmlplus.startup(xmlNode, "parent");
```

当然，直接提供基组件也是可以的。下面的第一行会创建一个span元素对象，第二行会创建一个文本对象。

```javascript
xmlplus.startup("<span/>", "parent");
xmlplus.startup("hello, world", "parent");
```

现在有一个问题，为什么上面的第一个语句不是创建一个文本对象，而是创建一个span元素对象？这是系统自动判断的结果，如果想要得到"<span/>"这个文本对象，可以这么做。

```javascript
var textNode = document.createTextNode("<span/>");
xmlplus.startup(textNode, "parent");
```

startup函数还有可选的第三个参数，该参数可以为目标组件提供初始输入值。如下面的示例，Calendar组件在初始化时将采用第三参数提供的初始日期值。

```javascript
xmlplus.startup("ui/widget/Calendar", "parent", {date: "2016/01/01"});
```

当代码运行于浏览器端时，一般不显示地调用startup函数，请看下面的示例，可以直接在html中以XML的形式书写要实例化的组件。如果要禁用这种解析方式，并以startup函数启动当然也是可以的，只要给body添加属性noparse即可。

```html
<!DOCTYPE html>
<html>
    <head>
    <script src="xmlplus.js"></script>
    <script src="index.js"></script>
    </head>
    <body>
		<i:Index xmlns:i="ui"></i:Index>
    </body>
</html>
```

## 一个完整的示例

有别于前面零碎的代码片断，现在给出一个完整的可运行的示例。该示例由三个文件组成，下面是第一个文件，它是一个纯javascript文件，它向框架系统导入了一个名为Index的组件。现将其命名为"index.js"。

```javascript
xmlplus("ui", function (xp, $_, t) {
    $_().imports({
        Index: {
            css: "#text { color: red; }",
            xml: "<h1 id='text'>hello, world</h1>",
            fun: function( sys, items, opts ) {
                sys.text.css("font-size", "28px");
            }
        }
    });
});
```

下面是第二个文件，它是一个html文件，它引用了框架代码文件以及如上的第一个文件。现将其命名为"index.html"。

```html
<!DOCTYPE html>
<html>
    <head>
    <script src="xmlplus.js"></script>
    <script src="index.js"></script>
    </head>
    <body>
		<i:Index xmlns:i="ui"></i:Index>
    </body>
</html>
```

确保三个文件位于同一个目录下，通过浏览器打开index.html文件，将会看到一个红色的、字体大小为28px的"hello, world"文本。这个示例中涉及到部分本章未提及的内容，可先略过，后面的章节会有详细的讲述。
