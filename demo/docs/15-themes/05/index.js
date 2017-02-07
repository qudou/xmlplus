xmlplus.expand({
	theme: function (value) {
		return this.env.smr.theme(value);
	}
});

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
				console.log(this.theme());
				sys.change.on("click", function (e) {
					this.theme("green");
				});
			}
		}
	});
});