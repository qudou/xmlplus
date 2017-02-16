# 路由

路由，你可以理解为组件集在显示与隐藏之间的切换。在这里将介绍与路由相关的两个组件，它们分别是视图栈 ViewStack 和 图片轮播框 GallerySlider。其中后者将涉及到动画。

## 视图栈 ViewStack

该组件在《文档》部分的最后一个章节《延迟实例化》已经出现过了。这里将对一些细节部分进行解读。下面再次给出该组件的源码。

```js
ViewStack: { 
	xml: "<div id='viewstack'/>",
	fun: function ( sys, items, opts ) {
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
Example1: {
	xml: "<ViewStack index='bar' xmlns:i='/buttons/bootstrap'>\
			 <i:Button id='foo'>foo</i:Button>\
			 <i:Button id='bar'>bar</i:Button>\
		  </ViewStack>"
}
```

该示例中，ViewStack 包含一值为 `bar` 的属性 `index`，表明组件在实例化时，组件对象 bar 会最先呈现。而默认情况下，该组件的第一个子级组件会作为初始显示对象。

再从动态接口看，该组件的函数项导出了一个名为 `selected` 的只读属性，该属性用于指示当前显示的子级组件对象。

对于子级组件对象之间切换，该组件的函数项并未导出相关的接口，而是通过接收 `switch` 事件来切换的。请看下面的示例。

```js
Example2: {
    xml: "<ViewStack id='viewstack' xmlns:i='/buttons/bootstrap'>\
             <i:Button id='foo'>foo</i:Button>\
             <i:Button id='bar'>bar</i:Button>\
          </ViewStack>"
    fun: function ( sys, items, opts ) {
        sys.viewstack.on("click", "*", function(e) {
			var to = this + '' == "foo" ? "bar" : "foo",
				data = "hello, world";
            this.trigger("switch", [to, data]);
        });
		sys.foo.on("show", function ( e, prev, data ) {
			console.log("previous page is " + prev, "from data is " + data);
		});
		sys.bar.on("hide", function ( e, prev, data ) {
			console.log("previous page is " + prev, "from data is " + data);
		});
    }
}
```

对于该示例，当用户点击文字时，文字会在 foo 和 bar 之间切换，也即两个页面之间切换，切换是通过相应子级对象派发 `switch` 事件进行的。

另外，组件 ViewStack 在切换页面时，还会对本次显示的页面派发事件 `show`，以及对本次隐藏的页面派发事件 `hide`，相关页面可以根据需要选择侦听与否。并且在侦听函数中，可以获知前一显示页面以及所传输的相关数据。

另外，该组件支持动态添加与移除子级的组件对象，请看下面的一个示例。

```js
Example3: {
    xml: "<ViewStack id='viewstack' xmlns:i='/buttons/bootstrap'>\
             <i:Button id='foo'>foo</i:Button>\
          </ViewStack>"
    fun: function ( sys, items, opts ) {
		var xml = "<i:Button id='bar'>bar</i:Button>";
        sys.viewstack.append(xml).trigger("switch", "bar");
    }
}
```

该示例中，函数项中动态添加了一个子级组件，并且通过派发事件 `switch` 将当前显示的视图切换为刚新添加的视图。

组件 ViewStack 一般配合组件的延迟实例化功能使用。对于一些比较复杂的组件，这样有助于显示加快应用的初始页面。下面仅简单作示范。

```js
Example4: {
    xml: "<ViewStack xmlns:i='/buttons/bootstrap'>\
             <i:Button id='foo'>foo</i:Button>\
             <i:Button id='bar'>bar</i:Button>\
             <i:Button id='alice'>alice</i:Button>\
          </ViewStack>"
	map: { defer: "bar alice" }
}
```

此示例中，ViewStack 子级包含三个子组件，其中组件对象 bar 和 alice 被设置为需要延迟实例化，只有当这两组件对象的 `show` 函数得到调用时，它们才真正开始实例化。

## 轮播框 GallerySlider

这里将基于上面的组件 ViewStack，并应用 CSS3 的动画技术设计一个轮播框组件。该组件继承了组件 ViewStack 的所有功能，并支持子级组件轮播功能。下面先给出该组件的应用示例。

```js
Example: {
    xml: "<GallerySlider duration='1500'>\
			<h1 id='a'>hello, world</h1>\
			<h1 id='b'>happy, new year</h1>\
			<h1 id='c'>good, morning</h1>\
          </GallerySlider>"
}
```

该组件初始化完成后每隔 1500ms 便切换一次页面，切换效果为页面从右到左滑动。期中静态参数 `duration` 用于控制页面切换的时间间隔。下面给出该轮播框组件的代码。

```js
GallerySlider: {
	css: "#viewstack { position: relative; }\
		  #viewstack > * { position: absolute; width: 100%; height: 100%; transition: transform 1000ms; }\
		  #to-left { transform: translate3d(-100%, 0, 0); } #on-right { transform: translate3d(100%, 0, 0); }",
	map: { extend: { "from": "../viewstack/ViewStack" } },
	fun: function ( sys, items, opts ) {
		var self = this;
		this.on("hide", function (e) {
			e.target.addClass("#to-left",self).once("transitionEnd", e.target.hide).emptySystemCall();
		});
		this.on("show", function (e) {
			e.target.addClass("#on-right",self).show().removeClass("#to-left #on-right",self)
			e.target.once("transitionEnd", next);
		});
		function next() {
			var curr = self.value().selected,
				target = curr && (curr.next() || self.first());
			setTimeout(function () {
				if (target) curr.trigger("switch", target);
			}, opts.duration);
		}
		setTimeout(next, opts.duration);
	}
}
```

为了清晰起见，该组件在样式项中忽略了相关的兼容性代码，详情需要查看配套源码。

该组件继承自组件 ViewStack，在函数项中，侦听了事件 `hide` 和 `show`。在事件 `hide` 的回调函数中，调用函数 `emptySystemCall` 阻止了组件 ViewStack 中的后续函数 `hide` 的调用。从而改变了 `hide` 函数的调用时机。两个回调函数内部均侦听了动画终止函数 `transitionEnd`，前者用于隐藏组件对象，后者用于寻找下一个需要显示的对象，一旦找到，则在等待相应的时间间隔之后，开启下一次页面切换。

注意，该组件必需要在支持 CSS3 的浏览器中才能正常运转。然而按照相同的思路，使用 jquery 技术一样可以写出来，读者不妨动手试试。