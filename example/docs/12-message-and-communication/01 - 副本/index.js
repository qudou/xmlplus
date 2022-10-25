xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                     <span id='foo'>foo</span>\
                     <span id='bar'>bar</span>\
					 <button id='hello'>hello</button>\
                  </div>",
            fun: function ( sys, items, opts ) {
                sys.foo.watch("msg", function(e) {
                    console.log(this.text());
                });
                sys.bar.glance("msg", function(e) {
                    console.log(this.text());
                });
                sys.index.watch("msg", function(e) {
                    //console.log("index");
                });
                //sys.test.watch("msg", function(e) {
                    //console.log("test");
                //});
				sys.hello.on("click", () => {
					console.log(sys.index.messages());
					sys.index.notify("msg").notify("haha");
				});
            }
        },
		Test: {
            xml: "<div id='text'>\
                     <span id='foo2'>foo2</span>\
                     <span id='bar2'>bar2</span>\
                  </div>",
			map: { msgFilter: /msg/ },
			fun: function ( sys, items, opts ) {
                sys.foo2.watch("msg", function(e) {
                    console.log(this.text());
                });
                sys.bar2.watch("msg", function(e) {
                    console.log(this.text());
                });
                sys.foo2.watch("haha", function(e) {
                    console.log("haha1");
                });
                sys.bar2.watch("haha", function(e) {
                    console.log("haha2");
                });
            }
		}
    });
});