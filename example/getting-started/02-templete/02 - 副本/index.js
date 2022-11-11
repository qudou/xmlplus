xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            css: "#text { color: red; }",
            xml: "<h1 id='text'>\
			        <button id='btn'>hello</button>\
			      </h1>",
            fun: function (sys, items, opts) {
				sys.text.on("look", () => {
					console.log("weoox");
				});
                sys.btn.on("click", () => {
					sys.btn.trigger("look");
				});
            }
        }
    });
});