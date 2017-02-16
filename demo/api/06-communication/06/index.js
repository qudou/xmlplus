xmlplus("xp", function (xp, $_, t) {
    $_().imports({
		Example: {
			xml: "<span id='example'>foo</span>",
			fun: function (sys, items, opts) {
				sys.example.watch("msg", function(e) {
					sys.example.unwatch("msg");
					console.log(this.text());
				});
				sys.example.notify("msg").notify("msg");
			}
		}
    });
});