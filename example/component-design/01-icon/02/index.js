xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                    <Icon id='msg'/>\
                    <Icon id='home'/>\
                    <Icon id='contact'/>\
                  </div>"
        },
        Icon: {
            css: "#icon { width: 48px; height: 48px; background: no-repeat; }",
            xml: "<div id='icon'/>",
            fun: function (sys, items, opts) {
                this.css("background-image", "url(img/" + this + ".png)");
            }
        }
    });
});