xmlplus("xp", function (xp, $_, t) {
    $_().imports({
		Example: {
		   xml: "<div id='example'>\
					 <button id='foo'>foo</button>\
					 <button id='bar'>bar</button>\
				 </div>",
		   fun: function (sys, items, opts) {
			   console.log(sys.example.children().length); // 2
		   }
		}
    });
});