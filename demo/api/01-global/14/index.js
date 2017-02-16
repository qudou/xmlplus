xp.expand({
	sayHello: function () {
		console.log("hello");
	}
});

xmlplus("xp", function (xp, $_, t) {
    $_().imports({
		Example: {
			xml: "<div id='example'/>",
			fun: function (sys, items, opts) {
				sys.example.sayHello();
			}
		}
    });
});