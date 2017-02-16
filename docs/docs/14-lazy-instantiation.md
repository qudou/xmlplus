# 延迟实例化

延迟实例化是 xmlplus 中最有用的特性之一，尤其在单页应用中，它能明显地提升用户体验性。

## 基本概念

当一个组件对象不需要立即使用时，就可以选择延迟实例化。映射项中的 `defer` 选项用于指明需要延迟实例化的组件对象。该选项的值是一个以零个或多个空格分隔的字符串，每一分隔值是一组件对象名。下面的示例中，组件对象 foo 和组件对象 bar 都是需要延迟实例化的组件。

```js
// 14-01
Index: {
    xml: "<div id='index'>\
             <span id='foo'>foo</span>\
             <span id='bar'>bar</span>\
          </div>",
    map: { defer: "foo bar" }
}
```

对于被指定为延迟实例化的组件对象，如果需要实例化它，可以调用该对象的系统函数 `show` ，该函数和非延迟实例化组件对象的函数 `show` 是不同的，前者用于实例化组件，而后者用于显示组件对象的内容。在下面示例中，当用户点击按钮 bar 时，组件对象 foo 才会被实例化。

```js
// 14-02
Index: {
    xml: "<div id='index'>\
             <span id='foo'>foo</span>\
             <button id='bar'>bar</button>\
          </div>",
    map: { defer: "foo" },
    fun: function (sys, items, opts) {
        sys.bar.once("click", sys.foo.show);
    }
}
```

请注意上面函数项中，对于 `click` 事件的侦听使用的是函数 `once`，而不是 `on`。因为若使用后者，首次点击按钮时，会成功完成组件对象的实例化，但若再次点击，系统就会抛出错误。这是由于仅当组件对象 foo 未实例化时，系统函数 `sys.foo.show` 才是可用的。 

## 原理

对于被声明为需要延迟实例化的组件对象，当系统解析到该组件时，会实例化出一个傀儡组件对象以替代原组件对象。傀儡组件的组件名是 `void`，它被归类于 HTML 元素组件。该对象包含的系统函数 `show` 用于实例化原组件。傀儡组件对象与原组件对象有相同的 id 值，所以在函数项中可以对其直接访问。下面给出的是组件对象 foo 未实例化之前对应的 HTML 代码片断，可以清楚地看到傀儡组件标签 void。注意，这里略去了部分的属性值。

```xml
<div>
     <void></void>
     <button>bar</button>
</div> 
```

而下面给出的是组件对象 foo 实例化后的 HTML 代码片断。可以看出此时 void 元素标签不见了，替代它是 span 元素标签。这里同样略去了部分的属性值。

```xml
<div>
     <span>foo</span>
     <button>bar</button>
</div>
```

傀儡组件与其它一些较复杂的组件相比，除了系统函数 `show` 的功能差异外，该有的系统函数它都有，且功能也一致。只是它是一个空的组件，缺少样式项、函数项等部件。所以它的执行效率高，速度快。用来替代较复杂的，需要延迟实例化的组件对象再适合不过了。

可以延迟实例化的组件对象分为两类，一类是匿名空间中的 HTML 元素组件对象，另一类是自定义组件对象。其余的包括共享组件对象、文本对象、注释对象以及 CDATASection 对象都是不能延迟实例化的。不过请注意，由于 void 元素被归类为 HTML 元素，所以 void 元素对象也是可以延迟实例化的，尽管没多大意义。

## 应用

应用延迟实例化特性的一个典型例子是路由组件 ViewStack。该组件允许包含多个不同视图页面作为子级，其中只有一个页面是可见的。该组件在初始化时，最多只实例化一个可见页面，而其余的页面则在需要时才实例化。该组件可以在单页面应用中作为路由组件使用。下面先来看看 ViewStack 组件的一个应用示例。

```js
// 14-03
Index: {
    xml: "<ViewStack id='index'>\
             <button id='foo'>to bar</button>\
             <button id='bar'>to foo</button>\
          </ViewStack>",
    map: { defer: "bar" },
    fun: function (sys, items, opts) {
        sys.index.on("click", "button", function(e) {
            this.trigger("switch", this.text().substr(3));
        });
    }
}
```
该示例由一个 ViewStack 组件和两个 button 组件组成，button 组件是 ViewStack 组件的子级。该示例允许用户通过点击按钮，在两个页面之间跳转。其中第二个页面被设定为需要延迟实例化，只有当切换到该页面时才进行实例化。下面给出 ViewStack 组件的实现。

```js
// 14-03
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
            if(ptr) ptr.trigger("hide", [to+''].concat(args)).hide();
            ptr = table[to].trigger("show", [ptr+''].concat(args)).show();
        });
        return Object.defineProperty({}, "selected", { get: function() {return ptr;}});
    }
}
```

该实现巧妙地利用系统函数 `show`，如果子级组件对象被设定为延迟实例化，那么只有当切换到此页面时该组件对象才实例化。对于已经实例化的组件对象，系统函数 `show` 只是起到显示该组件的作用。如果希望对该组件有更多的了解，请访问 [视图栈 ViewStack](/components#路由.视图栈 ViewStack)