xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<Input id='index' type='text'/>",
            fun: function (sys, items, opts) {
                sys.index.bind("hello, world");
            }
        },
        Input: {
            xml: "<input id='index' type='text'/>"
        }
    });
});
