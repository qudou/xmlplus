xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                     <Foo id='foo'/>\
                     <span id='bar'>bar</span>\
                  </div>",
            fun: function (sys, items, opts) {
                sys.foo.watch("msg", function(e) {
                    console.log("I can receive message.");
                });
                sys.bar.watch("msg", function(e) {
                    console.log("I can't receive message.");
                });
                sys.foo.notify("msg");
            }
        },
        Foo: {
            xml: "<span id='foo'>foo</span>",
            map: { msgscope: true },
            fun: function (sys, items, opts) {
                sys.foo.watch("msg", function(e) {
                    console.log("I can receive message too.");
                });
            }
        }
    });
});