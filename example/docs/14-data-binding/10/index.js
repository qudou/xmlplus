xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                    <span/>\
                    <input type='text'/>\
                  </div>",
            ali: {text: "//span | //input"},
            fun: function (sys, items, opts) {
                var ret = this.bind({text: "hello, world"});
                setTimeout(ret.unbind, 10*1000);
            }
        }
    });
});