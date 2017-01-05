xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<div id='top'>\
					<AJAX id='ajax' type='GET'/>\
					<Docs id='test'/>\
				  </div>",
            fun: function( sys, items, opts ) {
				sys.ajax.on("success", function( e, data ) {
					/\<body\>((.|\r|\n)*)\<\/body\>/g.test(data);
					items.test.elem().innerHTML = RegExp.$1;
				});
                items.ajax({url: "/02-naming"});
            }
        },
		Docs: {
			css: "@media (max-width: 640px) { #docs { padding-bottom: 0; } }\
				  @media (max-width: 960px) { #docs { padding-left: 10px; padding-right: 10px; }}\
				  #docs { padding-top: 20px; padding-bottom: 80px; }\
				  #docs { max-width: 960px; margin-left: auto; margin-right: auto; padding-left: 20px; padding-right: 20px; }",
			xml: "<section id='docs' xmlns:i='.'>\
					<i:Content id='content'/>\
					<i:Nav id='nav'/>\
				  </section>",
			fun: function( sys, items, opts ) {
				return sys.content;
			}
		},
		Nav: {
			css: "@media (max-width: 640px) { #nav { width: 100%; padding-bottom: 40px; } }\
				  #nav { color: #2d2d2d; font-size: 14px; float: left; width: 210px; }",
			xml: "<div id='nav'/>"
		},
		Content: {
			css: "@media (max-width: 640px) { #content { width: 100%; } } \
				  @media (max-width: 960px) { #content { width: calc(100% - 240px); max-width: 100%; } }\
				  #content { float: right; width: 100%; max-width: 650px; }",
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