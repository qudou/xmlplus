xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Example: {
            xml: "<Target id='example'/>",
            fun: function (sys, items, opts) {
                console.log(sys.example.namespace());  // //xp
            }
        },
        Target: {}
    });
});