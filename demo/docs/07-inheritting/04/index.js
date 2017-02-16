xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Widget: {
            css: "#btn { color: blue }",
            xml: "<button id='btn'>label</button>"
        },
        Button: {
            xml: "<span id='btn'>label</span>",
            map: { extend: {"from": "Widget"} }
        }
    });
});