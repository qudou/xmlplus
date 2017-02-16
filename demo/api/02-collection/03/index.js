xmlplus("xp", function (xp, $_, t) {
    $_().imports({
		Example: {
		   xml: "<div id='example'>\
					 <h1 id='dog'>dog</h1>\
					 <h1 id='cat'>cat</h1>\
				 </div>",
		   fun: function (sys, items, opts) {
			   var children = sys.example.children();
			   var objects = children.values();
			   console.log(children, objects);        // 前者包含的是系统对象集，后者包含的是值对象集
		   }
		}
    });
});