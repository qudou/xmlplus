xmlplus("xp", function (xp, $_, t) {
    $_().imports({
		Index: {
			xml: "<div id='index'>\
					  <button id='foo'>append</button>\
				  </div>",
			fun: function ( sys, items, opts ) {
				sys.foo.on( "click", function (e) {
					sys.index.append("./Widget"); // 注意：这里需要明确给出组件所在的路径
				});
			}
		},
		Widget: {
			xml: "<button>hello, world</button>"
		}
    });
});