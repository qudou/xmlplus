xmlplus("xp", function (xp, $_, t) {
    $_().imports({
		Example: {
			css: "#klass { color: blue; }",
			xml: "<div id='example'>\
					<Widget id='widget'/>\
					<h1 id='text'>hello, world</h1>\
				  </div>",
			fun: function (sys, items, opts) {
				sys.text.addClass("#klass");                // 引用的是当前组件的 klass
			}
		},
		Widget: {
			css: "#klass { color: red; }",
			xml: "<h1 id='widget'>hello, world</h1>",
			fun: function (sys, items, opts) {
				sys.widget.addClass("#klass", this);        // 引用的是组件 Example 的 klass
			}
		}
    });
});