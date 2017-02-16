xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Example: {
            xml: "<input id='example' type='checkbox'/>",
            fun: function (sys, items, opts) {
                console.log(sys.example.prop("checked"));  // false
                sys.example.prop("checked", true);
                console.log(sys.example.prop("checked"));  // true
            }
        }
    });
});