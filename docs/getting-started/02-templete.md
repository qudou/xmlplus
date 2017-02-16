# 基本模板

由于 xmlplus 是一个可以在浏览器端和服务端运行框架，所以这里将给出两套基本模板，分别对应两端的运行环境。

## 在服务端运行

下面首先给出的是能够在服务端直接运行的 JS 模版，你可以在此基础上修正或者扩展相关功能。

假定你已经通过 npm 安装了 xmlplus 软件包，那么服务端的模板非常简单，仅需包含有如下内容的一个文件就可以了。

```js
xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            fun: function( sys, items, opts ) {
				console.log("hello, world");
            }
        }
    });
}).startup("xp/Index");
```

## 在浏览器端运行

在浏览器端，你需要准备三个文件，其中第一个是从你已经下载好的 xmlplus 软件包中的 xmlplus.js 文件。另外你需要创建一个名为 index.js 的文件，该文件包含如下内容。

```js
xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            css: "#text { color: red; }",
            xml: "<h1 id='text'>hello, world</h1>",
            fun: function (sys, items, opts) {
                sys.text.css("font-size", "28px");
            }
        }
    });
});
```

除此以外，你还需要一个 html 文件，该文件包含的内容如下，且命名该文件为 index.html。

```html
<!DOCTYPE html>
<html>
    <head>
        <script src="xmlplus.js"></script>
        <script src="index.js"></script>
    </head>
    <body>
        <i:Index xmlns:i="xp"></i:Index>
    </body>
</html>
```

确保上述的三个文件位于同一个目录，通过一个尽可能先进点浏览器打开 index.html，你应该可以看到红色的 `hello, world!` 了。