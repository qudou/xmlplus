xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
			css: "#sidebar, #content { border: 1px solid #AAA; min-height: 300px; }",
            xml: "<div class='container'>\
					<div class='row'>\
						<div id='sidebar' class='col-sm-3'>\
							<h2>Sidebar</h2>\
							<Nav id='nav'/>\
						</div>\
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
					sys.content.append(RegExp.$1.trim()).removeAttr("class");
				});
                items.ajax({url: "/02-naming"});
			}
		},
		Nav: {
			xml: "<ul class='nav nav-tabs nav-stacked'>\
				  <li><a href='#'>组件与空间</a></li>\
				  <li><a href='#'>命名</a></li>\
				  <li><a href='#'>抽象</a></li>\
				  <li><a href='#'>动态接口</a></li>\
				  <li><a href='#'>静态接口</a></li>\
				  <li><a href='#'>参数映射</a></li>\
				  <li><a href='#'>路径</a></li>\
				  <li><a href='#'>继承</a></li>\
				  <li><a href='#'>检索</a></li>\
				  <li><a href='#'>嵌套</a></li>\
				  <li><a href='#'>生命周期</a></li>\
				  <li><a href='#'>事件与通信</a></li>\
				  <li><a href='#'>消息与通信</a></li>\
				  <li><a href='#'>共享与通信</a></li>\
				  <li><a href='#'>延迟实例化</a></li>\
				</ul>"
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