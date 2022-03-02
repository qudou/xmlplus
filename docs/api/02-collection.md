# 集合

## call

```js
call(funName[,parameter1][,parameterN])
```

- `funName` : `Function` 调用的函数名
- `parameter1` : `Anything` 给函数提供第一个参数
- `parameterN` : `Anything` 给函数提供第 N 个参数

遍历集合对象，并调用给定的函数，其中函数的参数由函数名的后续实参提供。

```js
// 02-01
Example: {
   xml: "<div id='example'>\
             <h1 id='dog'>dog</h1>\
             <h1 id='cat'>cat</h1>\
         </div>",
   fun: function (sys, items, opts) {
       var kids = sys.example.kids();             // kids 返回的对象为集合对象
       kids.call("css", "border", "1px solid black");
   }
}
```

## hash

```js
hash()
```

- `Returns` : `PlainObject` 包含键值对的普通对象

将类数组形式的集合对象转化包含键值对的普通对象，转换过程可参考下面的函数。

```js
function hash() {
    var i = 0, table = {};
    for ( ; i < this.length; i++ )
        table[this[i]] = this[i];
    return table;
}
```

注：该函数中的 `this` 即包含系统对象的集合。

```js
// 02-02
Example: {
   xml: "<div id='example'>\
             <h1 id='dog'>dog</h1>\
             <h1 id='cat'>cat</h1>\
         </div>",
   fun: function (sys, items, opts) {
       var kids = sys.example.kids();         // 函数 kids 返回系统对象集
       var objects = kids.hash();             // 函数 hash 返回包含键值对集合的普通对象
       for ( var key in objects ) {
           console.log(key);                  // 会依次打印出 dog、cat
       }
   }
}
```

## values

```js
values()
```

- `Returns` : `Collection` // 值对象集

将系统对象的集合转化成值对象的集合。转换过程可参考下面的函数。

```js
function values() {
    var result = new Collection;
    for (var i = 0; i < this.length; i++)
        result.push(this[i].val());
    return result;
}
```

注：该函数中的 `this` 即包含系统对象的集合。

```js
// 02-03
Example: {
   xml: "<div id='example'>\
             <h1 id='dog'>dog</h1>\
             <h1 id='cat'>cat</h1>\
         </div>",
   fun: function (sys, items, opts) {
       var kids = sys.example.kids();
       var objects = kids.values();
       console.log(kids, objects);        // 前者包含的是系统对象集，后者包含的是值对象集
   }
}
```