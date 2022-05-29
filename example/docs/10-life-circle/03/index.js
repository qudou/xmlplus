xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                      <button id='foo'>before</button>\
                  </div>",
            fun: function (sys, items, opts) {
                sys.foo.on("click", function (e) {
                    sys.foo.before("Widget");
                });
            }
        },
        Widget: {
            xml: "<button>hello, world</button>"
        }
    });
});