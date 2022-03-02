# 共享

在有些应用中，要求只能实例化出一个或者若干个特定的组件对象，这会涉及到组件实例的共享问题。在 xmlplus 中，组件的共享与通常的单例概念有相似之处，但比单例有着更为丰富的内容，应注意对比区分。

## 共享一个组件实例

下面的组件 Index 包含两个 Audio 组件，当组件 Index 实例化时，会同时实例化出两个 Audio 组件对象，尽管它们实现了相同的功能。

```js
// 13-01
Index: {
    xml: "<div id='index'>\
             <Audio id='foo'/>\
             <Audio id='bar'/>\
          </div>",
    fun: function (sys, items, opts) {
         console.log(sys.foo == sys.bar);     // false
         console.log(items.foo == items.bar); // false
    }
},
Audio: {
    xml: "<audio autoplay='autoplay'/>",
    fun: function (sys, items, opts) {
        return { desc: "audio desc" };
    }
}
```

若要求组件 Audio 只被实例化一次，则需要在映射项中指定 `share` 选项，以指明组件 Audio 在组件 Index 及其子级中是作为共享组件存在的。该选项的值是一个以零个或多个空格分隔的字符串，每一分隔值是一组件路径，用于指出哪些组件需要被共享。下面的示例中，组件对象 foo 是组件 Audio 实例化的产物，叫做共享组件 Audio 的原实例，而组件对象 bar 则是该实例的一个映像。

```js
// 13-02
Index: {
    xml: "<div id='index'>\
             <Audio id='foo'/>\
             <Audio id='bar'/>\
          </div>",
    map: { share: "Audio" },
    fun: function (sys, items, opts) {
         console.log(sys.foo == sys.bar);     // false
         console.log(items.foo == items.bar); // true
    }
}
```

从上面的打印出的内容可以看出系统对象 `sys.foo` 与 `sys.bar` 是不等的，但值对象 `items.foo` 与 `items.bar` 则同属于一个对象的引用。实际上，对于实例的映像（如上面的组件对象 bar），它是傀儡组件的一个实例，其组件名是 void，它被归类于 HTML 元素组件。傀儡组件对象包含独立的系统接口，但从原实例引用了值对象。也就是说，组件共享只共享值对象，而不共享系统对象，这点一定要注意。

## 共享组件的作用域

组件的共享仅在一定范围内有效。在下面的示例中，Index 组件以一个组件 Audio 和另一个组件 Music 作为其子级。其中，组件 Music 包含一个 Audio 声明，所以这里总共涉及到两个 Audio 组件声明。但在 Index 中，已经声明组件 Audio 是共享的，所以实际上当组件 Index 实例化时，只实例化了一个 Audio 组件。

```js
// 13-03
Index: {
    xml: "<div id='index'>\
             <Audio id='foo'/>\
             <Music id='bar'/>\
          </div>",
    map: { share: "Audio" }
},
Music: {
    xml: "<Audio id='music'/>",
    fun: function (sys, items, opts) {
        return items.music;
    }
}
```

如果在组件 Music 中也加上组件 Audio 的共享声明，结果会是如何呢？这时组件 Music 中的组件对象 Audio 将不会成为组件 Index 中组件对象 foo 的映像，系统将会自行实例化组件 Audio。也就是说，共享组件声明的作用域是可以被子级覆盖的。

```js
// 13-04
Music: {
    xml: "<Audio id='music'/>"
    map: { share: "Audio" }
}
```

## 共享组件的动态添加

在动态添加一个组件时，添加的组件有可能是共享组件。共享组件对象分为原型和映像，所以添加的情形也分为两种。现在以下面的示例来作说明，其中的 Audio 组件与上面的一致，此处略去。

```js
// 13-05
Index: {
    xml: "<div id='index'/>",
    map: { share: "Audio" },
    fun: function (sys, items, opts) {
         var foo = sys.index.append("Audio");
         var bar = sys.index.append("Audio");
         console.log(foo == bar);                 // false
         console.log(foo.val() == bar.val()); // true
    }
}
```

此示例的组件 Index 声明了组件 Audio 为共享组件，并且在函数项中动态实例化了两个 Audio 组件。从输出结果可以看出，通过动态实例化出来的组件对象，其中第一次得到的对象是原型，第二次得到的对象是映像。

## 共享组件的移除

共享组件的移除涉及组件原实例的移除和映像的移除。在下面示例中，函数项调用了组件对象 foo 的移除函数 `remove`，这时连同组件对象 bar 也会从上下文消失。这是因为，对于共享组件而言，当原实例被移除时，其映像也就没有存在的必要了。

```js
// 13-06
Index: {
    xml: "<div id='index'>\
             <Audio id='foo'/>\
             <Audio id='bar'/>\
          </div>",
    map: { share: "Audio" },
    fun: function (sys, items, opts) {
         sys.foo.remove();
         console.log(sys.foo, sys.bar); // undefined undefined
    }
}
```

若只移除共享组件的映像，那么原实例和其他映像还是存在的。在下面示例中，函数项调用了组件对象 bar 的移除函数 `remove`，它只会移除组件对象 bar，而不会影响到原实例 foo 和另一个映像 alice。

```js
// 13-07
Index: {
    xml: "<div id='index'>\
             <Audio id='foo'/>\
             <Audio id='bar'/>\
             <Audio id='alice'/>\
          </div>",
    map: { share: "Audio" },
    fun: function (sys, items, opts) {
         sys.bar.remove();
         console.log(sys.foo, sys.bar, sys.alice); // Object undefined Object
    }
}
```

## 应用

如果你在写 Node.js 应用，那么你可能会涉及到数据库。下面仅以文本型数据库 Sqlite 的使用为例，来看看组件共享特性的应用。

### 封装

要方便使用 Sqlite，首先需要对相关的驱动代码进行抽象，下面是一个实用的组件封装。

```js
Sqlite: {
    fun: function (sys, items, opts) {
        var sqlite = require("sqlite3").verbose(),
        return new sqlite.Database("data.db");
    }
}
```

对于较为复杂的应用，该组件会多次得到使用。如果不使用共享技术，那么该组件就会经过多次实例化，这显然是一种资源浪费。

### 共享

对于这种整个应用只需要一个实例的组件，将共享声明放在入口组件处是最好了。下面给出是一个简单的示范。

```js
Index: {
    xml: "<HTTP id='index'>\
            <Signin id='signin'/>\
            <Logout id='logout'/>\
          </HTTP>
    map: { share: "/db/Sqlite" }
}
```

在此示例中，假定组件 Signin 和 Logout 中都使用了组件 Sqlite，那么组件 Sqlite 仅在组件 Signin 中实例化一次。在组件 Logout 中将会使用共享的实例。