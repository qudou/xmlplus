# 列表

列表是极其常用的一种组件，是许多组件系统的必须包含的。列表可以做的很简单，只显示简洁的文本。列表也可以做的很复杂，用于展示非常丰富的内容。

<img src="https://xmlplus.cn/img/components/list.png" class="img-responsive"/>

## 列表的组成

列表离不开列表项以及包含列表项的容器。下面是最简单的列表组件，它包含一个列表项组件 Item 以及一个列表项容器组件 List。

```js
// 04-01
Item: {
    xml: "<li id='item'/>"
},
List: {
    xml: "<ul id='list'/>"
}
```

此列表只是对原生列表元素的简单封装。里定义的列表组件尽管简单，但所构建的框架为我们的继续扩展奠定了基础。

## 使用系统接口操作列表

如上定义的列表组件的最基本的用法如下。这种用法与原生列表标签的用法没什么区别。我们将进行做进一步的改造。

```js
// 04-01
Index: {
    xml: `<List id='index'>
             <Item>Item 1</Item>
             <Item>Item 2</Item>
          </List>`
}
```

列表组件普遍包含添加、删除以及修改这三种操作。由于我们定义的列表项足够的简单，所以这里不再定义新的操作接口，而直接使用系统提供的接口。

```js
// 04-02
Index: {
    xml: `<div id='index'>
             <List id='list'/>
             <button id='append'>append</button>
             <button id='remove'>remove</button>
             <button id='modify'>modify</button>
          </div>`,
    fun: function (sys, items, opts) {
        sys.append.on("click", function() {
            sys.list.append("Item").text("Item 1");
        });
        sys.remove.on("click", function() {
            sys.list.first() && sys.list.first().remove();
        });
        sys.modify.on("click", function() {
            sys.list.first() && sys.list.first().text("Item 2");
        });
    }
}
```

该示例使用列表的系统函数 `append` 来追加列表项，并使用列表项的系统函数 `remove` 来移除列表项，同时还使用列表项的系统函数 `text` 来修改列表项的数据。

## 自定义列表项接口的使用

由于上一节列表项所包含的是简单的文本数据，所以上面示例使用 `text` 函数来操作数据是适合的。现在给出一个包含较复杂数据的列表项，该列表项额外定义了数据操作接口。

```js
// 04-03
Item: {
    xml: `<li id='item'>
             <span id='color'>red</span>
             <span id='shape'>square</span>
          </li>`,
    fun: function (sys, items, opts) {
        function getValue() {
            return {color: sys.color.text(), shape: sys.shape.text()};
        }
        function setValue(obj) {
            sys.color.text(obj.color);
            sys.shape.text(obj.shape);
        }
        return Object.defineProperty({}, "data", { get: getValue, set: setValue});
    }
}
```

下面是包含新列表项的列表操作的一个示例。其中对于组件的追加与删除还可以使用系统提供的函数，但对于数据的获取与修正就只能使用新定义的接口了。

```js
// 04-03
Index: {
    xml: `<List id='index'>
             <List id='list'/>
             <button id='append'>append</button>
             <button id='remove'>remove</button>
             <button id='modify'>modify</button>
          </List>`,
    fun: function (sys, items, opts) {
        sys.append.on("click", function() {
            sys.list.append("Item");
        });
        sys.remove.on("click", function() {
            sys.list.first() && sys.list.first().remove();
        });
        sys.modify.on("click", function() {
            var item = sys.list.first();
            item && (item.value().data = {color: "blue", shape: "rectangle"});
        });
    }
}
```

注意，对列表项接口的定义没有什么特别的要求，比如一定要使用 `setValue` 和 `getValue` 之类。这取决于具体的场景，根据需要灵活选择。

## 使用第三方列表组件

如今市面上已经有了种种功能丰富的列表组件，我们可以通过对其进行二次封装再方便地使用。这里结合 JQuery 带有排序功能的列表组件来说明如何操作。

首先需要对原列表项进行封装，因为原列表项实在太长了。注意需要引出数据操作接口。

```js
// 04-04
Item: {
    xml: "<li class='ui-state-default'><span class='ui-icon ui-icon-arrowthick-2-n-s'/><span id='data'/></li>",
    map: { appendTo: "data" },
    fun: function (sys, items, opts) {
        return { data: sys.data.text };
    }
}
```

其次，定义列表项的容器组件，该容器组件函数项部分主要封装了 JQuery 的列表初始化代码。该初始化代码用于指明当前列表为可排序但不可选。注意需要同时把相关的样式也给写上。

```js
// 04-04
List: {
    css: `#list{ list-style-type: none; margin: 0; padding: 0; width: 60%; }
          #list li { margin: 0 3px 3px 3px; padding: 0.4em; padding-left: 1.5em; font-size: 1.4em; height: 18px; }
          #list li span:first-child { position: absolute; margin-left: -1.3em; }`,
    xml: "<ul id='list'/>",
    fun: function (sys, items, opts) {
        var elem = this.elem();
        $(elem).sortable();
        $(elem).disableSelection();
    }
}
```

最后我们来看看如何使用该列表组件。该示例的使用与前面没什么不同，但功能与表现可就大不一样了。

```js
// 04-04
Index: {
    xml: `<List id='index'>
             <Item>Item 1</Item>
             <Item>Item 2</Item>
             <Item>Item 3</Item>
          </List>`
}
```

## 优化

如果你的列表有频繁更新数据的要求，必然会产生频繁的列表项的增删操作，这可能会带来不好的应用体验。下面给出一个可行的优化方案，该方案在官方文档的 [优化](http://xmlplus.cn/docs#优化) 章节中已出现过。

```js
// 04-05
List: {
    xml: "<ul id='list'/>",
    fun: function (sys, items, opts) {
        function setValue(array) {
            var list = sys.list.children();
            for ( var i = 0; i < array.length; i++ )
                (list[i] || sys.list.append("Item")).show().text(array[i]);
            for ( var k = i; k < list.length; k++ )
                list[k].hide();
        }
        return Object.defineProperty({}, "value", { set: setValue });
    }
}
```

对于复杂的列表项，重新创建的代价是巨大的。所以此优化方案尽可能地复用了已有的列表项，非必要时只刷新数据而不是删除并重建新的列表项，并且只有在已有的列表项不够用时才创建新的列表项。