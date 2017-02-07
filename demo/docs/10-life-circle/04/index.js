xmlplus("xp", function (xp, $_, t) {
    $_().imports({
		Index: {
			xml: "<div id='index'>\
					 <button id='foo'>replace</button>\
				  </div>",
			fun: function ( sys, items, opts ) {
				sys.foo.once("click", function (e) {
					sys.foo.replace("<h1>Hello, world</h1>");
				});
			}
		}
    });
});