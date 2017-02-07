xmlplus("xp", function (xp, $_, t) {
    $_().imports({
		Index: {
			xml: "<Input placeholder='please input' value='hello world'/>"
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