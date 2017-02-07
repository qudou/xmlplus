xmlplus("xp", function (xp, $_, t) {
    $_().imports({
		Index: {
			css: "#index { color: %color; }",
			xml: "<h1 id='index'>hello, world</h1>"
		}
	});
	t("default").imports({
		"color": "blue"
	});
});