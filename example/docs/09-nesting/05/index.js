xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            xml: "<Window id='index'>\
                    <p>this is a test.</p>\
                  </Window>"
        },
        Window: {
            css: "#window { width: 600px; height: 480px; border: 1px solid blue; }\
                  #header { background: #AAA; height: 36px; }\
                  #content { width: 90%; height: calc(100% - 60px); margin: 10px auto 0; border: 1px solid blue; }",
            xml: "<div id='window'>\
                    <div id='header'/>\
                    <div id='content'/>\
                  </div>",
            map: { appendTo: "content" }
        }
    });
});