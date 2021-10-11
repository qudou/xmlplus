# 安装

如果你已经安装了 npm 客户端，可以通过 npm 安装 xmlplus：

```bash
$ npm install xmlplus
```

或者，你也可以通过 git 和 npm 使用如下的命令来安装：

```bash
$ git clone https://github.com/qudou/xmlplus.git && cd xmlplus && npm install
```

下面给出的是项目的基本组织结构：

```
xmlplus/
├── xmlplus.js
├── patch/
├── docs/
│   ├── getting-started/
│   ├── docs/
│   ├── components/
│   └── api/
└── example/
    ├── getting-started/
    ├── docs/
    ├── components/
    └── api/
```

在根目录 `xmlplus/` 下，`xmlplus.js` 是源文件，`patch/` 下的两个文件是适用于 IE9+ 的补丁文件。目录 `docs/` 和目录 `example/` 包含同名的子级目录。目录 `docs/` 包含框架的文档文件，`example/` 包含与文档相关的配套示例代码。