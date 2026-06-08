# 数据绑定

所谓数据绑定，是指将 JSON 格式的数据对象与相应的组件对象进行绑定，并返回一个代理，之后通过代理操作数据即可间接地操作组件对象。

## 数据绑定的三种类型

根据绑定数据类型的不同，可分为三种情况讨论：

一、绑定的数据类型是字面量 `String | Number | Boolean`

下面示例中，由 `div` 元素创建的组件对象 `index` 通过函数接口 `bind` 绑定了一个字符串：`"hello, world"`。

```js
// 13-01
Index: {
    xml: "<div id='index'/>",
    fun: function (sys, items, opts) {
        sys.index.bind("hello, world");
    }
}
```

注意，只有 HTML 元素创建的组件对象才可以绑定字面量。系统禁止自定义组件对象绑定字面量。

二、绑定的数据类型是普通对象

类型为普通对象的数据只能与自定义组件对象相绑定，下面是一个简单的示例：

```js
// 13-02
Index: {
    xml: "<input id='index' type='text'/>",
    fun: function (sys, items, opts) {
        this.bind({index: "hello, world"});
    }
}
```

该示例中，绑定数据包含一个键为 `index`，值为 `"hello, world"` 的键值对。所以，若想成功绑定，被绑定的组件对象中必需有个称作 `index` 的命名对象。注意，这里的被绑定对象是 `this`，与前一个示例有所不同。该示例中的键值对绑定的是个体对象，当然也可以是集体对象，请看下面的示例：

```js
// 13-03
Index: {
    xml: "<div id='index'>\
            <input id='text1' type='text'/>\
            <input id='text2' type='text'/>\
          </div>",
    ali: {text: "//input"},
    fun: function (sys, items, opts) {
        this.bind({text: "hello, world"});
    }
}
```

此示例中的键值对绑定的是集体对象 `text`，它包含了 `text1` 和 `text2` 两个组件对象。

下面我们来个更复杂的例子，绑定的数据对象包含两个键值对，每个键值对各绑定两个组件对象。

```js
// 13-04
Index: {
    xml: "<div id='index'>\
            <input type='text'/>\
            <input type='text'/>\
            <input type='radio' name='n' value='USA'/>\
            <input type='radio' name='n' value='China'/>\
          </div>",
    ali: {text: "//input[@type='text']", radio: "//input[@type='radio']", },
    fun: function (sys, items, opts) {
        this.bind({text: "hello, world", radio: "China"});
    }
}
```

三、绑定的数据类型是数组

数组可以与 HTML 元素对象或者自定义组件绑定。作为被绑定的组件对象成为数组的渲染器。当执行绑定后，系统会为数组中的每一个子项数据生成一个与渲染器类型相同的组件对象，并将相应的子项数据与该对象绑定。请看下面的示例：

```js
// 13-05
Index: {
    xml: "<div id='index'>\
            <input id='text' type='text'/>\
          </div>",
    fun: function (sys, items, opts) {
        sys.text.bind([1,2,3,4]);
    }
}
```

该示例中，名为 `text` 的组件对象绑定了数组 `[1,2,3,4]`。绑定后，系统会生成 4 个组件对象并将数组中的数据依次赋值给它们。

数组中的元素除了可以为字面量，还可以是普通对象，这将形成递归绑定。请参考下面的示例：

```js
// 13-06
Index: {
    xml: "<div id='index'>\
            <Input id='text' type='text'/>\
          </div>",
    fun: function (sys, items, opts) {
        sys.text.bind([{foo: 1},{foo: 2}]);
    }
},
Input {
    xml: "<input id='foo' type='text'/>"
}
```

最后，请注意根节点不允许绑定数组，否则系统会报错。

## 空绑定

当一个普通对象与一个自定义组件对象绑定时，普通对象的子项存在空绑的情形。请看下面的示例：

```js
// 13-07
Index: {
    xml: "<input id='index' type='text'/>",
    fun: function (sys, items, opts) {
        let proxy = this.bind({label: "hello, world"});
		console.log(proxy.label.value);
		proxy.label.value = "hi, world";
		console.log(proxy.label.value);
    }
}
```

空绑定意味着没有与普通对象的键名一致的组件对象。空绑定也会生成一个代理对象，同时也可以对代理对象进行相应的取值与赋值操作。

## 代理对象的使用

根据绑定数据的不同类型，代理对象也分三种。

一、字面量代理对象

