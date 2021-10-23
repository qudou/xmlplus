# 分隔框

分隔框（DividedBox）是一种布局类组件，可以分为两种，其中一种叫水平分隔框（HDividedBox），另一种叫垂直分隔框（VDividedBox）。水平分隔框会将其子级分为两列，而垂直分隔框则会将其子级分为两行。列与列之间以及行与行之间一般都会有一条可以拖动的用以改变子级组件大小的分隔条。下面仅以垂直分隔框为例来介绍此类组件是如何设计以及实现的。

<img src="https://xmlplus.cn/img/components/dividedbox.png" class="img-responsive"/>

## 成品组件用例

按照以往的设计经验，我们可以先写出想像中的成品组件用例，这将有助于我们后续的进一步的设计与实现。垂直分隔框既然是布局类的组件，那么它也一定是一个容器，该容器包含了上述我们提到的三种子级组件。为了使用方便，我们不应该把分隔框也写进去，分隔框应该由组件内部实现的。经过分析，我们得到下面的一个应用示例：

```js
// 08-01
Index: {
    css: "#index { width: 640px; height: 480px; box-sizing: border-box; border: 1px solid blue; }\
          #top, #bottom { width: 100%; height: 100%; background: #AAA; }",
    xml: "<VDividedBox id='index'>\
             <div id='top'/>\
             <div id='bottom'/>\
          </VDividedBox>"
}
```

该示例由一垂直分隔框组件包裹着两个 div 元素。这里分别设置两个 div 元素的宽高为父级的 100%，同时设置它们的背景色为灰色，这只是为了方便测试。另外，我们还需要考虑一个子框的初始比例分配问题。我们可以设置默认比例为 `50:50`，比例最好可以在组件实例化时静态指定，同时提供比例设置的动态接口。于是我们就有了下面的改进用例。

```js
// 08-01
Index: {
    css: "#index { width: 640px; height: 480px; box-sizing: border-box; border: 1px solid blue; }\
          #top, #bottom { width: 100%; height: 100%; background: #AAA; }",
    xml: "<VDividedBox id='index' percent='30'>\
             <div id='top'/>\
             <div id='bottom'/>\
          </VDividedBox>",
    fun: function (sys, items, opts) {
        sys.top.on("click", e => sys.index.percent = 50);
    }
}
```

这个用例在垂直分隔框初始化时设置子框的初始比例分配为 `30:70`，当用户点击第一子框时，比例分配重新恢复为 `50:50`。不过要注意，这些比例分配指的是对排除分隔条所占用空间后剩余空间的比例分配。

## 设计与实现

现在让我们把注意力转移到组件的内部。我们先大致地确定组件基本的组成。直观地看，垂直分隔框显示包含三个组件部分：上子框部分、分隔条以及下子框部分。于是我们暂时可以得到下面的视图项部分：

