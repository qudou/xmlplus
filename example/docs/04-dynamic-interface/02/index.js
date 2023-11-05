xmlplus("xp", function ( xp, $_) {
    $_().imports({
        Index: {
            xml: "<Ipv4Box id='ipbox'/>",
            fun: function (sys, items, opts) {
                items.ipbox.val = "192.168.0.1";
                console.log(items.ipbox.val);
                console.log(sys.ipbox.val() == items.ipbox);
            }
        },
        IPv4Box: {
            css: "#box { border:1px solid #ABADB3; display: inline-block; }\
                  #box input { width: 28px; line-height: 19px; border:0; text-align:center; outline:none; }",
            xml: "<div id='box'>\
                    <input/>.<input/>.<input/>.<input/>\
                  </div>",
            fun: function (sys, items, opts) {
                var inputs = sys.box.kids();
                sys.box.on("keypress", "input", function(e) {
                    var next, ch = String.fromCharCode(e.which);
                    if (!/[0-9]/.test(ch))
                        return e.preventDefault();
                    if (this.prop("value").length == 2) {
                        next = this.next();
                        next && next.elem().select();
                    }
                });
                function getValue() {
                    return inputs.map(function (item) {
                        return item.prop("value")
                    }).join('.');
                }
                function setValue(input) {
                    var input = input.split(".");
                    for (var i = 0; i < inputs.length; i++)
                        inputs[i].prop("value", input[i]);
                }
                return Object.defineProperty({}, "val", { get: getValue, set: setValue });
            }
        }
	});
});