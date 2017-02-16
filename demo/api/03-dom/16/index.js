xmlplus("xp", function (xp, $_, t) {
    $_().imports({
		Example: {
			css: "#doc { border:1px solid black; width:200px; height:200px; overflow:auto; }",
			xml: "<div id='example'>\
					<div id='doc'>\
						This is some text. This is some text. This is some text. This is some text. \
						This is some text. This is some text. This is some text. This is some text. \
						This is some text. This is some text. This is some text. This is some text. \
						This is some text. This is some text. This is some text. This is some text. \
					</div>\
					<button id='getting'>get scrollbar top offset</button>\
					<button id='setting'>set scrollbar top offset to 30px</button>\
				  </div>",
			fun: function (sys, items, opts) {
				sys.getting.on("click", function() {
					console.log(sys.doc.scrollTop());
				});
				sys.setting.on("click", function() {
					sys.doc.scrollTop(30);
				});
			}
		}
    });
});