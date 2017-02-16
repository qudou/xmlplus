xmlplus("xp", function (xp, $_, t) {
    $_().imports({
		Example: {
		   xml: "<div id='example'>first\
					 <button id='foo'>foo</button>\
					 <button id='bar'>bar</button>last\
				 </div>",
		   fun: function (sys, items, opts) {
			   console.log(sys.foo.next().text());               // bar
			   console.log(sys.example.next());                  // undefined
			   console.log(sys.bar.next(3).text());              // last
		   }
		}
    });
});