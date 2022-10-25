xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                     <span id='foo'>foo</span>\
                  </div>",
            fun: function (sys, items, opts) {
                sys.foo.watch("msg", function(e) {
                    console.log(e.currentTarget == sys.foo); // true
                });
                sys.index.notify("msg");
            }
        }
    });
});