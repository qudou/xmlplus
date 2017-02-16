xmlplus("xp", function (xp, $_, t) {
    $_().imports({
		Example: {
			xml: "<input id='example'/>",
			fun: function (sys, items, opts) {
				sys.example.prop("data", "hello,world");
				console.log(sys.example.prop("data"));   // hello,world
				sys.example.removeProp("data");
				console.log(sys.example.prop("data"));   // undefined
			}
		}
    });
});