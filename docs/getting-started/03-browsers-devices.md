# 浏览器和设备的支持情况

对于服务端，xmlplus 支持所有版本的 node.js 运行环境。所以这里只讨论其在浏览器端的表现。

xmlplus 在最新的桌面和移动浏览器上有最佳的表现。然而，在一些较老旧的浏览器上跑 xmlplus 可能会失败。

## 被支持的浏览器

xmlplus 支持主流的浏览器以及平台。在 Windows 平台，其支持 Internet Explorer 9-11 / Microsoft Edge。请看下面列出的详细信息。

### 移动设备

一般而言, xmlplus 支持各个主流平台的最新版本的浏览器。

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
      <td class="text-success">支持</td>
      <td class="text-success">支持</td>
      <td class="text-muted">N/A</td>
      <td class="text-success">Android v4.0+ 支持</td>
      <td class="text-muted">N/A</td>
    </tr>
    <tr>
      <th scope="row">iOS</th>
      <td class="text-success">支持</td>
      <td class="text-success">支持</td>
      <td class="text-success">支持</td>
      <td class="text-muted">N/A</td>
      <td class="text-muted">N/A</td>
    </tr>
    <tr>
      <th scope="row">Windows 10 Mobile</th>
      <td class="text-muted">N/A</td>
      <td class="text-muted">N/A</td>
      <td class="text-muted">N/A</td>
      <td class="text-muted">N/A</td>
      <td class="text-success">支持</td>
    </tr>
  </tbody>
</table>
</div>

### 桌面浏览器

相应的，对于大部分的最新版本的桌面浏览器，xmlplus 也是支持的。

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
      <td class="text-success">支持</td>
      <td class="text-success">支持</td>
      <td class="text-muted">N/A</td>
      <td class="text-muted">N/A</td>
      <td class="text-success">支持</td>
      <td class="text-success">支持</td>
    </tr>
    <tr>
      <th scope="row">Windows</th>
      <td class="text-success">支持</td>
      <td class="text-success">支持</td>
      <td class="text-success">支持, IE9+</td>
      <td class="text-success">支持</td>
      <td class="text-success">支持</td>
      <td class="text-danger">不支持</td>
    </tr>
  </tbody>
</table>
</div>

## Internet Explorer

前面提到 xmlplus 对 Internet Explorer 9-11 提供支持，不过这需要额外引入两个文件，xpath.js 以及 xmldom.js。

这两个文件可在安装包的目录patch中找到。也就是说，如果你想在 Internet Explorer 9-11 中运行基于 xmlplus 的应用，你需要导入三个 js 文件。

```html
<script src='xpath.js'></script>
<script src='xmldom.js'></script>
<script src='xmlplus.js'></script>
```