xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Example: {
            xml: "<div id='example'>\
                    <p id='text'>hello,world</p>\
                  </div>",
            map: { nofragment: true },
            fun: function (sys, items, opts) {
                var p = sys.text.position();
                console.log(p.left, p.top);  // 8 0
            }
        }
    });
});