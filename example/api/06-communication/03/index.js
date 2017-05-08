xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Example: {
            xml: "<button id='example'>click</button>",
            fun: function (sys, items, opts) {
                sys.example.once("click", function (e) {
                    console.log("hello, world");
                });
            }
        }
    });
});