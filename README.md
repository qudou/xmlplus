# xmlplus

A powerful, efficient, and flexible JavaScript library for building applicitions, not only user interfaces.

##Installation:

Running in browser. Below is a simple example.

>The content of `index.html`

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

>The content of `index.js`

```javascript
xmlplus("ui", function (xp, $_, t) {
    $_().imports({
        Index: {
            css: "#text { color: red; }",
            xml: "<h1 id='text'>hello, world</h1>",
            fun: function( sys, items, opts ) {
                sys.text.css("font-size", "28px");
            }
        }
    });
});
```

Xmlplus can not only run in browser, but also in server. If you'd like to run in server, just to install with npm.

```bash
npm install xmlplus
```

Here is a server side example.

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