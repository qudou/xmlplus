xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            css: "#text { color: red; }",
            xml: "<h1 id='text'>hello, world</h1>",
            fun: function (sys, items, opts) {
                sys.text.css("font-size", "28px");
            }
        }
    });
});