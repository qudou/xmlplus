xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                    <Button type='add'>Add</Button>\
                    <Button type='remove'>Reomve</Button>\
                    <Button type='save'>Save</Button>\
                    <Button type='cut'>Cut</Button>\
                 </div>"
        },
        Button: {
            xml: "<a href='#' class='easyui-linkbutton'/>",
            fun: function (sys, items, opts) {
                this.attr("data-options", "iconCls:'icon-" + opts.type + "'");
                $(this.elem()).linkbutton();
            }
        }
    });
});