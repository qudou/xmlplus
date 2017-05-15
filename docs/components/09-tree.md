# 树

树形组件是一种具有层级结构的组件，广泛应用于各种场景。本章会实现一个简单的树形组件，尽管功能有限，但你可以通过扩展它来实现自己所需要的树形组件。

![输入图片说明](https://static.oschina.net/uploads/img/201705/02152247_CNbI.png "在这里输入图片标题")

## 数据源

树形组件的数据源可以是 JSON 格式的数据对象，也可以是具有 XML 结构的数据或者是其它的具有层级结构的数据。本章将采用具有如下 JSON 格式的数据对象。

```json
// 09-01
{
    name: 'My Tree',
    children: [
        { name: 'hello' },
        { name: 'world' },
        { name: 'child folder', children: [{ name: 'alice' }]}
    ]
};
```

上述数据源中，name 值会作为树结点的名称显示，含 children 的数组代表节点的子级。

## 递归结构的设计

由 HTML 中的列表元素 ul 以及 li 组合而成对象具有天然的树形结构，我们不妨采用它们作为构建树形组件的基本元素。树形组件的最外层必然是一个 ul 元素，所以我们可以暂时定义树形组件如下：

```js
// 09-01
Tree: {
    xml: `<ul id='tree'>
            <Item id='item'/>
          </ul>`
}
```

这里的未定义的组件 Item 是一个需要递归定义的子项组件，它会根据提供的数据递归地生成子孙对象。下面是一种可能的设计：

```js
// 09-01
Item: {
    xml: `<li id='item'>
            <div id='content'>
              <span id='neme'/><span id='expand'/>
            </div>
            <ul id='children'/>
          </li>`,
    map: { defer: "children" }
}
```

注意，上面的 neme 对象是用于显示 name 属性的。expand 对象用于展开或者关闭子级对象 entries。子级对象 children 被设置为需要延迟实例化，只有当用户点击 expand 对象展开子级时，该对象才会实例化。

## 数据的加载与渲染

如上一节所述，我们设定了子级对象 children 需要延迟实例化。所以，在给子项 Item 提供的数据设置接口不应该立马对 children 实例化。下面我们先给出数据接口函数。

```js
// 09-01
Item: {
    // css, xml, map 项同上
    fun: function (sys, items, opts) {
        var data;
        return function (value) {
            data = value;
            sys.neme.text(data.name);
            data.children && data.children.length && sys.expand.show().text(" [+]");
        };
    }
}
```

该接口函数只是设置了当前节点相关的内容。下面我们来侦听 expand 对象的点击事件，并适时地完成组件对象 children 的实例化。

```js
// 09-01
Item: {
    // css, xml, map 项同上
    fun: function (sys, items, opts) {
        var data, open;
        sys.expand.on("click", function () {
            open = !open;
            sys.expand.text(open ? " [-]" : " [+]");
            open ? (sys.children.show() && load()) : sys.children.hide();
        });
        function load() {
            if ( sys.children.children().length == 0 )
              for ( var item of data.children )
                sys.add.before("Item").value()(item);
        }
        return function (value) {
            data = value;
            sys.neme.text(data.name);
            data.children && data.children.length && sys.expand.show().text(" [+]");
        };
    }
}
```

上述代码中包含一个 open 参数，该参数记录了当前节点的是否处于展开状态以供相关的侦听器使用。

## 动态添加节点

现在我们对上述组件进行一个小的扩展，使得它支持动态添加树节点的功能。首先，我们在对象 children 的子级添加一个触发按钮，并命名为 add。

```js
// 09-01
Item: {
    xml: `<li id='item'>
            <div id='content'>
              <span id='neme'/><span id='expand'/>
            </div>
            <ul id='children'>
              <li id='add'>+</li>
            </ul>
          </li>`,
    map: { defer: "children" }
}
```

其次，需要侦听 add 对象的点击事件，在侦听器中完成对象的添加。

```js
// 09-01
Item: {
    // css, xml, map 项同前
    fun: function (sys, items, opts) {
        var data, open;
        sys.item.on("click", "//*[@id='add']", function () {
            var stuff = {name: 'new stuff'};
            data.children.push(stuff);
            sys.add.before("Item").value()(stuff);
        });
        // 其余代码同前
    }
}
```

这里需要注意，对 add 对象的侦听不能采取直接式的侦听：`sys.add.on("click",...)`，而应该使用代理的方式，否则会报错。因为其父级属于延迟实例化的组件，在 children 对象未实例化之间，add 对象并不可见。

## 完整的树形组件

综合以上的内容，现在给出一个完整版本的树形组件，下面先给出的是树组件的子项组件：

```js
// 09-01
Item: {
    css: "#item { cursor: pointer; }",
    xml: `<li id='item'>
            <div id='content'>
              <span id='neme'/><span id='expand'/>
            </div>
            <ul id='children'>
              <li id='add'>+</li>
            </ul>
          </li>`,
    map: { defer: "children" },
    fun: function (sys, items, opts) {
        var data, open;
        sys.item.on("click", "//*[@id='add']", function () {
            var stuff = {name: 'new stuff'};
            data.children.push(stuff);
            sys.add.before("Item").value()(stuff);
        });
        sys.expand.on("click", function () {
            open = !open;
            sys.expand.text(open ? " [-]" : " [+]");
            open ? (sys.children.show() && load()) : sys.children.hide();
        });
        function load() {
            if ( sys.children.children().length == 1 )
              for ( var item of data.children )
                sys.add.before("Item").value()(item);
        }
        return function (value) {
            data = value;
            sys.neme.text(data.name);
            data.children && data.children.length && sys.expand.show().text(" [+]");
        };
    }
}
```

其次给出树组件。在实际应用中的树形组件会比这里的功能更丰富些，你可以在上述代码的基础上进一步的改进，比如添加些 ICON 图标、让子项成为可拖动的等等。但在改进过程中尽量避免代码的复杂化，适当地剥离些代码出来封装成组件是非常有必要的。

```js
// 09-01
Tree: {
    css: `#tree { font-family: Menlo, Consolas, monospace; color: #444; }
          #tree, #tree ul { padding-left: 1em; line-height: 1.5em; list-style-type: dot; }`,
    xml: `<ul id='tree'>
            <Item id='item'/>
          </ul>`,
    fun: function (sys, items, opts) {
        return items.item;
    }
}
```

## 测试

我们最后给出一个测试用例。该例子的测试数据与本章开始给出的数据一致。

```js
Index: {
    xml: "<Tree id='tree' xmlns='tree'/>",
    fun: function (sys, items, opts) {
        items.tree({
            name: 'My Tree',
            children: [
                { name: 'hello' },
                { name: 'world' },
                { name: 'child folder', children: [{ name: 'alice' }]}
            ]
        });
    }
}
```