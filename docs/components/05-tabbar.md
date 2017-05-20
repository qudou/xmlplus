# 选项卡

这一章将设计一个选项卡组件，选项卡组件在手持设备上用的比较多，下面是一个示意图：

<img src="/img/tabbar.png" class="img-responsive"/>

## 选项卡组成

在具体实现之前，想像一下目标组件是如何使用的，对于设计会有莫大的帮助。通过观察，可以将选项卡组件分为容器部分和子项部分，正如下面的 XML 结构所展示的。

```xml
<!-- 05-01 -->
<Tabbar id="tabbar">
    <TabItem id="home" label="首页"/>
    <TabItem id="setting" label="设置"/>
    <TabItem id="logs" label="日志"/>
    <TabItem id="about" label="关于"/>
</Tabbar>
```

现在我们把目光切换到选项卡组件的子项部分，来看看子项部分是如何分解的。通过示意图，你可以发现子项部分可以分解为子项容器以及包含一个图标和一个文本的子级部分。

```xml
<!-- 05-01 -->
<a id="tabitem">
    <Icon id="icon"/>
    <span id="label">首页</span>
</a>
```

所以，现在我们的目标已经很明确了，主要设计三个组件：图标组件 Icon、选项卡组件的子项 TabItem 以及选项卡组件的容器 Tabbar。

##  结构图

由于该组件比较简单，所以可以将三种子组件放置在同一层级。但请注意，我们还有四个图标组件，可以创建一个子级用于容纳它们。下面给出我们的组件结构图：

```
Tabbar/
├── Tabbar
├── TabItem
└── Icon/
     ├── About
     ├── Home
     ├── Logs
     └── Setting
```

## 图标的实现

我们从最简单的开始，先看四个图标组件，图标组件主要通过封装 SVG 文本来实现，由于图标文本较长，所以这里仅截取每个图标文本的一段。

```js
// 05-01
About: {
    xml: `<svg width="48" height="48" viewBox="0 0 1024 1024">
               <path d="M507.577907 23.272727C240.142852..."/>
          </svg>`
},
Home: {
    xml: `<svg width="48" height="48" viewBox="0 0 1024 1024">
               <path d="M949.082218 519.343245 508.704442..."/>
          </svg>`
},
Logs: {
    xml: `<svg width="48" height="48" viewBox="0 0 1024 1024">
               <path d="M576 125.344l32 0 0 64-32 0 0-64Z..."/>
          </svg>`
},
Setting: {
    xml: `<svg width="48" height="48" viewBox="0 0 1024 1024">
               <path d="M512 336.664c-96.68 0-175.336 78...."/>
          </svg>`
}
```

请注意，这些图标位于虚拟目录 `/icon` 之下，也就是你要像下面这样导入：

```
// 05-01
xmlplus("ui", function (xp, $_, t) {
    $_().imports({Tabbar: {... }, TabItem: {...}});

    $_("icon").imports({--这里包含了四个图标组件--});
});
```

下面来实现图标组件 Icon，这里的图标组件与上面是不同的，它会根据输入的图标类型实例化不同的图标。这样设计可以复用部分相同的代码，避免冗余。

```js
// 05-01
Icon: {
    css: "#icon { width: 1.5em; height: 1.5em; display: inline-block; }",
    opt: { icon: "about" },
    xml: `<span id="icon"/>`,
    fun: function (sys, items, opts) {
        sys.icon.replace("icon/" + opts.icon).addClass("#icon");
    }
}
```

该组件的函数项根据输入的图标类型创建图标组件并替换已有的 span 元素对象。注意，替换完后需要重新添加样式。

## 子项的实现

按从内到外的原则，接下来实现选项卡组件的子项 TabItem。对于此组件，需要在组件的映射项中做一次异名的属性映射，把 id 属性值映射给内部的图标组件的 icon 属性。

```js
// 05-01
TabItem: {
    css: `a#tabitem { display: table-cell; overflow: hidden; width: 1%; height: 50px; text-align: center; ... }
          #label { display: block; font-size: .75em; overflow: hidden; text-overflow: ellipsis; -webkit-user-select: none; }
          a#primary { color: #337ab7; fill: currentColor; }`,
    map: {"attrs": { icon: "id->icon" } },
    xml: `<a id="tabitem">
              <Icon id="icon"/>
              <span id="label">首页</span>
          </a>`,
    fun: function (sys, items, opts) {
        sys.label.text(opts.label);
        function select(bool) {
            sys.tabitem[bool ? 'addClass' : 'removeClass']("#primary");
        }
        return Object.defineProperty({}, "selected", { set: select});
    }
}
```

此组件提供了用于选项切换时选中与非选中状态之间切换的接口。以供选项卡容器使用。

## 选项卡的实现

最后来看下选项卡组件 Tabbar 的实现。该组件侦听了用户触击选项卡时的事件，在侦听器里主要做两件事：一是维持选项卡状态的切换；另一是派发一选项卡切换时的状态改变事件。

```
// 05-01
Tabbar: {
    css: `#tabbar { display: table; width: 100%; height: 50px; padding: 0; table-layout: fixed; -webkit-touch-callout: none; }
          #tabbar { z-index: 10; background-color: #f7f7f7; backface-visibility: hidden; }`,
    xml: `<nav id="tabbar"/>`,
    fun: function (sys, items, opts) {
        var sel = this.first();
        this.on("touchend", "./*[@id]", function (e) {
            sel.value().selected = false;
            (sel = this).value().selected = true;
            this.trigger("switch", this.toString());
        });
        if (sel) sel.value().selected = true;
    }
}
```

至此，一个选项卡组件算是完成了，下面来看下具体的一个测试示例。注意，最好在 chrome 浏览器的移动模式下做测试，这样 `touchend` 事件才会生效。

```js
// 05-01
Index: {
    xml: `<Tabbar id="index">
              <TabItem id="home" label="首页"/>
              <TabItem id="setting" label="设置"/>
              <TabItem id="logs" label="日志"/>
              <TabItem id="about" label="关于"/>
          </Tabbar>`,
    fun: function (sys, items, opts) {
        this.on("switch", (e, target) => console.log(target));
    }
}
```

在组件 Index 中，你可以侦听来自选项卡的切换事件来做相应的操作。比如结合后续我们介绍的视图栈组件做页面之间的切换操作。