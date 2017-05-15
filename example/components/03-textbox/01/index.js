xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<input id='index' type='text'/>",
            fun: function (sys, items, opts) {
                sys.index.on("input", e => {
                    console.log(sys.index.prop("value"));
                });
            }
        }
    });
});