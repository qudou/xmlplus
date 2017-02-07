var app;
xmlplus("xp", function (xp, $_, t) {
	t("default").imports({
		"color": "blue"
	});
	t("green").imports({
		"color": "green"
	});
    $_().imports({
		Index: {
			css: "#index { color: %color; }",
			xml: "<div id='index'>\
					<h1>hello, world</h1>\
					<button id='change'>change</button>\
				  </div>",
			fun: function (sys, items, opts) {
				sys.change.on("click", function (e) {
					app.theme("green");
				});
			}
		}
	});
}).ready(function() {
	app = xp.startup("//xp/Index");
	console.log(app.theme());
});