xmlplus("xp", function (xp, $_, t) {
    $_().imports({
		Index: {
			xml: "<div id='index'>\
					  <button id='foo'>append</button>\
				  </div>",
			fun: function (sys, items, opts) {
				sys.foo.on( "click", function (e) {
					sys.index.append("Widget");
				});
			}
		},
		Widget: {
			xml: "<button>hello, world</button>"
		}
    });
});