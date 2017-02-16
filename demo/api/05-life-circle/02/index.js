xmlplus("xp", function (xp, $_, t) {
    $_().imports({
		Example: {
			xml: "<div id='example'>\
					  <button id='foo'>before</button>\
				  </div>",
			fun: function (sys, items, opts) {
				sys.foo.on("click", function (event) {
					sys.foo.before("<h1>hello,world</h1>");
				});
			}
		}
    });
});