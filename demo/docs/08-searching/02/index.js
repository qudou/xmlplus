xmlplus("xp", function (xp, $_, t) {
    $_().imports({
		Index: {
		   xml: "<div id='index'>\
					 <Button>foo</Button>\
					 <Button>bar</Button>\
				 </div>",
		   fun: function (sys, items, opts) {
			   console.log(items("*").length); // 3
			   items("//Button").call("color", "blue");
		   }
		},
		Button: {
			xml: "<button id='button'/>",
			fun: function (sys, items, opts) {
				function color(value) {
					sys.button.css("color", value);
				}
				return { color: color };
			}
		}
    });
});