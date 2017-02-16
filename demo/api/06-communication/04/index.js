xmlplus("xp", function (xp, $_, t) {
    $_().imports({
		Example: {
			xml: "<div id='example'>\
					 <span id='span'>trigger</span>\
				  </div>",
			fun: function (sys, items, opts) {
				sys.example.on("event", function(e) {
					console.log("hello, world");
				});
				sys.span.trigger("event");
			}
		}
    });
});