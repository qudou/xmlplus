xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Example: {
            css: "#example { position: relative; }",
            xml: "<div id='example'>\
                    <p id='text'>hello,world</p>\
                  </div>",
            fun: async function (sys, items, opts) {
				await xp.delay(0);
                var offset = sys.text.offset();
                console.log(offset.top, offset.left);  // 16 8
                sys.text.offset({top:100, left:0});
                offset = sys.text.offset();
                console.log(offset.top, offset.left);  // 100 0
            }
        }
    });
});