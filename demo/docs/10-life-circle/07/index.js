xmlplus("xp", function (xp, $_, t) {
    $_().imports({
		Index: {
			xml: "<div id='index'>\
					 <button id='foo'>append</button>\
				  </div>",
			fun: function (sys, items, opts) {
				sys.foo.on("click", function (e) {
					var xml = "<h1 id='text'>Hello, world</h1>";
					sys.index.append(xml);
					sys.text.css("text-decoration", "underline");
				});
			}
		}
    });
});