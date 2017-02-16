xmlplus("xp", function (xp, $_, t) {
    $_().imports({
		Example: {
			xml: "<div id='example'>\
					 <button id='foo'>destory</button>\
					 <h1 id='bar'>Hello, world</h1>\
				  </div>",
			fun: function (sys, items, opts) {
				sys.foo.once("click", sys.bar.remove);
			}
		}
    });
});