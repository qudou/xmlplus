xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Example: {
            xml: "<h1 id='example'>hello, world</h1>",
            fun: function (sys, items, opts) {
                console.log(xp.isSystemObject({}));            // false
                console.log(xp.isSystemObject(this));          // true
                console.log(xp.isSystemObject(sys.example));   // true
            }
        }
    });
});