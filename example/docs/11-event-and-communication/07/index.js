xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<button id='index'>click</button>",
            fun: function (sys, items, opts) {
                this.on("click", function(e) {
                    sys.index.off("click");
                    console.log("hello, world");
                });
            }
        }
    });
});