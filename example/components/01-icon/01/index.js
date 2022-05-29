xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                    <Icon id='msg'/>\
                    <Icon id='home'/>\
                    <Icon id='contact'/>\
                  </div>"
        },
        Icon: {
            css: "#icon { width: 48px; height: 48px; }",
            xml: "<img id='icon'/>",
            fun: function (sys, items, opts) {
                this.attr("src", 'img/' + this + ".png");
            }
        }
    });
});