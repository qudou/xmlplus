xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                    <Form id='foo' format='int'/>\
                    <Form id='bar' format='float'/>\
                    <button id='btn'>check</button>\
                  </div>",
            fun: function ( sys, items, opts ) {
                sys.btn.on("click", function(e) {
                    console.log("foo", items.foo.value);
                    console.log("bar", items.bar.value);
                });
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
        },
        Form: {
            xml: "<div id='form'>\
                     price: <Input id='foo' value='2.2'/><br/>\
                     count: <Input id='bar' value='3.3'/>\
                  </div>",
            map: { attrs: { foo: "format", bar: "format" } },
            fun: function (sys, items, opts) {
                function getValue() {
                    return [items.foo.value, items.bar.value];
                }
                return Object.defineProperty({}, "value", { get: getValue });
            }
        }
    });
});