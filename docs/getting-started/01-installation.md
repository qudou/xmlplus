# 安装

如果你已经安装了 npm 客户端，可以通过 npm 安装 xmlplus。

```bash
$ npm install xmlplus
```

下面是项目的基本组织结构：

```
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

根目录 `xmlplus/` 下的目录 `docs/` 和目录 `demo/` 包含同名的子级目录。目录 `docs/` 包含框架的文档文件，`demo/` 包含与文档相关的配套示例代码。目录 `src/` 包含的是框架源文件 `xmlplus.js` 以及适用于 IE9+ 的补丁文件。