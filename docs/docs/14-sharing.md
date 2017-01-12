# 共享

有些场合，要求在一个应用中只能实例化出一个或者若干个特定的组件对象，这就涉及到组件实例的共享问题。这里的共享与通常单例的概念有相似之处，但比单例有着更为丰富的内容，请注意比对区分。

## 共享一个组件实例

下面的`Index`组件包含两个`Audio`组件，当`Index`组件实例化时，会同时实例化出两个`Audio`组件对象，尽管它们实现相同了的功能。

```js
Index: {
    xml: "<div>\
             <Audio id='foo'/>\
             <Audio id='bar'/>\
          </div>",
    fun: function ( sys, items, opts ) {
         console.log(sys.foo == sys.bar);     // false
         console.log(items.foo == items.bar); // false
    }
},
Audio: {
    xml: "<audio id='audio' autoplay='autoplay'/>",
    fun: function ( sys, items, opts ) {
         function play(file) {
             sys.audio.prop("src", file);
         }
         return { play: play };
    }
}
```

若要求`Audio`组件只被实例化一次，则需要在映射项中指定`share`选项，以指明`Audio`组件在`Index`组件及其子级中是作为共享组件存在的。`share`项是一个字符串，它指出哪些组件需要被共享。下面的示例中，`foo`对象是`Audio`组件实例化的产物，叫做共享组件`Audio`的原实例，而`bar`对象则作为该实例的一个映像。

```js
Index: {
    xml: "<div>\
             <Audio id='foo'/>\
             <Audio id='bar'/>\
          </div>",
    map: { share: "Audio" },
    fun: function(sys, items, opts) {
         console.log(sys.foo == sys.bar);     // false
         console.log(items.foo == items.bar); // true
    }
}
```

从上面的打印出的内容可以看出`sys.foo`与`sys.bar`是不等的，但`items.foo`与`items.bar`同属于一个对象引用。实际上，对于实例的映像（如上面的`bar`对象），它是一个傀儡组件`void`的实例化，它包含了独立的系统接口，但从原实例引用了自定义接口对象。也就是说，组件共享只共享自定义接口对象，而不共享系统接口对象，这点一定要注意。

## 共享组件的作用域

组件的共享有它的作用域。在下面的示例中，`Index`组件以一个组件`Audio`和另一个组件`Group`作为其子级，而组件`Group`包含两个`Audio`声明，所以总共涉及到三个`Audio`组件声明。但在`Index`中，已经声明`Audio`是共享的，所以实际上当`Index`组件实例化时，只实例化了一个`Audio`组件。

```js
Index: {
    xml: "<div>\
             <Audio id='foo'/>\
             <Group id='bar'/>\
          </div>",
    map: { share: "Audio" }
},
Group: {
    xml: "<div>\
             <Audio id='foo'/>\
             <Audio id='bar'/>\
          </div>"
}
```

如果在Group组件中也加上`Audio`组件的共享声明，结果会是如何呢？这时`Group`中的`Audio`将不再成为`Index`中`Audio`对象`foo`的映像，在`Group`中，系统将会实例化第一个`Audio`组件，而第二个`Audio`组件对象则成为第一个`Audio`组件对象的一个映像。也就是说，共享声明的作用域是允许被子级覆盖的。

```js
Group: {
    xml: "<div>\
             <Audio id='foo'/>\
             <Audio id='bar'/>\
          </div>",
    map: { share: "Audio" }
}
```

## 共享组件的动态添加

在动态添加一个组件时，添加的组件有可能是共享组件。共享组件对象分为原型和映像，所以添加的情形也分为两种。现在以下面的示例来作说明，其中的`Audio`组件与上面的一致，此处略去。

```js
Index: {
    xml: "<div id='top'/>",
    map: { share: "Audio" },
    fun: function ( sys, items, opts ) {
         var foo = sys.top.append("./Audio");
         var bar = sys.top.append("./Audio");
         console.log(foo == bar, foo.value() == bar.value()); // false, true
    }
}
```

此示例的`Index`组件首先声明组件`Audio`为共享组件，然后在函数项中连续实例化了两个`Audio`组件。其中，第一次实例化出来的对象是原型，第二次得到的对象是映像。

## 共享组件的移除

共享组件的移除涉及组件原实例的移除和映像的移除。在下面示例中，函数项调用了对象`foo`的移除函数`remove`，这时连同对象bar也会从上下文消失。这是因为，对于共享组件而言，当原实例被移除时，其映像也就没有存在的必要了。

```js
Index: {
    xml: "<div>\
             <Audio id='foo'/>\
             <Audio id='bar'/>\
          </div>",
    map: { share: "Audio" },
    fun: function ( sys, items, opts ) {
         sys.foo.remove();
         console.log(sys.foo, sys.bar); // undefined, undefined
    }
}
```

若只移除共享组件的映像，那么原实例和其他映像还是存在的。在下面示例中，函数项调用了对象`bar`的移除函数`remove`，它只会移除`bar`对象，而不会影响到原实例`foo`和另一个映像`alice`。

```js
Index: {
    xml: "<div>\
             <Audio id='foo'/>\
             <Audio id='bar'/>\
             <Audio id='alice'/>\
          </div>",
    map: { share: "Audio" },
    fun: function ( sys, items, opts ) {
         sys.bar.remove();
         console.log(sys.foo, sys.bar, sys.alice); // Object, undefined, Object
    }
}
```