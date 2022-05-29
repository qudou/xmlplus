xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            xml: "<button id='index'>click</button>",
            fun: function (sys, items, opts) {
                sys.index.on("click", function (e) {
                    sys.index.off("click");
                    console.log("hello, world");
                });
            }
        }
    });
});