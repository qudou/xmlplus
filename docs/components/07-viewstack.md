# 路由

在浏览器端，对路由的理解一般是根据不同的 URL 完成页面的切换。在服务器端，则是根据不同的 URL 请求回馈相关的页面。在本章，我们广义的组件路由的定义：根据接收到的不同命令，组件对象呈现出不同的子级页面。在这里将介绍与路由相关的一个组件，即视图栈 ViewStack。

## 视图栈初步

该组件在[《文档》](http://xmlplus.cn/docs)部分的最后一个章节[《延迟实例化》](http://xmlplus.cn/docs#延迟实例化)已经出现过了。这里将对一些细节部分进行解读。下面再次给出该组件的源码。

```js
// 07-01
ViewStack: { 
    xml: "<div id='viewstack'/>",
    fun: function (sys, items, opts) {
        var args, children = this.children(),
            table = children.call("hide").hash(),
            ptr = table[opts.index] || children[0];
        if (ptr) ptr = ptr.trigger("show").show();
        this.on("switch", function ( e, to ) {
            table = this.children().hash();
            if ( !table[to] || table[to] == ptr ) return;
            e.stopPropagation();
            args = [].slice.call(arguments).slice(2);
            ptr.trigger("hide", [to+''].concat(args)).hide();
            ptr = table[to].trigger("show", [ptr+''].concat(args)).show();
        });
        return Object.defineProperty({}, "selected", { get: function() {return ptr;}});
    }
}
```

从静态接口看，该组件允许提供静态参数 `index`，该参数是组件 ViewStack 某一儿子组件对象的名称，它用于指出哪一个子级组件会被最先呈现。请看下面的示例。

```js
// 07-01
Index: {
    xml: `<ViewStack index='bar'>
              <button id='foo'>foo</button>
              <button id='bar'>bar</button>
          </ViewStack>`
}
```

该示例中，ViewStack 包含一值为 `bar` 的属性 `index`，表明组件在实例化时，组件对象 bar 会最先呈现。而默认情况下，该组件的第一个子级组件会作为初始显示对象。再从动态接口看，该组件的函数项导出了一个名为 `selected` 的只读属性，该属性用于指示当前显示的子级组件对象。

## 通过事件切换目标组件对象

对于子级组件对象之间切换，该组件的函数项并未导出相关的接口，而是通过接收 `switch` 事件来完成切换。请看下面的示例。

```js
// 07-02
Index: {
    xml: `<ViewStack id='index'>
             <button id='foo'>foo</button>
             <button id='bar'>bar</button>
          </ViewStack>`,
    fun: function (sys, items, opts) {
        sys.index.on("click", "*", function(e) {
            var to = this + '' == "foo" ? "bar" : "foo",
                data = "hello, world";
            this.trigger("switch", [to, data]);
        });
        sys.foo.on("show", function (e, prev, data) {
            console.log("previous page is " + prev, "from data is " + data);
        });
        sys.bar.on("hide", function (e, prev, data) {
            console.log("previous page is " + prev, "from data is " + data);
        });
    }
}
```

对于该示例，当用户点击文字时，文字会在 foo 和 bar 之间切换，也即两个页面之间切换，切换是通过相应子级对象派发 `switch` 事件进行的。另外，组件 ViewStack 在切换页面时，还会对本次显示的页面派发事件 `show`，以及对本次隐藏的页面派发事件 `hide`，相关页面可以根据需要选择侦听与否。并且在侦听函数中，可以获知前一显示页面 `ID` 以及所传输的相关数据。

## 动态添加与移除子级对象

组件 ViewStack 支持动态添加与移除子级的组件对象，请看下面的一个示例。

```js
// 07-03
Index: {
    xml: `<ViewStack id='index'>
             <button id='foo'>foo</button>
          </ViewStack>`,
    fun: function (sys, items, opts) {
        sys.foo.on("click", function () {
            var xml = "<button id='bar'>bar</button>";
            sys.index.append(xml).trigger("switch", "bar");
        });
    }
}
```

该示例中，当用户点击按钮 foo 应用会动态添加了一个子级组件，并且通过派发事件 `switch` 将当前显示的视图切换为刚新添加的视图。

## 优化配置

组件 ViewStack 一般配合组件的延迟实例化功能使用。对于一些比较复杂的组件，这样有助于加快显示应用的初始页面。下面做简单示范。

```js
// 07-04
Index: {
    xml: `<ViewStack id='index'>
             <button id='foo'>foo</button>
             <button id='bar'>bar</button>
          </ViewStack>`,
	map: { defer: "bar" },
    fun: function (sys, items, opts) {
        sys.foo.on("click", function () {
            sys.index.trigger("switch", "bar");
        });
    }
}
```

此示例中，ViewStack 子级包含三个子组件，其中组件对象 bar 被设置为需要延迟实例化，只有当视图切换在组件对象 bar 时，它才真正开始实例化。

## 与 HTML5 History API 的配合使用

这里我们看看如何让组件 ViewStack 与 HTML5 History API 的配合使用。下面是一个简单的例子。

```js
// 07-05
Index: {
    xml: "<ViewStack id='index'>\
             <button id='foo'>foo</button>\
             <button id='bar'>bar</button>\
          </ViewStack>",
    fun: function (sys, items, opts) {
        sys.index.on("show", "button", function (e) { 
            window.history.pushState({name: this + ""}, null, "/" + this);
        });
        window.addEventListener("popstate", function (e) {
            e.state && sys.index.trigger("switch", e.state.name);
        });
        sys.foo.on("click", e => sys.foo.trigger("switch", "bar"));
        sys.bar.on("click", e => sys.foo.trigger("switch", "foo"));
    }
}
```

该示例的关键点在于，当视图栈组件对象的子级页面发生变更时，使用函数 pushState 记录下来；另外需要侦听浏览器的 popstate 事件，当用户点击「前进」、「后退」按钮时，完成相应页面的切换。这种技术非常适合在单页应用中完成无刷新跳转，可以给用户带来非常好的体验。