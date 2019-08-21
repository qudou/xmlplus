xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            css: "#index button { color: blue }",
            xml: "<div id='index'>\
                    <button>hell</button>\
                    <button>world</button>\
                  </div>"
        }
    });
});
