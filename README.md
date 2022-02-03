# [xmlplus](https://xmlplus.cn) &middot; <a href="https://www.npmjs.com/package/xmlplus"><img src="https://img.shields.io/npm/dt/xmlplus.svg" alt="Downloads"></a> <a href="https://www.npmjs.com/package/xmlplus"><img src="https://img.shields.io/npm/v/xmlplus.svg" alt="Version"></a> <a href="https://www.npmjs.com/package/xmlplus"><img src="https://img.shields.io/npm/l/xmlplus.svg" alt="License"></a>

Xmlplus is a JavaScript framework，It can not only run on the browser-side, but also on the server-side. For more information, see [https://xmlplus.cn](http://xmlplus.cn).

## Installation

If having installed the NPM client, you can install xmlplus with NPM.

```bash
$ npm install xmlplus
```

The following is the basic organizational structure of the project:

```bash
xmlplus/
├── xmlplus.js 
├── patch/
├── docs/
└── example/
    ├── getting-started/
    ├── docs/
    ├── components/
    └── api/
```

Here, the `xmlplus.js` is the source file. Two patch files under the `patch/` are for IE9+. The `docs/` and the `example/` under the `xmlplus/` contain subfolders with the same name.  The `docs/` contains document files and the `example/` contains the corresponding sample code.

## Basic templates

Xmlplus is a framework that can not only run on browser-side but also on server-side. Here we'll give two sets of basic templates for different environments.

### Server-side based

The following is the JavaScript template we fist give to run directly on the server-side. You can modify or extend the functionality based on this. The template is very simple. After installing the xmlplus software package, you just need to create a file containing following content.

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

Having created a file containing the above content, you can execute `node index` to run the above template example.

In addition, please note that a comment line at the beginning of the sample. The line indicate that the current sample code is located at `/example/docs/02-templete/01/`. The `02` here is the chapter order and the `01` is the name of the folder containing the sample.

### Browser-side based

On the browser-side, you need to prepare three files. The first is the `xmlplus.js`. The second you need to create is a file named `index.js` containing following content.

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

At last, you need a HTML file containing following content. Here, we name the file as `index.html`.

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

Ensure that the above three files are in the same folder. If opening the `index.html` with a browser, you should be able to see the red `hello, world`.

## Browser and device support

For the server-side, xmlplus supports all versions of the node.js runtime environment, so here we only to discuss its performance on the browser-side. Xmlplus has the best performance on the latest desktop and mobile browsers. However, on some older browsers it may fail.

### Supported browser

Xmlplus supports mainstream browsers and platforms. On the Windows platform, it supports Internet Explorer 9-11 / Microsoft Edge. Please see the details listed below.

#### Mobile device

In general, xmlplus supports the latest version of the browser for each mainstream platform.

<div class="table-responsive">
<table class="table table-bordered table-striped">
  <thead>
    <tr>
      <td></td>
      <th>Chrome</th>
      <th>Firefox</th>
      <th>Safari</th>
      <th>Android Browser &amp; WebView</th>
      <th>Microsoft Edge</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Android</th>
      <td class="text-success">Supported</td>
      <td class="text-success">Supported</td>
      <td class="text-muted">N/A</td>
      <td class="text-success">Android v4.0+ Supported</td>
      <td class="text-muted">N/A</td>
    </tr>
    <tr>
      <th scope="row">iOS</th>
      <td class="text-success">Supported</td>
      <td class="text-success">Supported</td>
      <td class="text-success">Supported</td>
      <td class="text-muted">N/A</td>
      <td class="text-muted">N/A</td>
    </tr>
    <tr>
      <th scope="row">Windows 10 Mobile</th>
      <td class="text-muted">N/A</td>
      <td class="text-muted">N/A</td>
      <td class="text-muted">N/A</td>
      <td class="text-muted">N/A</td>
      <td class="text-success">Supported</td>
    </tr>
  </tbody>
</table>
</div>

#### Desktop browser

Accordingly, xmlplus also supports most of the latest version of the desktop browser.

<div class="table-responsive">
<table class="table table-bordered table-striped">
  <thead>
    <tr>
      <td></td>
      <th>Chrome</th>
      <th>Firefox</th>
      <th>Internet Explorer</th>
      <th>Microsoft Edge</th>
      <th>Opera</th>
      <th>Safari</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Mac</th>
      <td class="text-success">Supported</td>
      <td class="text-success">Supported</td>
      <td class="text-muted">N/A</td>
      <td class="text-muted">N/A</td>
      <td class="text-success">Supported</td>
      <td class="text-success">Supported</td>
    </tr>
    <tr>
      <th scope="row">Windows</th>
      <td class="text-success">Supported</td>
      <td class="text-success">Supported</td>
      <td class="text-success">Supported, IE9+</td>
      <td class="text-success">Supported</td>
      <td class="text-success">Supported</td>
      <td class="text-danger">Not supported</td>
    </tr>
  </tbody>
</table>
</div>

### Internet Explorer

As we have mentioned above, xmlplus supports Internet Explorer 9-11, but this requires the additional two files: `xpath.js` and `xmldom.js`.

These two files can be found in the `patch/`. That is to say, if you want the application based on xmlplus running on Internet Explorer 9-11, you need to import the following three JavaScript files.

```html
<script src='xpath.js'></script>
<script src='xmldom.js'></script>
<script src='xmlplus.js'></script>
```