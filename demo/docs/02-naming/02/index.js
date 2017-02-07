xmlplus("xp", function (xp, $_, t) {
    $_().imports({
		Index: {
		   css: "#animal h1 { background: green; }",
		   xml: "<div id='animal'>\
					 <h1 id='dog'>dog</h1>\
					 <h1 id='cat'>cat</h1>\
				 </div>"
		}
    });
});