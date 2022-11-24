xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                    <span id='foo'>foo</span>\
                    <button id='bar'>bar</button>\
                  </div>",
            map: { defer: "foo" },
            fun: function (sys, items, opts) {
                sys.bar.once("click", sys.foo.show);
            }
        }
    });
});
