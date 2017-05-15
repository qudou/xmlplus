xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                    <Button type='default'>Default</Button>\
                    <Button type='primary'>Primary</Button>\
                    <Button type='success'>Success</Button>\
                 </div>"
        },
        Button: {
            xml: "<button type='button' class='btn'/>",
            fun: function (sys, items, opts) {
                this.addClass("btn-" + opts.type);
            }
        }
    });
});