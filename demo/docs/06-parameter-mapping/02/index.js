xmlplus("xp", function (xp, $_, t) {
    $_().imports({
		Index: {
			xml: "<Input disabled='true'/>"
		},
		Input: {
			xml: "<input id='input' type='text'/>",
			opt: { format: 'string' },
			fun: function (sys, items, opts) {
				var parse = {"int": parseInt, "float": parseFloat, "string": String}[opts.format];
				if (opts.disabled)
					sys.input.attr("disabled", opts.disabled);
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