xmlplus("xp", function (xp, $_, t) {
    $_().imports({
		Example: {
			xml: "<div id='example'><span/></div>",
			fun: function (sys, items, opts) {
				console.log(sys.example.toString());         // example
				console.log(sys.example.first().toString()); // 组件对象标识符
			}
		}
    });
});