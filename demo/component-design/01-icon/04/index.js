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
            css: "#icon { width: 48px; height: 48px; background-image: url(img/icons.png); }",
            xml: "<div id='icon'/>",
            fun: function (sys, items, opts) {
                var positions = {
                    "msg": "0 0",
                    "home": "0 -48px",
                    "contact": "0 -96px"
                };
                sys.icon.css("background-position", positions[this]);
            }
        }
    });
});