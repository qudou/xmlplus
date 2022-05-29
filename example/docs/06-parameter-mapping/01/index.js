xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                     <Input id='foo'/>\
                     <Input id='bar' format='int'/>\
                  </div>",
            fun: function (sys, items, opts) {
                items.foo.val = "hello, world";
                items.bar.val = 27.1828;
                console.log("foo", items.foo.val);
                console.log("bar", items.bar.val);
            }
        },
        Input: {
            xml: "<input id='input' type='text'/>",
            opt: { format: 'string' },
            map: { attrs: { input: "disabled value placeholder readonly" } },
            fun: function (sys, items, opts) {
                var parse = {"int": parseInt, "float": parseFloat, "string": String}[opts.format];
                function getValue() {
                    return parse(sys.input.prop("value"));
                }
                function setValue(value) {
                    sys.input.prop("value", parse(value));
                }
                return Object.defineProperty({}, "val", { get: getValue, set: setValue });
            }
        }
    });
});