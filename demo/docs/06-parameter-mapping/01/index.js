xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                     <Input id='foo'/>\
                     <Input id='bar' format='int'/>\
                  </div>",
            fun: function (sys, items, opts) {
                items.foo.value = "hello, world";
                items.bar.value = 27.1828;
                console.log("foo", items.foo.value);
                console.log("bar", items.bar.value);
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
                return Object.defineProperty({}, "value", { get: getValue, set: setValue });
            }
        }
    });
});