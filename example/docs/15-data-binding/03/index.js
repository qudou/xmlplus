xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            xml: "<Input id='index' type='text'/>",
            map: {bind: {model: {skey: "foo"}}},
            fun: function (sys, items, opts) {
                sys.index.bind("hello, world");
            }
        },
        Input: {
            xml: "<input id='foo' type='text'/>"
        }
    });
});
