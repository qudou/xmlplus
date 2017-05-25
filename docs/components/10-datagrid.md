# 网格

这一章我们要实现是一个网格组件，该组件除了最基本的数据展示功能外，还提供排序以及数据过滤功能。

<img src="http://xmlplus.cn/img/datagrid.png" class="img-responsive"/>

## 数据源

为了测试我们即将编写好网格组件，我们采用如下格式的数据源。此数据源包含两部分的内容，分别是表头数据集和表体数据集。网格组件实例最终的列数由表头数据集的长度决定。

```js
// 10-01
var data = { 
    gridColumns: ['name', 'power'],
    gridData: [
      { name: 'Chuck Norris', power: Infinity },
      { name: 'Bruce Lee', power: 9000 },
      { name: 'Jackie Chan', power: 7000 },
      { name: 'Jet Li', power: 8000 }
    ]
};
```

## 顶层设计

从视觉上，我们很自然地把网格组件划分为表头与表体。此网格组件有三个功能，所以应该提供三个动态接口。但我们注意到排序功能是通过点击表头进行的，而表头属于网格组件的一部分，所以该功能应该内置。从而，实际上我们的网格组件对外只暴露两个动态接口：一个用于过滤，另一个用于接收数据源。于是我们可以得到如下的一个顶层设计。

```js
// 10-01
DataGrid: {
    xml: `<table id='datagrid'>
            <Thead id='thead'/>
            <Tbody id='tbody'/>
          </table>`,
    fun: function (sys, items, opts) {
        function setValue(data) {
            items.thead.val(data.gridColumns);
            items.tbody.val(data.gridColumns, data.gridData);
        }
        function filter(filterKey) {
            // 过滤函数
        }
        return { val: setValue, filter: filter };
    }
}
```

## 设计表头

表头只有一行，所以可以直接给它提供一个 tr 元素。tr 元素的子级项 th 元素的个数取决于表头数据集的长度，所以需要动态创建。由于 th 元素包含了排序功能，所以需要另行封装。下面是我们给出的表头的设计。

```js
// 10-01
Thead: {
    xml: `<thead id='thead'>
              <tr id='tr'/>
          </thead>`,
    fun: function (sys, items, opts) {
        return function (value) {
            sys.tr.children().call("remove");
            data.forEach(item => sys.tr.append("Th").value().val(item));
        };
    }
}
```

表头数据项组件提供一个文本设置接口。该组件本身并不负责排序，它只完成自身视图状态的变更以及排序命令的派发。排序命令的派发需要携带两个数据：一个是排序关键字，也就是表头文本；另一个排序方向：升序或者降序。

```js
// 10-01
Th: {
    css: "#active { color: #fff; } #active #arrow { opacity: 1; } #active #key { color: #fff; }\
          #arrow { display: inline-block; vertical-align: middle; width: 0; height: 0;... }\
          #asc, #dsc { border-left: 4px solid transparent; border-right: 4px solid transparent; }\
          #asc { border-bottom: 4px solid #fff;} #dsc { border-top: 4px solid #fff; }",
    xml: "<th id='th'>\
            <span id='key'/><span id='arrow'/>\
          </th>",
    fun: function (sys, items, opts) {
        var order = "#asc";
        this.watch("sort", function (e, key, order) {
            sys.key.text().toLowerCase() == key || sys.th.removeClass("#active");
        });
        this.on("click", function (e) {
            sys.th.addClass("#active");
            sys.arrow.removeClass(order);
            order = order == "#asc" ? "#dsc" : "#asc";
            sys.arrow.addClass(order).notify("sort", [sys.key.text().toLowerCase(), order]);
        });
        sys.arrow.addClass("#asc");
        return sys.key.text;
    }
}
```

## 设计表体

表体可以有多行，但表体只负责展示数据，所以实现起来比表头要简单的多。

```js
// 10-01
Tbody: {
    xml: `<tbody id='tbody'/>`,
    fun: function (sys, items, opts) {
        return function (gridColumns, gridData) {
            sys.tbody.children().call("remove");
            gridData.forEach(data => 
                tr = sys.tbody.append("tr");
                gridColumns.forEach(key => tr.append("td").text(data[key]));
            ));
        };
    }
}
```

此组件提供了一个接收数据源的动态接口，数据源需要包含两个部分：表头数据集与表体数据集。该动态接口根据这两个数据集完成数据的展示。

## 加入排序功能

为了便于管理，我们把排序功能单独封装成一个组件，该组件提供一个排序接口，同时侦听一个排序消息。一旦接收到排序消息，则记录下关键字与排序方向，并派发一个表体刷新命令。

