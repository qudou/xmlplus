xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            xml: "<Input id='index' type='text'/>",
            fun: function (sys, items, opts) {
                sys.index.bind("hello, world");
            }
        },
        Input: {
			map: { bind: {model: "foo"} },
            xml: "<input id='foo' type='text'/>"
        }
    });
});
