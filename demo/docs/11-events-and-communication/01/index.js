xmlplus("xp", function (xp, $_, t) {
    $_().imports({
		Index: {
			xml: "<button id='index'>click</button>",
			fun: function (sys, items, opts) {
				sys.index.on("click", function(e) {
					console.log("hello, world");
				});
			}
		}
    });
});