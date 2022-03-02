xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Example: {
            xml: "<div id='example'>\
                    <button>foo</button>\
                    <button>bar</button>\
                  </div>",
            fun: function (sys, items, opts) {
                sys.example.text();            // text 是个体对象接口
                sys.example.kids().hash();     // hash 是集体对象接口
            }
        }
    });
});