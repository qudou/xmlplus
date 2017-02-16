xmlplus("xp", function (xp, $_, t) {
    $_().imports({
		Example: {
			xml: "<input id='example'/>",
			fun: function (sys, items, opts) {
				sys.example.attr("data", "hello");
				console.log(sys.example.attr("data"));   // hello
				sys.example.removeAttr("data");
				console.log(sys.example.attr("data"));   // null
			}
		}
    });
});