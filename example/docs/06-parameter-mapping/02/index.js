xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            xml: "<Input disabled='true'/>"
        },
        Input: {
            xml: "<input id='input' type='text'/>",
            opt: { format: 'string' },
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