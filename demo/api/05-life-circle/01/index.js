xmlplus("xp", function (xp, $_, t) {
    $_().imports({
		Example: {
			xml: "<div id='example'>\
					  <button id='foo'>append</button>\
				  </div>",
			fun: function (sys, items, opts) {
				sys.foo.on("click", function (e) {
					sys.example.append("<h1>hello,world</h1>");
				});
			}
		}
    });
});