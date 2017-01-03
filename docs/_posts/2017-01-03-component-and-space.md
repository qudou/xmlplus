# 组件与空间

---

## 组件

组件是应用的基本构造块，它是一个朴素的JSON对象。比如，{}是组件，而RegExp不是组件；{key:"value"}是组件，而[]不是组件。

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

组件还可以是基本的HTML元素。HTML元素是基组件，前面所说的组件叫做自定义组件。基组件是不可分解的，自定义组件可以由基组件或者其它自定义组件组合而成。比如下面的组件，它由两个基组件div和span组合而成的。

```javascript
{ xml: "<div><span/></div>" } 
```

文本也作为组件而存在，且属于基组件。下面的组件由两个子组件组合而成，其中h1是一HTML元素，"hello, world"是一文本。

```javascript
{ xml: "<h1>hello, world</h1>" } 
```
 
一段CDATASection描述也被看作组件，下面的组件包含了一个CDATASection子组件。CDATASection描述也属于基组件。

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

下面的代码定义了一个根命名空间ui，它包含了组件Input和组件Calendar。这两个组件由函数$_().imports导入，其中不带参数的函数调用$_()，用于表示根命名空间"ui"。

```javascript
xmlplus("ui", function (xp, $_, t) {
    $_().imports({
        Input: {},
        Calendar: {}
    });
});
```

下面的代码定义了一个根命名空间"mx"，它包含了组件Input和组件Calendar。另外还定义了一个"mx"的子命名空间"mx/layout"，它包含了组件Tab和组件ViewStack。这两个组件由函数$_("ui/layout").imports导入，其中带参数的函数调用$_("ui/layout")，用于表示命名空间"mx/ui/layout"。

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