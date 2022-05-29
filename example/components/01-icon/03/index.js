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
            css: "#msg { background-position:  0 0; }\
                  #home { background-position: 0 -48px; }\
                  #contact { background-position: 0 -96px; }\
                  #icon { width: 48px; height: 48px; background-image: url(img/icons.png); }",
            xml: "<div id='icon'/>",
            fun: function (sys, items, opts) {
                sys.icon.addClass("#" + this);
            }
        }
    });
});