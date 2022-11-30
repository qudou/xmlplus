xmlplus("xp", function (xp, $_) {
    $_().imports({
        Example: {
            xml: "<div id='example'/>",
            fun: function (sys, items, opts) {
                var guid = sys.example.guid();
                console.log(sys.example == xp.getElementById(guid, true)); // true
            }
        }
    });
});