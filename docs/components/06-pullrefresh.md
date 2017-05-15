# 下拉刷新

“下拉刷新”由著名设计师 Loren Brichter 设计，并应用于 Twitter 第三方应用 Tweetie 中。2010年4月，Twitter 收购 Tweetie 开发商 Atebits 后，该专利归 Twitter 所有。这一章我们就来看看如何实现一个简单的下拉刷新组件。

![](http://images2015.cnblogs.com/blog/1151595/201704/1151595-20170427202105225-1649083437.png)

## 目标组件分析

和前面在设计组件时的做法一样，我们先想想看最终的成品组件是如何使用的，这需要点想像力。下拉刷新组件看成一个容器组件是合理的，用户可以对容器的内容进行下拉操作。如果用户完成了完整的下拉触发操作，该组件应该会有下拉完成的事件反馈，假定这个事件名为 `ready`。根据以上的分析，我们很有可能得到下面的一个该组件的应用示例。

```
Index: {
    xml: `<PullRefresh id='example'>
             <h1>Twitter</h1>
             <h2>Loren Brichter</h2>
          </PullRefresh>`,
    fun: function (sys, items, opts) {
        sys.example.on("ready", () => console.log("ready"));
    }
}
```

示例中的使用方式是非常简洁的，但我们还漏了一点。当刷新完毕，数据返回后，还要告知组件对象给出刷新成功的提示并且返回初始状态。好了，下面给出的是加入新接口的应用示例。

```
// 06-01
Index: {
    xml: `<PullRefresh id='example'>
             <h1>Twitter</h1>
             <h2>Loren Brichter</h2>
             <button id='refresh'>click</button>
          </PullRefresh>`,
    fun: function (sys, items, opts) {
        sys.example.on("ready", () => {
            setTimeout(() => sys.example.trigger("complete"), 3000);
        });
    }
}
```

该示例通过定时器模拟了下拉刷新完成后给出刷新成功的提示并且返回初始状态。

## 布局

现在让我们把目光转移到下拉刷新组件的内部，看看该如何去实现。观察文章开始部分的大图，很自然地我们可以将整个组件划分为三个子组件，如下面的 XML 文档所示。

```xml
<div id="refresh">
    <Status id="status"/>
    <div id="content"></div>
</div>
```

但为了方便控制，下面的布局可能会好一些。其中组件 page 代表视口，它与其父级 refresh 有相同的宽高尺寸。另外，内容组件 content 与视口组件 page 也具有相同的宽高尺寸。未定义的状态条组件 Status 的高度为 `40px`，这样在初始状态下，状态条组件与内容组件需要向上便宜 40 个像素。

```js
// 06-01
PullRefresh: {
    css: `#refresh { position: relative; height: 100%; cursor: pointer; overflow-y: hidden; }
          #page { height: 100%; transform: translateY(0); }
          #status, #content { transform: translateY(-40px); } #content { height: 100%; }`,
    xml: `<div id='refresh' xmlns:i='pullrefresh'>
            <div id='page'>
                <i:Status id='status'/>
                <div id='content'></div>
            </div>
          </div>`,
    map: { "appendTo": "content" }
}
```

## 状态条的实现

暂且放下 PullRefresh 组件，我们先看看如何实现状态指示条。状态指示条用于显示“下拉刷新”、“松开刷新”、“加载中...”以及“刷新成功”四个状态提示，并且每一时刻仅显示一个状态。对于状态的切换，这里会先用到我们下一章将讲到的路由组件 ViewStack，这里仅需要了解如何使用即可。组件 ViewStack 对外只显示子级的一个子组件，同时侦听一个 `switch` 事件，该事件的派发者携带了一个切换到的目标对象的名称，也就是 ID。该组件根据这个 ID 来切换到目标视图。下面是状态条组件的完整实现。

```js
// 06-01
Status: {
    css: "#statusbar { height: 2.5em; line-height: 2.5em; text-align: center; }",
    xml: <ViewStack id="statusbar">
            <span id="pull">Pull to refresh...</span>
            <span id="release">Release to refresh...</span>
            <span id="loading">Loading...</span>
            <span id="success">Loading success</span>
         </ViewStack>,
    fun: function (sys, items, opts) {
        var stat = "pull";
        function getValue() {
            return stat;
        }
        function setValue(value) {
            sys.statusbar.trigger("switch", stat = value);
        }
        return Object.defineProperty({}, "value", { get: getValue, set: setValue });
    }
}
```

该组件提供一个 value 接口用户设置与获取组件的显示状态。父级组件可根据不同的时机调用该接口。

## 事件响应

现在让我们来考虑下拉刷新组件操作实现的具体细节。我们需要考虑的事件主要有三个：`stouchstart`、`touchmove` 以及 `touchend`。下面是一个实现框架：

```js
// 06-01
PullRefresh: {
    fun: function (sys, items, opts) {
        var startY, translateY;
        sys.page.on("touchstart", function(e) {
            // 1 记录下当前触点的坐标以及 page 的偏移
            // 2 侦听 touchmove 和 touchend事件
        });
        function touchmove(e) {
            // 1 计算出垂直方向上的偏移
            // 2 处理状态条与内容内面跟随触点移动
            // 3 根据触点移动的距离显示相当的状态条内容
        }
        function touchend(e) {
            // 1 移除 touchmove 和 touchend 事件
            // 2 根据触点移动的距离决定返回原始状态或者进入刷新状态并派发事件
        }
    }
}
```

现在我们一个个地来实现上面的三个侦听器。首先是 `touchstart` 侦听器：

```js
// 06-01
sys.page.on("touchstart", function (e) {
    startY = e.targetTouches[0].pageY;
    translateY = parseInt(sys.page.css("transform").match(/\d+/)[0]);
    sys.page.on("touchmove", touchmove).on("touchend", touchend).css("transition", "");
});
```

下拉刷新过程中会涉及到动画，对于动画目前一般有两种选择，可以使用 JQuery 动画函数，也可以是 css3，这需要看各人喜好了。这里我们选择使用 css3 来实现。如上所示在下拉开始时需要把动画给禁用掉，否则会对后续造成干扰。

其次是 `touchmove` 侦听器。该侦听器必需判断出偏移的正负值，当偏移为正时才允许移动页面。

```js
// 06-01
function touchmove(e) {
    var offset = e.targetTouches[0].pageY - startY;
    if ( offset > 0 ) {
        sys.page.css("transform", "translateY(" + (offset + translateY) + "px)");
        if (items.status.value != "loading")
            items.status.value = offset > 40 ? "release" : "pull";
    }
}
```

最后是 `touchend` 侦听器。该处理器需要处理三种情况。情况一，如果状态条处理等待数据返回状态，则回弹页面使状态条还处于该状态。情况二，如果用户下拉幅度未超过 40px，则回弹页面使状态条处于隐藏状态。情况三，如果用户下拉幅度超过 40px，则派发一个 ready 事件，并切换状态条至等待数据返回状态。

```js
// 06-01
function touchend(e) {
    var offset = e.changedTouches[0].pageY - startY;
    sys.page.off("touchmove").off("touchend").css("transition", "all 0.3s ease-in 0s");
    if ( items.status.value == "release" ) {
        sys.page.css("transform", "translateY(40px)");
    } else if ( offset < 40 ) {
        sys.page.css("transform", "translateY(0)");
    } else {
        release();
    }
}
```

由于情况三的处理较复杂，所以独立封装成一个函数处理。请看下面的 release 函数。

```js
// 06-01
function release() {
    items.status.value = "release";
    sys.refresh.once("complete", () => {
        items.status.value = "message";
        setTimeout(e => {
            sys.page.css("transform", "translateY(0)").once("webkitTransitionEnd", e => items.status.value = "pull");
        }, 300);
    });
    sys.page.css("transform", "translateY(40px)").trigger("ready");
}
```

此函数主要完成两件事，其一是派发 ready 事件，提醒上级组件发送数据请求，其二是侦听 complete 事件，一旦接收到来自上级派发的 complete 事件则显示完成数据请求的提示并返回初始状态。

## 状态条的改进

上面我们实现的状态条是纯文字的，这一节让我们把 `加载中...` 替换成一个动画，从而给用户带来更好的体验。下面实现的动画组件 Release 包含一个旋转的类似菊花一样的东西，同时还包含文本。

```js
// 06-02
Release: {
    css: `#loader { display: inline-block; position: relative; height: 2.5em; line-height: 2.5em; }
          #spinner { width: 1.2em; height: 1.2em; position: absolute; top: .7em; }
          #label { display: inline-block; font-size: 0.75em; margin: 0 0 0 2em; }`,
    xml: `<div id='loader'>
            <Spinner id='spinner'/><span id='label'/>
          </div>`,
    map: { appendTo: "label" }
},
Spinner: {
    css: `#loader { width: 1.5em; height: 1.5em; animation: spin 1s linear infinite; -webkit-animation: spin 1s linear infinite; }
          @keyframes spin {0% {transform: rotate(0deg);} 100% {transform: rotate(360deg); } }
          @-webkit-keyframes spin {0% {-webkit-transform: rotate(0deg);} 100% {-webkit-transform: rotate(360deg); } }`,
    xml: `<svg id='loader' width='48' height='48' viewBox='0 0 1024 1024'>
            <path d='M512.151961 3.978614l-0.308015 0c-21.655206 0-39.162952 17.479093-39.162952 39.021735l0 238.350526c0 ...'/>
            ...
          </svg>`
}
```

你只需要在状态条组件 Status 中把名为 release 的组件替换成上面新实现的 Release，其余地方不用改，示例就能很好的工作了。

```js
// 06-02
Status: {
    css: "#statusbar { height: 2.5em; line-height: 2.5em; text-align: center; }",
    xml: `<ViewStack id='statusbar'>
            <span id='pull'>Pull to refresh...</span>
            <span id='release'>Release to refresh...</span>
            <Release id='loading'>Loading...</Release>
            <span id='success'>Loading success</span>
          </ViewStack>`,
    fun: function (sys, items, opts) {
        var status = "pull";
        function getValue() {
            return status;
        }
        function setValue(value) {
            sys.statusbar.trigger("switch", status = value);
        }
        return Object.defineProperty({}, "value", {get: getValue, set: setValue});
    }
}
```