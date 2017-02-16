xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Example: {
            xml: "<div id='example'>\
                    <Target id='target'/>\
                  </div>",
            fun: function (sys, items, opts) {
                console.log(sys.example.localName());  // div
                console.log(sys.target.localName());   // Target
            }
        },
        Target: {}
    });
});