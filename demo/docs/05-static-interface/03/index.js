xmlplus("xp", function ( xp, $_, t) {
    $_().imports({
        Index: {
            cfg: { button: { fontSize: 16 } },
            xml: "<div id='index'>\
                      <Button id='foo'/>\
                      <Button id='bar'/>\
                  </div>",
            ali: { button: "//Button" }
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