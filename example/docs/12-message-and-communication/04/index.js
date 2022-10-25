xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                     <span id='foo'>foo</span>\
                  </div>",
            fun: function(sys, items, opts) {
                sys.foo.watch("msg", function(e, a, b) {
                    console.log(a, b); // 37 hello,world
                });
                sys.index.notify("msg", [37, "hello,world"]);
            }
        }
    });
});