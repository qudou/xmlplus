xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                    <input id='text1' type='text'/>\
                    <input id='text2' type='text'/>\
                  </div>",
            ali: {text: "//input"},
            fun: function (sys, items, opts) {
                this.bind({text: "hello, world"});
            }
        }
    });
});
