xmlplus("xp", function (xp, $_, t) {
    $_().imports({
		Example: {
			xml: "<button id='example'>click</button>",
			fun: function (sys, items, opts) {
				sys.example.on("click", function (e) {
					sys.example.off("click");
					console.log("hello, world");
				});
			}
		}
    });
});