# xmlplus

A powerful, efficient, and flexible JavaScript library for building applicitions, not only user interfaces.

##Installation:

Running in browser. Here is a simple example. For details, see [hello-world-client](docs/demo/hello-world/client).

```html
<!DOCTYPE html>
<html>
    <head>
    <script src="xmlplus.js"></script>
    <script src="index.js"></script>
    </head>
    <body>
		<i:Index xmlns:i="ui"></i:Index>
    </body>
</html>
```

Xmlplus can not only run in browser, but also in server. If you'd like to run in server, just to install with npm.

```bash
npm install xmlplus
```

Here is a server side example. For details, see [hello-world-server](docs/demo/hello-world/server).

```javascript
xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            fun: function( sys, items, opts ) {
                console.log("hello, world!")
            }
        }
    });
}).startup("xp/Index");
```

## License

Licensed under the [MIT](http://opensource.org/licenses/MIT) License;

Copyright (C) 2017 Qudou. All Rights Reserved.
