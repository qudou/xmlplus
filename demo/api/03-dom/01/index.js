xmlplus("xp", function (xp, $_, t) {
    $_().imports({
		Example: {
			xml: "<h1 id='example'>hello</h1>",
			fun: function (sys, items, opts) {
				console.log(sys.example.text());  // hello
				sys.example.text("world");
				console.log(sys.example.text());  // world
			}
		}
    });
});