当绑定的数据是字面量时。返回的结果即为字面量代理对象。请看下面的示例：

```js
// 13-08
Index: {
    xml: "<input id='index' type='text'/>",
    fun: function (sys, items, opts) {
        window.proxy = sys.index.bind("hello, world");
    }
}
```

此示例对 `index` 对象绑定了某字符串，现在我们通过控制台操作它。

```js
proxy.value                    // 获取文本框的内容
proxy.value = "hello, welcome" // 重置文本框的内容
delete proxy.value             // 试图删除文本框
```

对于删除这个操作，个人感觉有点多余，就不提供了。重要的是，如果实现了它，后面的数据导出功能将要有多余的情况要考虑，所以还是放弃了。

二、普通代理对象

当绑定的数据是普通对象时。返回的结果即为普通代理对象。请看下面的示例：

```js
// 13-09
Index: {
    xml: "<div id='index'>\
	        <input id='text' type='text'/>\
		  </div>",
    fun: function (sys, items, opts) {
        window.proxy = this.bind({text: "hello, world"});
    }
}
```

此示例对 Index 组件对象绑定了一个普通对象，现在我们通过控制台操作它。

```js
proxy.text.value               // 获取文本框的内容
proxy.text.value = "hi, world" // 改变文本框的内容
delete proxy.text              // 删除文本框
proxy.text                     // 代理 text 已移除，不可用
```

请注意，普通代理对象没有 value 属性值，只有字面量代理对象才有。

三、数组代理对象

当绑定的数据是数组时。返回的结果即为数组代理对象。请看下面的示例：

```js
// 13-10
Index: {
    xml: "<div id='index'>\
            <input id='text' type='text'/>\
          </div>",
    fun: function (sys, items, opts) {
        window.proxy = sys.text.bind([1,2,3,4]);
    }
}
```

现在我们依次执行赋值、push、pop 等操作，看会发生什么。

```js
proxy[2] = 9    // 数组值变为 [1,2,9,4]，同时第3个文本框的值变为 9
proxy.pop()     // 数组值变为 [1,2,9]，返回值 "4"，第4个文本框消失
proxy.push(5)   // 数组值变为 [1,2,9,5]，新增一个文本框，其内容为 5
proxy = [3,6,8] // 数组值变为 [3,6,8], 原来的所有文本宽被删除，新增 3 个文本框
```

请注意，与普通代理对象类似，数组代理对象没有 value 属性值，只有字面量代理对象才有。

## 与取值与赋值相关的事件

系统对于被绑定的 HTML 元素对象，有默认的取值与赋值操作。当然，你有机会在赋值之前与取值之后修正或者覆盖默认的操作。请看下面的示例：

```js
// 13-11
Index: {
	xml: "<input id='index' type='text' data-dispatch-event='true'/>"
	fun: function (sys, items, opts) {
		this.on("$/before/setting", (e, data) => {
		    e.stopPropagation();
			data.value = "#" + data.value;
		});
		this.on("$/after/getting", (e, data) => {
			e.stopPropagation();
			data.value = data.value.substr(1);
		});
		window.proxy = sys.index.bind("haha");
	}
}
```

当我们在被绑定的 HTML 元素对象中设置属性 `data-dispatch-event` 的值为 `true` 时，`bind` 函数会在赋值之前派发 `$/before/setting` 事件，并且在取值之后派发 `$/after/getting` 事件。

此例在赋值之前会给数据值添加首字符 `'#'`。而在取值之后会先删除掉首字符 `'#'` 再返回。

注意，只有对 HTML 元素对象配置 `data-dispatch-event` 属性才有效，这个操作对自定义的组件对象是多余的。

## 数据导出

接上面的示例我们知道，通过函数 `bind` 返回的是代理对象。但我们通常需要返回普通的 JSON 对象值，这可以通过全局函数 `proxyToJSON` 函数实现。

```js
proxyToJSON(object)
```

- `object` : `Proxy` 代理对象
- `Returns` : `PlainObject` 转化得到的普通对象

此函数将数据绑定后得到的代理对象转化成普通的 JSON 对象。对于绑定的数据，导出的对象与它具有相同的结构。

```html
// 13-12
Index: {
	xml: "<div id='index'>\
			<button id='item'/>\
		  </div>",
	fun: function (sys, items, opts) {
		let data = [1,2,3,4];
		let proxy = sys.item.bind(data);
		console.log(xp.proxyToJSON(proxy));  // [1,2,3,4]
	}
}
```