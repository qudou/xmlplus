# 下载

## 通过 git 获取源始码

如果你安装了 git 客户端，可以通过 git 获取 xmlplus 的项目文件。

```bash
$ git clone https://github.com/qudou/xmlplus.git
```

下面是项目的基本组织结构：

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

根目录 `xmlplus/` 下的目录 `docs/` 和目录 `demo/` 包含同名的子级目录。目录 `docs/` 包含框架的文档文件，`demo/` 包含与文档相关的配套示例代码。目录 `src/` 包含的是框架源文件 `xmlplus.js` 以及适用于 IE9+ 的补丁文件。不过请注意，这种方式获取到的源码并不包含在服务端运行的两个依赖的软件包。如果你希望获取到完整的可直接使用的软件包，请通过 npm 进行安装。

## 通过 npm 进行安装

如果你已经安装了 npm 客户端，可以通过 npm 安装 xmlplus。

```bash
$ npm install xmlplus
```