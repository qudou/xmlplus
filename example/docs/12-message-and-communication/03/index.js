xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                     <span id='foo'>foo</span>\
                     <span id='bar'>bar</span>\
                  </div>",
            fun: function (sys, items, opts) {
                sys.bar.watch("msg", function(e) {
                    console.log(sys.bar == e.currentTarget); // true
                });
                sys.foo.notify("msg");
            }
        }
    });
});