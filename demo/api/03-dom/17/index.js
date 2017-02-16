xmlplus("xp", function (xp, $_, t) {
    $_().imports({
		Example: {
			css: "#doc { border:1px solid black; width:100px; height:130px; overflow:auto }",
			xml: "<div id='example'>\
					<div id='doc'>\
						The longest word in the english dictionary is: pneumonoultramicroscopicsilicovolcanoconiosis. \
					</div>\
					<button id='getting'>get scrollbar left offset</button>\
					<button id='setting'>set scrollbar left offset to 30px</button>\
				  </div>",
			fun: function (sys, items, opts) {
				sys.getting.on("click", function() {
					console.log(sys.doc.scrollLeft());
				});
				sys.setting.on("click", function() {
					sys.doc.scrollLeft(30);
				});
			}
		}
    });
});