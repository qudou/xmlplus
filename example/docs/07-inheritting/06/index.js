xmlplus("xp", function (xp, $_) {
    $_().imports({
        Widget: {
            xml: "<button id='btn'>label</button>"
        },
        Button: {
            map: { extend: {"from": "Widget"} },
            fun: function (sys, items, opts) {
                console.log("hello, button");
            }
        }
    });
});