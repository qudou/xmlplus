xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            cfg: { foo: { fontSize: 16 } },
            xml: "<Button id='foo'/>"
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