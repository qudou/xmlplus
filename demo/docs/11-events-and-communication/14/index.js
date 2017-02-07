xmlplus("xp", function (xp, $_, t) {
    $_().imports({
		Index: {
			xml: "<div id='index'>\
					  <Widget id='widget'/>\
				  </div>",
			fun: function (sys, items, opts) {
				sys.index.on("event", function(e) {
					console.log(e.target.elem());
				});
				sys.widget.trigger("event");
			}
		},
		Widget: {}
    });
});