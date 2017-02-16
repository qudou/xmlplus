xmlplus("xp", function (xp, $_, t) {
    $_().imports({
		Example: {
		   xml: "<div id='example'>\
					 <button>foo</button>\
					 <button>bar</button>\
				 </div>",
		   fun: function (sys, items, opts) {
			   console.log(sys("//*").length); // 3
			   sys("//button").call("css", "color", "blue");
		   }
		}
    });
});