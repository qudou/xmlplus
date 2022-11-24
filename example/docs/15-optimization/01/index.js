xmlplus("xp", function (xp, $_) {
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
