# 主题

## 定义

主题是样式项中的一种字符串替换机制，它与宏的概念类似。下面结合示例，来看看如何定义一个主题。

```js
// 15-01
xmlplus("xp", function (xp, $_, t) {
    t("gray").imports({
        "color": "gray"
    });
});
```

示例中，定义了一个名为 `gray` 的主题。该主题是一个普通的 JSON 对象，包含一个键值对，其中键名为 `color`，值为 `gray`，这里的键名也叫宏名。

默认情况下，系统中存在一个主题名为 `default`，这是一个空的普通的 JSON 对象。当然，你可以覆盖该主题。

```js
// 15-02
xmlplus("xp", function (xp, $_, t) {
    t("default").imports({
        "color": "black"
    });
    t("gray").imports({
        "color": "gray"
    });
});
```

该示例中，默认主题 `default` 被覆盖，同时还定义了一个新的主题 `gray`。

## 引用主题内容

主题应用于样式项中，它通过 `% + 宏名` 引用当前主题中的内容。请看下面的示例。

```js
// 15-03
xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            css: "#index { color: %color; }",
            xml: "<h1 id='index'>hello, world</h1>"
        }
    });
    t("default").imports({
        "color": "blue"
    });
});
```

该示例中，由于当前的主题为 `default`，所以样式项中的 `%color` 最终会被替换成 `blue`。

## 主题的切换

由于应用中可能存在多个主题，所以有在多个主题中切换的需求。请看下面的示例。

```js
// 15-04
var app;
xmlplus("xp", function (xp, $_, t) {
    t("default").imports({
        "color": "blue"
    });
    t("green").imports({
        "color": "green"
    });
    $_().imports({
        Index: {
            css: "#index { color: %color; }",
            xml: "<div id='index'>\
                    <h1>hello, world</h1>\
                    <button id='change'>change</button>\
                  </div>",
            fun: function (sys, items, opts) {
                sys.change.on("click", function (e) {
                    app.theme("green");
                });
            }
        }
    });
}).ready(function() {
    app = xp.startup("//xp/Index");
    console.log(app.theme());
});
```

主题 API `theme` 仅存在于应用，所以你仅能在全局函数 `startup` 的返回值中访问该函数。该函数用于返回或切换当前的主题。示例中，存在两个主题，默认为 `default`，当用户点击按钮时，主题会切换为 `green`。

## 使用扩展的主题接口

由于主题仅存在于应用，所以上面的主题切换函数仅由应用返回，下面给出一个扩展，让该 API 附加到系统对象接口上。

```js
// 15-05
xmlplus.expand({
    theme: function (value) {
        return this.env.smr.theme(value);
    }
});
```

下面使用扩展的主题接口重新修改上一节的示例如下。该示例直接使用系统对象接口提供的函数 `theme` 来切换主题。

```js
// 15-05
xmlplus("xp", function (xp, $_, t) {
    t("default").imports({
        "color": "blue"
    });
    t("green").imports({
        "color": "green"
    });
    $_().imports({
        Index: {
            css: "#index { color: %color; }",
            xml: "<div id='index'>\
                    <h1>hello, world</h1>\
                    <button id='change'>change</button>\
                  </div>",
            fun: function (sys, items, opts) {
                console.log(this.theme());
                sys.change.on("click", function (e) {
                    this.theme("green");
                });
            }
        }
    });
});
```

使用扩展的主题接口可能会更方便些，因为这样就无需要访问由 `startup` 返回的系统对象，但它会轻微地加大系统的资源开销。