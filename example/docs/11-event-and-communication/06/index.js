xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            xml: "<button id='index'>click</button>",
            fun: function (sys, items, opts) {
                sys.index.once("click", function (e) {
                    console.log("hello, world");
                });
            }
        }
    });
});