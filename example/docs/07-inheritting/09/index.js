xmlplus("xp", function (xp, $_) {
    $_().imports({
        Widget: {
            xml: "<button id='btn'>label</button>",
            opt: { border: "2px", background: "red" }
        },
        Button: {
            opt: { border: "1px", color: "blue" },
            map: { extend: {"from": "Widget", "opt": "r"} },
            fun: function (sys, items, opts) {
                console.log(opts); // { border: "1px", color: "blue" }
            }
        }
    });
});