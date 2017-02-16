xmlplus("xp", function (xp, $_, t) {
    $_().imports({
		Example: {
			xml: "<input id='example'/>",
			fun: function (sys, items, opts) {
				console.log(sys.example.attr("data"));   // null
				sys.example.attr("data", "hello");
				console.log(sys.example.attr("data"));   // hello
			}
		}
    });
});