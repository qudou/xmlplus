xmlplus("xp", function (xp, $_) {
    $_().imports({
        Widget: {
            xml: "<button id='btn'>label</button>",
            fun: function (sys, items, opts) {
                console.log("hello, widget");
            }
        },
        Button: {
            map: { extend: {"from": "Widget"} }
        }
    });
});