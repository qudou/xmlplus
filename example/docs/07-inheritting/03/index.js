xmlplus("xp", function (xp, $_) {
    $_().imports({
        Widget: {
            css: "#btn { color: blue }",
            xml: "<button id='btn'>label</button>"
        },
        Button: {
            map: { extend: {"from": "Widget"} }
        }
    });
});