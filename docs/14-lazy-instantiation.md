# 延迟实例化

---

## 基本概念

当一个组件对象不需要立即使用时，就可以选择延迟实例化。映射项中指定的`defer`列表项指明了需要延迟实例化的组件。下面的示例中，`foo`对象和`bar`对象都是需要延迟实例化的组件。

```js
Index: {
    xml: "<div>\
             <span id='foo'>foo</span>\
             <span id='bar'>bar</span>\
          </div>",
    map: { defer: ["foo","bar"] }
}
```

对于延迟实例化的组件，如果需要实例化它，可以调用该对象的系统函数`show`，该函数和非延迟实例化组件的`show`函数是不同，前者用于实例化组件，而后者用于在视图上显示组件对象的内容。下面的`foo`对象，只有当第一次点击按钮`bar`时它才会被实例化。后面如果再点击按钮，那就是调用实例化后组件对象的`show`函数了。

```js
Index: {
    xml: "<div>\
             <span id='foo'>foo</span>\
             <button id='bar'>bar</button>\
          </div>",
    map: { defer: ["foo"] },
    fun: function(sys, items, opts) {
        sys.bar.on("click", sys.foo.show);
    }
}
```

## 原理

如果一个组件被声明成需要延迟实例化，那么系统在初次解析该组件时，会先实例化一个傀儡组件`void`，用以替代原组件。void组件包含一系统函数`show`，此函数用于实例化原组件。void包含与原组件相同的id值，所以在父组件中可以直接访问`void`对象。通过下面未实例化的`foo`对象相应的`html`代码片断，可以清晰的看到这一点。这里略去了部分的属性值。

```xml
<div>
     <void></void>
     <button>bar</button>
</div> 
```

下面给出的是`foo`对象实例化后的`html`代码片断。可以看出此时`void`消失了，替代它是`span`元素标签。这里同样略去了部分的属性值。

```xml
<div>
     <span>foo</span>
     <button>bar</button>
</div>
```

对于傀儡组件`void`，它与其它组件除了`show`函数不同外，该有的系统函数它都有，功能也一样。只是它是一个空的组件，没有样式项、函数项等部件。所以相对于复杂组件来说，它的执行效率高，速度快。用来替代复杂的，需要延迟实例化的组件再适合不过了。

可以延迟实例化的组件包括两类，一类是匿名空间中的`HTML`元素组件，另一类是自定义组件。其余的包括傀儡组件`void`、共享组件、文本、注释以及`CDATASection`描述都是不允许延迟实例化的。

## ViewStack组件

ViewStack组件可以包含多个不同视图页面作为子级，其中只有一个页面是可见的。该组件在初始化时，可以只实例化一个可见页面，而其余的页面则在需要时才实例化。下面先来看看`ViewStack`组件的一个使用示例。

```js
Index: {
    xml: "<ViewStack id='stack'>\
             <button id='foo'>to bar</button>\
             <button id='bar'>to foo</button>\
          </ViewStack>",
    map: { defer: ["bar"] },
    fun: function(sys, items, opts) {
        sys.stack.on("click", "button", function(e) {
            var target = e.target.text().slice(3);
            items.stack.switchTo(target);
        });
    }
}
```
该示例由一个`ViewStack`组件和两个`button`组件组成，`button`组件是`ViewStack`组件的子级。用户点击按钮可以在两个按钮之间或者说两个页面之间跳转。其中第二个按钮被设定为需要延迟实例化，只有当切换到该按钮页面时才进行实例化。下面给出ViewStack组件的实现。

```js
ViewStack: {
    xml: "<div id='viewstack'></div>",
    fun: function ( sys, items, opts ) {
        var children = this.children();
        var ptr = toIndex(opts.index || 0);
        if ( ptr != -1 ) {
            children.except(ptr).call("hide");
            children[ptr].show();
        }
        function switchTo( key ) {
            var i = toIndex(key);
            if ( i != -1 && i != ptr ) {
                children[ptr].hide();
                children[ptr = i].show();
            }
        }
        function toIndex( k ) {
            return typeof k == 'number' && 0 <= k && k < children.length ? k : -1;
        }
        return { switchTo: switchTo };
    }
}
```

该实现巧妙地利用系统函数`show`，如果子级组件被设定为延迟实例化，那么只有当切换到此页面时该组件才实例化。对于已经实例化的组件`show`函数只是起显示该组件的作用。