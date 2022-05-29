xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            xml: "<Button fontSize='16'/>"
        },
        Button: {
            opt: { fontSize: 24 },
            xml: "<button id='foo'>hello</button>",
            fun: function (sys, items, opts) {
                sys.foo.css("font-size", opts.fontSize + "px");
            }
        } 
    });
});