xmlplus("xp", function (xp, $_, t) {
    $_().imports({
		Index: {
			xml: "<div id='index'>\
					 <span id='foo'>foo</span>\
					 <span id='bar'>bar</span>\
				  </div>",
			fun: function (sys, items, opts) {
				sys.foo.watch("msg", function(e) {
					sys.bar.unwatch("msg");
					console.log(this.text());
				});
				sys.foo.notify("msg").notify("msg");
			}
		}
    });
});