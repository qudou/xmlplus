xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                    <span id='foo'>foo</span>\
                    <button id='bar'>bar</button>\
                  </div>",
            fun: function (sys, items, opts) {
                sys.foo.once("click", () => sys.index.append("Bar"));
            }
        },
        Bar: {
            xml: "<button id='bar'>bar</button>"
        }
    });
});
