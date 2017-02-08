xmlplus("xp", function (xp, $_, t) {
    $_().imports({
		Index: {
			xml: "<div id='index'>\
					  <button id='foo'>before</button>\
				  </div>",
			fun: function (sys, items, opts) {
				sys.foo.on("click", function (event) {
					sys.foo.before("Widget");
				});
			}
		},
		Widget: {
			xml: "<button>hello, world</button>"
		}
    });
});