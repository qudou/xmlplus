xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                     <span id='foo'>foo</span>\
                     <span id='bar'>bar</span>\
                  </div>",
            fun: function(sys, items, opts) {
                sys.bar.watch("msg", function(e, a, b) {
                    console.log(a, b); // 37 hello,world
                });
                sys.foo.notify("msg", [37, "hello,world"]);
            }
        }
    });
});