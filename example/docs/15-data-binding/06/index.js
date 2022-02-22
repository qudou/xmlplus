xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                    <input type='text'/>\
                    <input type='text'/>\
                    <input type='radio' name='n' value='USA'/>\
                    <input type='radio' name='n' value='China'/>\
                  </div>",
            ali: {text: "//input[@type='text']", radio: "//input[@type='radio']", },
            fun: function (sys, items, opts) {
                this.bind({text: "hello, world", radio: "China"});
            }
        }
    });
});