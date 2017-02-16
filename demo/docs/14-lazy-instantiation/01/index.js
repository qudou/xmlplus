xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                     <span id='foo'>foo</span>\
                     <span id='bar'>bar</span>\
                  </div>",
            map: { defer: "foo bar" }
        }
    });
});