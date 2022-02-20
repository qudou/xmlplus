# 数据绑定

## bind

```js
bind(target)
```

- `target` : `String | Number | Boolean | Object | Array` 被绑定的数据
- `Returns` : `Proxy` 数据绑定后的代理对象

该函数用于将一个组件对象与一个数据对象绑定。更多内容请参考 [数据绑定](/docs#数据绑定)。

```js
// 07-01
Example: {
    xml: "<div id='example'>\
            <input type='radio' name='n' value='USA'/>\
            <input type='radio' name='n' value='China'/>\
            <select id='select'>\
                <option>USA</option>\
                <option>China</option>\
            </select>\
          </div>",
    ali: {country: "//input | //select", },
    fun: function (sys, items, opts) {
        this.bind({country: "China"});
    }
}
```