# 延迟实例化

## 基本概念

当一个组件对象不需要立即使用时，就可以选择延迟实例化。映射项中的 `defer` 字串用于指明需要延迟实例化的组件。下面的示例中，foo 组件对象和 bar 组件对象都是需要延迟实例化的组件。

```js
Index: {
    xml: "<div>\
             <span id='foo'>foo</span>\
             <span id='bar'>bar</span>\
          </div>",
    map: { defer: "foo bar" }
}
```

对于被指定为延迟实例化的组件对象，如果需要实例化它，可以调用该对象的系统函数 `show` ，该函数和非延迟实例化组件对象的 `show` 函数是不同的，前者用于实例化组件，而后者用于在视图上显示组件对象的内容。在下面示例中，当用户点击按钮 bar 时，foo 组件对象才会被实例化。

```js
Index: {
    xml: "<div>\
             <span id='foo'>foo</span>\
             <button id='bar'>bar</button>\
          </div>",
    map: { defer: "foo" },
    fun: function ( sys, items, opts ) {
        sys.bar.once("click", sys.foo.show);
    }
}
```

请注意上面函数项中，对于 `click` 事件的侦听使用的是 `sys.bar.once` 函数，而不是 `sys.bar.on` 函数。因为如果使用后者，第一次点击按钮时，会成功完成组件对象的实例化，但是如果再次点击时，框架将会抛出错误。这是由于只有当组件对象 foo 未实例化时，函数 `sys.foo.show` 才是可用的。

## 原理

如果一个组件对象被声明为需要延迟实例化，那么系统解析到该组件时，会实例化出一个傀儡组件对象 void ，用以替代原组件对象。void 组件对象包含一系统函数 `show`，此函数用于实例化原组件。此 void 组件对象包含与原组件对象相同的 id 值，所以在父组件中可以直接访问。下面是组件对象 foo 未实例化之前相应的 HTML 代码片断，通过它可以清晰的看到这一点。注意，这里略去了部分的属性值。

```xml
<div>
     <void></void>
     <button>bar</button>
</div> 
```

而下面给出的是 foo 对象实例化后的 HTML 代码片断。可以看出此时 void 消失了，替代它是 span 元素标签。这里同样略去了部分的属性值。

```xml
<div>
     <span>foo</span>
     <button>bar</button>
</div>
```

傀儡组件 void 与其它一些较复杂的组件相比，除了 `show` 函数不同外，该有的系统函数它都有，且功能也一致。只是它是一个空的组件，缺少样式项、函数项等部件。所以它的执行效率高，速度快。用来替代较复杂的，需要延迟实例化的组件再适合不过了。

可以延迟实例化的组件包括两类，一类是匿名空间中的 HTML 元素组件，另一类是自定义组件。其余的包括共享组件、文本、注释以及 CDATASection 描述都是不能延迟实例化的。不过请注意，void 组件对象也是可以延迟实例化的，尽管没多大意义，该组件实际上归类于 HTML 元素组件。

## 应用

应用延迟实例化特性的一个典型例子是 ViewStack 组件。该组件允许包含多个不同视图页面作为子级，其中只有一个页面是可见的。该组件在初始化时，最多只实例化一个可见页面，而其余的页面则在需要时才实例化。该组件可以在单页面应用中作为路由组件使用。下面先来看看 ViewStack 组件的一个应用示例。

```js
Index: {
    xml: "<ViewStack id='stack'>\
             <button id='foo'>to bar</button>\
             <button id='bar'>to foo</button>\
          </ViewStack>",
    map: { defer: "bar" },
    fun: function ( sys, items, opts ) {
        sys.stack.on("click", "button", function(e) {
            items.stack.trigger("switch", this);
        });
    }
}
```
该示例由一个 ViewStack 组件和两个 button 组件组成，button 组件是 ViewStack 组件的子级。该示例允许用户通过点击按钮，在两个页面之间跳转。其中第二个页面被设定为需要延迟实例化，只有当切换到该页面时才进行实例化。下面给出 ViewStack 组件的实现。

```js
ViewStack: { 
	xml: "<div/>",
	fun: function ( sys, items, opts ) {
		var args, children = this.children(),
			table = children.call("hide").hash(),
			ptr = table[opts.index] || children[0];
		if ( ptr ) ptr = ptr.show().trigger("show", null, false);
		this.on("switch", function ( e, to ) {
			table = this.children().hash();
			if ( !table[to] || table[to] == ptr ) return;
			e.stopPropagation();
			args = [].slice.call(arguments).slice(2);
			args.unshift(ptr + '');
			ptr.hide().trigger("hide", to + '', false);
			ptr = table[to].show().trigger("show", args, false);
		});
		return Object.defineProperty({}, "selected", { get: function() {return ptr;}});
	}
}
```

该实现巧妙地利用系统函数 `show`，如果子级组件被设定为延迟实例化，那么只有当切换到此页面时该组件才实例化。对于已经实例化的组件 `show` 函数只是起显示该组件的作用。