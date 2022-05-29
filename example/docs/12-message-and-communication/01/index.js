xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                     <span id='foo'>foo</span>\
                     <span id='bar'>bar</span>\
                  </div>",
            fun: function ( sys, items, opts ) {
                sys.bar.watch("msg", function(e) {
                    console.log(this.text());
                });
                sys.foo.notify("msg");
            }
        }
    });
});