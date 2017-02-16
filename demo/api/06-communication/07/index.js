xmlplus("xp", function (xp, $_, t) {
    $_().imports({
		Example: {
			xml: "<span id='example'>foo</span>",
			fun: function (sys, items, opts) {
				sys.example.glance("msg", function(e) {
					console.log(this.text());
				});
				sys.example.notify("msg").notify("msg");
			}
		}
    });
});