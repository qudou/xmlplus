xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                    <Input_1 val='hello'/>\
                    <Input_2 val='world'/>\
                  </div>"
        },
        Input_1: {
            xml: "<input id='foo'/>",
            opt: { val: "hello, world" },
            map: { attrs: { foo: "val->value" } }
        },
        Input_2: {
            xml: "<Input id='foo'/>",
            opt: { val: "hello, world" },
            map: { cfgs: { foo: "val->value" } }
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