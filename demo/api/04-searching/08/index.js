xmlplus("xp", function (xp, $_, t) {
    $_().imports({
		Example: {
		   xml: "<div id='example'>first\
					 <button id='foo'>foo</button>\
					 <button id='bar'>bar</button>last\
				 </div>",
		   fun: function (sys, items, opts) {
			   console.log(sys.bar.prev().text());               // foo
			   console.log(sys.example.prev());                  // undefined
			   console.log(sys.foo.prev(3).text());              // first
		   }
		}
    });
});