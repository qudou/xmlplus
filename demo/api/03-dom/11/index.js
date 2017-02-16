xmlplus("xp", function (xp, $_, t) {
    $_().imports({
		Example: {
			xml: "<div id='example'>\
					 <h1 id='hello'>hello, world</h1>\
					 <button id='button'>hide</button>\
				  </div>",
			fun: function (sys, items, opts) {
				sys.button.once("click", sys.hello.hide);
			}
		}
    });
});