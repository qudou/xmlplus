# [xmlplus](http://xmlplus.cn)

xmlplus is a JavaScript framework，It can not only run in the browser side, but also in the server side. For more information, see [http://xmlplus.net](http://xmlplus.net).

## Download

### Get source code by Git

If you install the GIT client, through the GIT can get xmlplus project file.

```bash
$ git clone https://github.com/qudou/xmlplus.git
```

The following is the basic organizational structure of the project:

```bash
xmlplus/
├── docs/
│   ├── getting-started/
│   ├── docs/
│   ├── components/
│   └── api/
├── demo/
│   ├── getting-started/
│   ├── docs/
│   ├── components/
│   └── api/
└── src/
    ├── xmlplus.js
    └── patch/
```

The directories, `docs/` and `xmlplus/` under the `demo/`, contain the same name sub directories. The `docs/` contains the document files, and the `demo/` contains the corresponding supporting sample code. The directory `src/` contains the frame source file `xmlplus.js` and the patch files for IE9+.

Note, however, that the source code obtained in this way does not contain two dependent packages that allow the project to run on the server side. You can locate the root directory of the project, and get the two dependent packages through the following command.

```bash
$ npm install
```

### Install via NPM

If you have installed the NPM client, you can install NPM via xmlplus.

[![NPM](https://nodei.co/npm/xmlplus.png?downloads=true&start=true)](https://nodei.co/npm/xmlplus/)

## Basic templates

Xmlplus is the framework which can not only run in browser but also in server, so here we'll give two sets of basic templates corresponding to both ends of the operating environment respectively.

### Running in server

The following is the JavaScript template that we fist give to be able to run directly in the server. You can modify or extend the functionality based on this. The server's template is very simple, if you have installed the xmlplus software package, just need to include a file as follows.

```js
// 02-01
xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            fun: function (sys, items, opts) {
                console.log("hello, world");
            }
        }
    });
}).startup("//xp/Index");
```

Now assume that there is a file containing the above content, the name is `index.js`, then you can execute the command `node index` in the Node.js environment to run the above template example.

In addition, please note that a comment at the beginning of the sample. Through the comment content, you can locate the software package `demo/docs/02-templete/01/` to get the source code. The `02` in the comment is the chapter order, `01` is the name of the directory containing the sample. The following example contains a similar comment, which is consistent with the content here.

### Running in browser

On the browser side, you need to prepare three files, the first of which is the `xmlplus.js` file that you have downloaded. In addition, you need to create a file named `index.js`, which contains the following.

```js
// 02-02
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

In addition, you also need a HTML file that contains the following. Here, we named the file `index.html`.

```html
<!-- 02-02 -->
<!DOCTYPE html>
<html>
    <head>
        <script src="xmlplus.js"></script>
        <script src="index.js"></script>
    </head>
    <body>
        <i:Index xmlns:i="//xp"></i:Index>
    </body>
</html>
```

Ensure that the above three files are in the same directory. Open the `index.html` by the browser, you should be able to see the red `hello, world`.

## License

Licensed under the [MIT](http://opensource.org/licenses/MIT) License;

Copyright (C) 2017 Qudou. All Rights Reserved.