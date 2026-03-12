xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Example: {
            xml: "<div id='example'>\
                    <p id='text'>hello,world</p>\
                  </div>",
            fun: async function (sys, items, opts) {
				await xp.delay(0);
                var p = sys.text.position();
                console.log(p.left, p.top);  // 8 0
            }
        }
    });
});