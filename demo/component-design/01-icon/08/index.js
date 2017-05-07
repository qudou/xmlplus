xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            css: "#index > * { padding: 10px; background: #F9F9F9; }\
                  #index > *:hover { fill: #fff; background: #563d7c; }",
            xml: "<div id='index'>\
                    <Icon id='red'/>\
                    <Icon id='green'/>\
                    <Icon id='blue'/>\
                  </div>",
            fun: function (sys, items, opts) {
                sys.index.on("click", "*", function (e) {
                    console.log("click " + this + " tick"); 
                });
            }
        },
        Icon: {
            xml: "<svg width='48px' height='48px' viewBox='0 0 24 24'>\
                    <g><polygon points='9,16.2 4.8,12 3.4,13.4 9,19 21,7 19.6,5.6'/></g>\
                  </svg>",
            fun: function (sys, items, opts) {
                this.attr("fill", '' + this);
            }
        }
    });
});