xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                    <input id='text' type='text'/>\
                  </div>",
            fun: function (sys, items, opts) {
                window.ret = sys.text.bind([1,2,3,4]);
            }
        }
    });
});