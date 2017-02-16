xmlplus("xp", function (xp, $_, t) {
    $_().imports({
		Example: {
			xml: "<div id='example'>\
					  <button id='foo'>replace</button>\
				  </div>",
			fun: function (sys, items, opts) {
				sys.foo.once("click", function (e) {
					sys.foo.replace("<h1>hello,world</h1>");
				});
			}
		}
    });
});