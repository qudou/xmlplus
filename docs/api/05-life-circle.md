# 生命周期

与组件生命周期相关的 API 在文档的相关章节有详细介绍，这里仅给出个概要。更多内容请参考 [生命周期](/docs#生命周期)。

## append

```js
append(target[,options])
```

- `target` : `XMLElement | SystemObject | String` 用于追加的内容
- `options` : `PlainObject` 为追加的新组件对象提供的初始化参数
- `Returns` : `SystemObject` 追加的新系统对象

该函数用于追加一个组件对象到当前对象子级。其中可选的 `options` 参数用于给被追加的对象提供初始化参数，该参数仅当新对象为非基组件并且非已存在组件对象时才有效。更多内容请参考 [组件对象的追加](/docs#生命周期_组件对象的追加)。

```js
// 05-01
Example: {
    xml: "<div id='example'>\
              <button id='foo'>append</button>\
          </div>",
    fun: function (sys, items, opts) {
        sys.foo.on("click", function (e) {
            sys.example.append("<h1>hello,world</h1>");
        });
    }
}
```

## before

```js
before(target[,options])
```

- `target` : `XMLElement | SystemObject | String` 用于插入的内容
- `options` : `PlainObject` 为插入的新组件对象提供的初始化参数
- `Returns` : `SystemObject` 插入的新系统对象

该函数用于在当前对象之前插入一个组件对象。其中可选的 `options` 参数用于给被插入的对象提供初始化参数，该参数仅当新对象为非基组件并且非已存在组件对象时才有效。更多内容请参考 [组件对象的插入](/docs#生命周期_组件对象的插入)。

```js
// 05-02
Example: {
    xml: "<div id='example'>\
              <button id='foo'>before</button>\
          </div>",
    fun: function (sys, items, opts) {
        sys.foo.on("click", function (e) {
            sys.foo.before("<h1>hello,world</h1>");
        });
    }
}
```

## replace

```js
replace(target[,options])
```

- `target` : `XMLElement | SystemObject | String` 用于替换的内容
- `options` : `PlainObject` 为新组件对象提供的初始化参数
- `Returns` : `SystemObject` 替换后的新系统对象

该函数用于替换当前组件对象为一个新的组件对象。其中可选的 `options` 参数用于新对象提供初始化参数，该参数仅当新对象为非基组件并且非已存在组件对象时才有效。更多内容请参考 [组件对象的替换](/docs#生命周期_组件对象的替换)。

```js
// 05-03
Example: {
    xml: "<div id='example'>\
              <button id='foo'>replace</button>\
          </div>",
    fun: function (sys, items, opts) {
        sys.foo.once("click", function (e) {
            sys.foo.replace("<h1>hello,world</h1>");
        });
    }
}
```

## remove

```js
remove()
```

该函数用于移除当前组件对象。更多内容请参考 [组件对象的移除](/docs#生命周期_组件对象的移除)。

```js
// 05-04
Example: {
    xml: "<div id='example'>\
             <button id='foo'>destory</button>\
             <h1 id='bar'>Hello, world</h1>\
          </div>",
    fun: function (sys, items, opts) {
        sys.foo.once("click", sys.bar.remove);
    }
}
```