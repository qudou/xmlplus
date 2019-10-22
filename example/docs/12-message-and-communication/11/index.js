xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<Foo id='index'>\
                     <span id='bar'>bar</span>\
                  </Foo>",
            fun: function (sys, items, opts) {
                sys.bar.watch("msg", function (e) {
                    console.log("I can't receive message.");
                });
            }
        },
        Foo: {
            xml: "<span id='foo'>foo</span>",
            map: { msgscope: true },
            fun: function (sys, items, opts) {
                sys.foo.notify("msg");
            }
        }
    });
});