xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<div id='index'/>",
            fun: function (sys, items, opts) {
                sys.index.bind("hello, world");
            }
        }
    });
});
