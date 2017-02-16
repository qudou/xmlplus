xmlplus("xp", function (xp, $_, t) {
    $_().imports({
		Example: {
			xml: "<div id='example'>\
					<Target id='target'/>\
				  </div>",
			fun: function (sys, items, opts) {
				console.log(sys.example.serialize());      // <div><h1>hello, world</h1></div>
				console.log(sys.example.serialize(true));  // <div><Target id='target'/></div>
			}
		},
		Target: {
			xml: "<h1>hello, world</h1>"
		}
    });
});