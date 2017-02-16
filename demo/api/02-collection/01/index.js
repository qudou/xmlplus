xmlplus("xp", function (xp, $_, t) {
    $_().imports({
		Example: {
		   xml: "<div id='example'>\
					 <h1 id='dog'>dog</h1>\
					 <h1 id='cat'>cat</h1>\
				 </div>",
		   fun: function (sys, items, opts) {
			   var children = sys.example.children(); // children 返回的对象为集合对象
			   children.call("css", "border", "1px solid black");
		   }
		}
    });
});