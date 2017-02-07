xmlplus("xp", function (xp, $_, t) {
    $_().imports({
		Index: {
			xml: "<div id='index'>\
					 <span id='foo'>foo</span>\
					 <span id='bar'>bar</span>\
				  </div>",
			fun: function (sys, items, opts) {
				sys.bar.watch("msg", function(e) {
					console.log(e.target == this, this == sys.foo); // true true
				});
				sys.foo.notify("msg");
			}
		}
    });
});