xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                     <span id='foo'>foo</span>\
                     <span id='bar'>bar</span>\
                     <span id='alice'>alice</span>\
                  </div>",
            fun: function (sys, items, opts) {
                sys.foo.watch("msg", function(e) {
                    console.log("foo");
                    return false;
                });
                sys.bar.watch("msg", function(e) {
                    console.log("bar");
                });
                sys.alice.notify("msg");
            }
        }
    });
});