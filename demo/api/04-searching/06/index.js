xmlplus("xp", function (xp, $_, t) {
    $_().imports({
		Example: {
		   xml: "<div id='example'>first\
					 <button id='foo'>foo</button>\
					 <button id='bar'>bar</button>last\
				 </div>",
		   fun: function (sys, items, opts) {
			   console.log(sys.example.last().text());   // bar
			   console.log(sys.example.last(3).text());  // last
		   }
		}
    });
});