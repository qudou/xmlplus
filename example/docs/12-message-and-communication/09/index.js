xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
			xml: "<div id='index'>\
					 <Bar id='bar'/>\
				  </div>",
			fun: function (sys, items, opts) {
				sys.index.notify("msg").notify("info");
			}
        },
        Bar: {
			xml: "<span id='bar'>bar</span>",
			map: { msgFilter: /msg/ },
			fun: function (sys, items, opts) {
				sys.bar.watch("msg", function(e) {
					console.log("I can't receive msg!");
				});
				sys.bar.watch("info", function(e) {
					console.log("I can receive info!");
				});
			}
        }
    });
});