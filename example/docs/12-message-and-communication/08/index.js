xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                     <span id='foo'>foo</span>\
                     <span id='bar'>bar</span>\
                  </div>",
            fun: function (sys, items, opts) {
				sys.bar.watch("msg", function(e, info) {
					console.log(info);
				});
				sys.foo.notify("msg", "from foo");
				sys.index.notify("msg", "from index");
            }
        },
    });
});