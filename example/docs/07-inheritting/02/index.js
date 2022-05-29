xmlplus("xp", function (xp, $_) {
    $_().imports({
        Widget: {
            css: "#btn { color: blue }",
            xml: "<button id='btn'>label</button>"
        },
        Button: {
            css: "#btn { border: 1px solid red; }",
            map: { extend: {"from": "Widget", "css": "r"} }
        }
    });
});