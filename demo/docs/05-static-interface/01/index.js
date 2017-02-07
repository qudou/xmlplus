xmlplus("xp", function ( xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<Button id='index'/>"
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