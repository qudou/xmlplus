xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<h1 id='index'>hello,world</h1>",
            fun: function (sys, items, opts) {
                console.log(sys.index.width());
            }
        }
    });
});