```js
// 10-01
Sort: {
    fun: function (sys, items, opts) {
        var sortKey, sortOrder;
        this.watch("sort", function (e, key, order) {
            sortKey = key, sortOrder = order;
            this.trigger("update");
        });
        return function (data) {
            return sortKey ? data.slice().sort(function (a, b) {
                a = a[sortKey], b = b[sortKey];
                return (a === b ? 0 : a > b ? 1 : -1) * (sortOrder == "#asc" ? 1 : -1);
            }) : data;
        };
    }
}
```

要完整地实现排序功能，对组件 DataGrid 作一些修正，主要是内置上述的排序功能组件并侦听表体刷新指令。一旦接收到刷新指令，则对表体数据完成排序并刷新表体。

```js
// 10-01
DataGrid: {
    xml: `<table id='table'>
            <Thead id='thead'/>
            <Tbody id='tbody'/>
            <Sort id='sort'/>
          </table>`,
    fun: function (sys, items, opts) {
        var data = {gridColumns: [], gridData: []};
        function setValue(value) {
            data = value;
            items.thead(data.gridColumns);
            items.tbody(data.gridColumns, data.gridData);
        }
        function filter(filterKey) {
            // 过滤函数
        }
        this.on("update", function() {
            items.tbody(items.sort(data.gridData));
        });
        return { val: setValue, filter: filter };
    }
}
```

## 加入过滤功能

与排序功能的加入流程类似，我们把过滤功能单独封装成一个组件，该组件提供一个过滤接口，同时侦听一个过滤消息。一旦接收到消息，则记录下过滤关键字，并派发一个表体刷新命令。

```js
// 10-01
Filter: {
    fun: function (sys, items, opts) {
        var filterKey = "";
        this.watch("filter", function (e, key) {
            filterKey = key.toLowerCase();
            this.trigger("update");
        });
        return function (data) {
            return data.filter(function (row) {
                return Object.keys(row).some(function (key) {
                    return String(row[key]).toLowerCase().indexOf(filterKey) > -1;
                });
            });
        };
    }
}
```

另外需要对组件 DataGrid 作一些修正，修正内容与上述的排序功能的加入类似，区别在于额外完善了 filter 接口以及对消息作用域进行了限制。下面是我们最终的网格组件。

```js
// 10-01
DataGrid: {
    css: `#table { border: 2px solid #42b983; border-radius: 3px; background-color: #fff; }
          #table th { background-color: #42b983; color: rgba(255,255,255,0.66); cursor: pointer; ... }
          #table td { background-color: #f9f9f9; }
          #table th, #table td { min-width: 120px; padding: 10px 20px; }`,
    xml: `<table id='table'>
            <Thead id='thead'/>
            <Tbody id='tbody'/>
            <Sort id='sort'/>
            <Filter id='filter'/>
          </table>`,
    map: { msgscope: true },
    fun: function (sys, items, opts) {
        var data = {gridColumns: [], gridData: []};
        function setValue(value) {
            data = value;
            items.thead(data.gridColumns);
            items.tbody(data.gridColumns, data.gridData);
        }
        function filter(filterKey) {
            sys.table.notify("filter", filterKey);
        }
        this.on("update", function() {
            items.tbody(data.gridColumns, items.filter(items.sort(data.gridData)));
        });
        return { val: setValue, filter: filter };
    }
}
```

值得注意的是这里一定要在映射项中配置限制消息作用域的选项。否则，当在一个应用中实例化多个网格组件时，消息就会互相干扰。

## 测试

最后我们来测试下我们完成的组件，测试的功能主要就是刚开始提到的三个：数据展示、排序以及过滤。

```
// 10-01
Index: {
    css: `#index { font-family: Helvetica Neue, Arial, sans-serif; font-size: 14px; color: #444; },
          #search { margin: 8px 0; }`
    xml: `<div id='index' xmlns:i='datagrid'>
            Search <input id='search'/>
            <i:DataGrid id='datagrid'/>
          </div>`,
    fun: function (sys, items, opts) {
        items.datagrid.val({
            gridColumns: ['name', 'power'],
            gridData: [
              { name: 'Chuck Norris', power: Infinity },
              { name: 'Bruce Lee', power: 9000 },
              { name: 'Jackie Chan', power: 7000 },
              { name: 'Jet Li', power: 8000 }
            ]
        });
        sys.search.on("input", e => items.datagrid.filter(sys.search.prop("value")));
    }
}
```