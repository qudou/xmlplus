# xmlplus

A powerful, efficient, and flexible JavaScript library for building applicitions, not only user interfaces.

##Installation:

Running in browser. Here is a simple example.

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

The file `index.js` contains the description of the component `Index`.

```javascript
xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            fun: function( sys, items, opts ) {
                console.log("hello, world!")
            }
        }
    });
});
```

Xmlplus can not only run in browser side, but also in server side. If you'd like to run in server, just to install with npm.

```bash
npm install xmlplus
```

Here is a server side example.

```javascript
var xmlplus = require("xmlplus");
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
