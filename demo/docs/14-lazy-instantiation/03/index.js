xmlplus("xp", function (xp, $_, t) {
    $_().imports({
		Index: {
			xml: "<ViewStack id='index'>\
					 <button id='foo'>to bar</button>\
					 <button id='bar'>to foo</button>\
				  </ViewStack>",
			map: { defer: "bar" },
			fun: function (sys, items, opts) {
				sys.index.on("click", "button", function(e) {
					this.trigger("switch", this.text().substr(3));
				});
			}
		},
		ViewStack: { 
			xml: "<div id='viewstack'/>",
			fun: function (sys, items, opts) {
				var args, children = this.children(),
					table = children.call("hide").hash(),
					ptr = table[opts.index] || children[0];
				if (ptr) ptr = ptr.trigger("show").show();
				this.on("switch", function ( e, to ) {
					table = this.children().hash();
					if ( !table[to] || table[to] == ptr ) return;
					e.stopPropagation();
					args = [].slice.call(arguments).slice(2);
					if(ptr) ptr.trigger("hide", [to+''].concat(args)).hide();
					ptr = table[to].trigger("show", [ptr+''].concat(args)).show();
				});
				return Object.defineProperty({}, "selected", { get: function() {return ptr;}});
			}
		}
    });
});