xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                    <Input id='text' type='text'/>\
                  </div>",
            fun: function (sys, items, opts) {
                sys.text.bind([{foo: 1},{foo: 2}]);
            }
        },
        Input: {
            xml: "<input id='foo' type='text'/>"
        }
    });
});