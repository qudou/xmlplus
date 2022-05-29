xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                      <button id='foo'>append</button>\
                  </div>",
            fun: function (sys, items, opts) {
                sys.foo.on("click", function (event) {
                    sys.index.append("Widget", { label: "I'm Button!" });
                });
            }
        },
        Widget: {
            xml: "<button id='widget'>hello, world</button>",
            fun: function (sys, items, opts) {
                sys.widget.text(opts.label);
            }
        }
    });
});