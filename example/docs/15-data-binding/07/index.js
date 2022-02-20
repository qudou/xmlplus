xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                    <input id='text' type='text'/>\
                  </div>",
            fun: function (sys, items, opts) {
                sys.text.bind([1,2,3,4]);
            }
        }
    });
});