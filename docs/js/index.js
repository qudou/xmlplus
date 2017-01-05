xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
			css: "#sidebar, #content { background: #AAA; }",
            xml: "<div class='container'>\
					<div class='row'>\
						<div id='sidebar' class='col-sm-3'/>\
						<div id='content' class='col-sm-9'>\
							<Docs id='test'/>\
						</div>\
					</div>\
				  </div>"
        },
		Banner: {
			css: "#banner { background: #222; color: #fafafa; position: fixed; top: 0; height: 50px; box-shadow: 0 0 5px rgba(0,0,0,0.5); width: 100%; z-index: 100; }",
			xml: "<div id='banner'/>"
		},
		Docs: {
			xml: "<section id='docs' xmlns:i='.' >\
					<i:Content id='content'/>\
					<AJAX id='ajax' type='GET'/>\
				  </section>",
			fun: function( sys, items, opts ) {
				sys.ajax.on("success", function( e, data ) {
					/\<body\>((.|\r|\n)*)\<\/body\>/g.test(data);
					sys.content.elem().innerHTML = RegExp.$1;
				});
                items.ajax({url: "/02-naming"});
			}
		},
		Nav: {
			css: "@media (max-width: 640px) { #nav { width: 100%; padding-bottom: 40px; } }\
				  #nav { color: #2d2d2d; font-size: 14px; float: left; width: 210px; }",
			xml: "<div id='nav'/>"
		},
		Content: {
            xml: "<div id='content'/>"
        },
		AJAX: {
			xml: "<void id='ajax'/>",
			opt: { url: "http://xmlplus.net/", type: "POST", data: null, timeout: 5000, async: true },
			fun: function ( sys, items, opts ) {
				return function ( options_ ) { 
					var xhr = new XMLHttpRequest,
						options = xp.extend({}, opts, options_);
					xhr.timeout = options.timeout;
					xhr.ontimeout = xhr.onerror = function (event) {
						sys.ajax.trigger(event.type, event);
					};
					xhr.onload = function (event) {
						if ( xhr.status != 200 )
							return sys.ajax.trigger("error", event);
						sys.ajax.trigger("success", [xhr.responseText], false);
					};
					xhr.open(options.type, opts.url + options.url, options.async);
					xhr.send(options.data && JSON.stringify(options.data));
				};
			}
		}
    });
});