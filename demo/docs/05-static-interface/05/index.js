xmlplus("xp", function ( xp, $_, t) {
    $_().imports({
		Index: {
			xml: "<Format fontSize='16'/>"
		},
		Format: {
			opt: { step: "28.5", fontSize: "24", width: "28px", disabled: "true" },
			map: { format: {"int": "step", "float": "fontSize width", "bool": "disabled"} },
			fun: function (sys, items, opts) {
				console.log(opts.step, typeof opts.step);
				console.log(opts.fontSize, typeof opts.fontSize);
				console.log(opts.width, typeof opts.width);
				console.log(opts.disabled, typeof opts.disabled);
			}
		}
    });
});