```xml
// 08-01
<div id='hbox'>
    <div id='top'/>
    <div id='handle'/>
    <div id='bottom'/>
</div>`
```

下一步，确保垂直分隔框组件实例的子级部分被正确地映射到上子框 `top` 以及下子框 `bottom`。方法是先让所有的子级元素对象全部被添加到上子框 `top` 中，然后在函数项中将下子级元素添加到下子框 `bottom` 中。

```js
// 08-01
VDividedBox: {
    xml: `<div id='hbox'>
            <div id='top'/>
            <div id='handle'/>
            <div id='bottom'/>
          </div>`,
    map: {appendTo: "top" },
    fun: function (sys, items, opts) {
        sys.bottom.elem().appendChild(this.last().elem());
    }
}
```

现在让我们来考虑下视图项的样式，对于顶层 div 元素，我们设置其定位方式为相对定位。对于子级的三个元素则设置为绝对定位。另外，把分隔条高度设置为 `5px`。

```js
// 08-01
VDividedBox: {
    css: `#vbox { position:relative; width:100%; height:100%; box-sizing: border-box; }
          #top { top: 0; height: 30%; } #bottom { bottom: 0; height: calc(70% - 5px); }
          #top,#bottom { left: 0; right: 0; position: absolute; }
          #handle { height: 5px; width: 100%; position:absolute; left:0; top: 30%; z-index:11; cursor:row-resize; }`,
    xml: `<div id='vbox'>
            <div id='top'/>
            <div id='handle'/>
            <div id='bottom'/>
          </div>`,
    map: { appendTo: "top" },
    fun: function (sys, items, opts) {
        sys.bottom.elem().appendChild(this.last().elem());
    }
}
```

最后让我们看看如何响应分隔条的拖动事件，从而更改子框的分配比例。我们需要定义一个改变子框比例的函数，同时侦听分隔条的拖拽事件。下面是我们的一个实现。

```js
// 08-01
VDividedBox: {
    // 视图项同上
    map: { format: {"int": "percent"}, appendTo: "top" }, 
    fun: function (sys, items, opts) {
        var percent = 50;
        sys.handle.on("dragstart", function (e) {
            sys.hbox.on("dragover", dragover);
        });
        sys.hbox.on("dragend", function (e) {
            e.stopPropagation();
            sys.hbox.off("dragover", dragover);
        });
        function dragover(e) {
            e.preventDefault();
            setPercent((e.pageY - sys.hbox.offset().top) / sys.hbox.height() * 100);
        }
        function setPercent(value) {
            sys.handle.css("top", value + "%");
            sys.top.css("height", value + "%");
            sys.bottom.css("height", "calc(" + (100 - value) + "% - 5px)");
        }
        setPercent(opts.percent || percent);
        sys.bottom.elem().appendChild(this.last().elem());
        return Object.defineProperty({}, "percent", {get: () => {return percent}, set: setPercent});
    }
}
```

上述代码的映射项中有一项关于 `percent` 格式的设置，该设置确保了 `percent` 为整型数。另外函数项中对子框的比例设定用到了 CSS3 的 `calc` 计算函数，该函数在浏览器窗体改变大小时仍然能够起作用。如果你希望兼容更多的浏览器，你需要做更多的工作。另外注意，为了让组件有好的性能表现，只有当用户开始拖拽时，才对事件 `dragover` 实施侦听。

## 进一步改进

上述组件在大部分情况下运作良好，但当我将 CodeMirror 组件整合进去时，出了点小问题。让我们现在做个小测试，写一个包含两个 CodeMirror 组件作为子级的垂直分隔框的应用实例。拖动分隔条，看会出现什么结果。

```js
// 08-02
Index: {
    css: "#index { width: 640px; height: 480px; box-sizing: border-box; border: 1px solid #AAA; }",
    xml: "<VDividedBox id='index'>\
             <Editor id='top'/>\
             <Editor id='bottom'/>\
          </VDividedBox>"
},
Editor: {
    css: `.CodeMirror { height:100%; height: 100%; font-size: 14px; }
          .CodeMirror-gutters { border-right: 1px solid %border-color; background: linear-gradient...}
          #editor { position: relative; width: 100%; height: 100%; box-sizing: border-box; border: 1px solid #AAA; }`,
    map: { nofragment: true },
    opt: { lineNumbers: true, indentUnit: 4, mode: "text/html" }, 
    xml: "<div id='editor'/>",
    fun: function (sys, items, opts) {
        return CodeMirror(sys.editor.elem(), opts);
    }
}
```

如果你运行此示例，会发现分隔条失灵了，拖动分隔条子框比例不再出现变化。问题出在 CodeMirror 组件对象对拖拽事件进行了劫持，导致我们我组件内部收不到响应的事件。我们需要做些补丁才行，下面是改进后的组件：

```js
// 08-03
VDividedBox: {
    css: `#vbox { position:relative; width:100%; height:100%; box-sizing: border-box; }
          #top { top: 0; height: 30%; } #bottom { bottom: 0; height: calc(70% - 5px); }
          #top,#bottom { left: 0; right: 0; position: absolute; }
          #handle { height: 5px; width: 100%; position:absolute; left:0; top: 30%; z-index:11; cursor:row-resize; }
          #mask { width: 100%; height: 100%; position: absolute; display: none; z-index: 10; }`,
    xml: "<div id='vbox'>\
            <div id='top'/>\
            <div id='handle' draggable='true'/>\
            <div id='bottom'/>\
            <div id='mask'/>\
          </div>",
    map: { format: {"int": "percent"}, appendTo: "top" }, 
    fun: function (sys, items, opts) {
        var percent = 50;
        sys.handle.on("dragstart", function (e) {
            sys.mask.show();
            sys.vbox.on("dragover", dragover);
        });
        sys.vbox.on("dragend", function (e) {
            sys.mask.hide();
            e.stopPropagation();
            sys.vbox.off("dragover", dragover);
        });
        function dragover(e) {
            e.preventDefault();
            setPercent((e.pageY - sys.vbox.offset().top) / sys.vbox.height() * 100);
        }
        function setPercent(value) {
            sys.handle.css("top", value + "%");
            sys.top.css("height", value + "%");
            sys.bottom.css("height", "calc(" + (100 - value) + "% - 5px)");
        }
        setPercent(opts.percent || percent);
        sys.bottom.elem().appendChild(this.last().elem());
        return Object.defineProperty({}, "percent", {get: () => {return percent}, set: setPercent});
    }
}
```

为了解决问题，我们在组件中引用了额外的 `div` 元素对象 `mask`，此元素默认是不显示的。当拖动开始时，它才显示并覆盖住子框以及分隔条，而拖动一结束，它又隐藏掉。这样就避免了 CodeMirror 组件对象对拖拽事件的劫持。

## 结合水平分隔框使用

我们有了上述垂直分隔框的设计经验，搞个水平分隔框也就不是什么难事了，这里就不列出来了。这里主要是给出一个综合使用水平分隔框和垂直分隔框的示例。当然，在设计之初，我们并没有想到要这么使用。

```js
// 08-04
Index: {
    css: `#index { width: 640px; height: 480px; box-sizing: border-box; border: 1px solid blue; }
          #left0, #right0, #left1, #right1 { width: 100%; height: 100%; background: #AAA; }`,
    xml: `<HDividedBox id='index'>
              <VDividedBox percent='30'>
                  <div id='left0'/><div id='right0'/>
              </VDividedBox>
              <VDividedBox percent='30'>
                  <div id='left1'/><div id='right1'/>
              </VDividedBox>
          </HDividedBox>`
}
```