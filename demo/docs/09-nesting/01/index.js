xmlplus("xp", function (xp, $_, t) {
    $_().imports({
		Index: {
			xml: "<div id='index'>\
					  <Widget id='widget'/>\
					  <input type='text'/>\
				  </div>",
			fun: function (sys, items, opts) {
				console.log(items.widget == sys.widget.elem()); // true
			}
		},
		Widget: {
			xml: "<div id='widget'>hello,world</div>",
			fun: function (sys, items, opts) {
				return sys.widget.elem();
			}
		}
    });
});