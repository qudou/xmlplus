xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<a id='link' href='/'>click</a>",
            fun: function (sys, items, opts) {
                sys.link.on("click", function(e) {
                    e.preventDefault();
                });
            }
        }
    });
});