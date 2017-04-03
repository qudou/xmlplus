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

## License

Licensed under the [MIT](http://opensource.org/licenses/MIT) License;

Copyright (C) 2017 Qudou. All Rights Reserved.