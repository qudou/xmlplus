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

默认情况下，系统中存在一个名为 `default` 的主题，这是一个空的普通的 JSON 对象。当然，你可以覆盖该默认主题。

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

如上的示例中，默认主题 `default` 被新定义的主题覆盖，同时还定义了一个名为 `gray` 的新主题。

## 主题内容的引用

主题内容由样式项引用。样式项通过 `% + 宏名` 引用当前主题中的内容。请看下面的示例。

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

该示例中，由于未定义其他类型的主题，从而当前使用的是名为 `default` 的默认主题。样式项中的字符组 `%color` 最终会被替换成值为 `blue` 的字符串。

## 主题的切换

如果应用定义了多个主题，那么就有在多个主题中切换的需求。请看下面的示例。

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

有一个名为 `theme` 的接口函数，该函数用于返回当前主题或切换当前主题为其它主题。由于主题与具体的应用密切相关，所以你仅能在全局函数 `startup` 的返回值中访问该函数。示例中，不但重新定义了默认主题，还定义了一个名为 `green` 的新主题。当用户点击按钮时，当前主题会由默认主题切换至为新定义的主题。

## 使用扩展的主题接口

由于主题仅存在于应用，所以上面的主题切换函数仅由应用返回，这样会在使用上带来诸多的不便。下面给出一个扩展，让该函数附加到系统对象接口上。

```js
// 15-05
xmlplus.expand({
    theme: function (value) {
        return this.env.smr.theme(value);
    }
});
```

下面使用扩展的主题接口重新修改上一节的示例如下。该示例直接上面新定义的扩展函数来切换主题。

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

在系统中定义扩展接口，可以更为便捷地使用主题切换函数，但它会轻微地加大系统的资源开销。如果不能带来明显的好处，建议不要随意扩展系统接口函数。