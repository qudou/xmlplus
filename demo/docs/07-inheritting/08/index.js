xmlplus("xp", function (xp, $_, t) {
    $_().imports({
		Index: {
			xml: "<Button id='index'/>",
			fun: function (sys, items, opts) {
				console.log(items.index);  // { "a": 2, "b": 1, "c": 3 }
			}
		},
		Widget: {
			fun: function (sys, items, opts) {
				return { "a": 0, "b": 1 };
			}
		},
		Button: {
			xml: "<button id='btn'>label</button>",
			map: { extend: {"from": "Widget"} },
			fun: function (sys, items, opts) {
				return { "a": 2, "c": 3 };
			}
		}
    });
});