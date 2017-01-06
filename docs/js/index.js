xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            css: "#sidebar { position: fixed; width: 260px; height: 100%;  padding: 0 15px; margin: 0 20px 0 0; overflow-x: hidden; overflow-y: auto; }\
				  #content { position: fixed; left: 280px; top: 0; width: calc(100% - 280px); height: 100%; overflow-y: auto; }",
            xml: "<div id='top' xmlns:i='docs'>\
                    <AJAX id='ajax' type='GET'/>\
					<div id='sidebar' class='bs-docs-sidebar'>\
						<i:Nav id='nav'/>\
					</div>\
					<i:Content id='content'/>\
                  </div>",
            fun: function( sys, items, opts ) {
                sys.nav.on("change", function (e, target) {
                    items.ajax({url: target});
                });
                sys.ajax.on("success", items.content.val);
            }
        },
        Banner: {
            css: "#banner { background: #222; color: #fafafa; position: fixed; top: 0; height: 50px; box-shadow: 0 0 5px rgba(0,0,0,0.5); width: 100%; z-index: 100; }",
            xml: "<div id='banner'/>"
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
    $_("docs").imports({
        Nav: {
			css: "#nav { width: 100%; }\
				  .bs-docs-sidebar .nav>li>a { cursor: pointer; font-size: 14px; }",
            xml: "<ul id='nav' class='nav bs-docs-sidenav'>\
                    <li dt='01-components-and-space' id='first'><a>组件与空间</a></li>\
                    <li dt='02-naming'><a>命名</a></li>\
                    <li dt='03-abstract'><a>抽象</a></li>\
                    <li dt='04-dynamic-interface'><a>动态接口</a></li>\
                    <li dt='05-static-interface'><a>静态接口</a></li>\
                    <li dt='06-parameter-mapping'><a>参数映射</a></li>\
                    <li dt='07-path'><a>路径</a></li>\
                    <li dt='08-inheritting'><a>继承</a></li>\
                    <li dt='09-searching'><a>检索</a></li>\
                    <li dt='10-nesting'><a>嵌套</a></li>\
                    <li dt='11-life-circle'><a>生命周期</a></li>\
                    <li dt='12-events-and-communication'><a>事件与通信</a></li>\
                    <li dt='13-message-and-communication'><a>消息与通信</a></li>\
                    <li dt='14-sharing'><a>共享与通信</a></li>\
                    <li dt='15-lazy-instantiation'><a>延迟实例化</a></li>\
                 </ul>",
            fun: function( sys, items, opts ) {
                var prev = sys.first;
                setTimeout(function() {
                    sys.first.trigger("click");
                });
                sys.nav.on("click", "./li", function (e) {
                    e.stopPropagation();
                    prev.removeClass("active");
                    prev = this.trigger("change", this.attr("dt")).addClass("active");
                });
            }
        },
        Content: {
            css: "#content > *:first-child { max-width: 800px; }",
            xml: "<div id='content' class='container'/>",
            fun: function( sys, items, opts ) {
				var content = sys.content.elem();
				function setValue( e, value ) {
                    var regexp = /\<body\>((.|\r|\n)*)\<\/body\>/g;
                    regexp.test(value);
                    content.innerHTML = RegExp.$1.trim();
                    content.lastChild.removeAttribute("class");
				}
				return { val: setValue };
            }
        }
	});
});