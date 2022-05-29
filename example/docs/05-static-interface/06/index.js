xmlplus("xp", function ( xp, $_) {
    $_().imports({
        Index: {
            cfg: { foo: { fontSize: 10 }, buttons: { fontSize: 11 } },
            xml: "<Button id='foo' fontSize='12'/>",
            ali: { buttons: "//button" }
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