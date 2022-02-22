xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                    <input type='radio' name='n' value='USA'/>\
                    <input type='radio' name='n' value='China'/>\
                    <select id='select'>\
                        <option>USA</option>\
                        <option>China</option>\
                    </select>\
                  </div>",
            ali: {country: "//input | //select", },
            fun: function (sys, items, opts) {
                this.bind({country: "China"});
            }
        }
    });
});