xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            css: "#index { position: relative; height: 100%; opacity: 0; transition: opacity .5s ease-in-out; }\
				  #banner { border-bottom: 1px solid #e5e5e5; }\
				  #docs { margin-top: 40px; }",
            xml: "<div id='index' xmlns:i='tools'>\
                    <Banner id='banner'/>\
                    <i:ViewStack>\
                        <Home id='home'/>\
                        <Docs id='docs'/>\
                    </i:ViewStack>\
                  </div>",
            fun: function( sys, items, opts ) {
                sys.banner.on("change", function(e, target) {
                    sys.home.trigger("switch", target);
                });
				setTimeout(function() {
					document.getElementById("loading").style.opacity = 0;
					sys.index.css("opacity", "1");
				}, 1000);
            }
        },
        Banner: {
            xml: "<header class='navbar navbar-static-top bs-docs-nav'>\
                     <div class='container' xmlns:i='banner'>\
                        <i:Title/>\
                        <i:Navigator/>\
                     </div>\
                  </header>"
        },
        Home: {
            xml: "<main class='bs-docs-masthead'>\
                  <div class='container'>\
                    <span class='bs-docs-booticon bs-docs-booticon-lg bs-docs-booticon-outline'>X</span>\
                    <p class='lead'>XMLPlus是一个颠覆性JS框架，用于快速开发前后端项目。</p>\
                    <p class='lead'>\
                      <a href='getting-started#download' class='btn btn-outline-inverse btn-lg'>下载 XMLPlus</a>\
                    </p>\
                    <p class='version'>当前版本： v1.5.1 | 文档更新于：2017-01-06</p>\
                  </div>\
                 </main>"
        },
        Docs: {
			css: "#docs { position: relative; }",
            xml: "<div id='docs' class='container bs-docs-container' xmlns:i='docs'>\
                    <div class='row'>\
                        <div id='content' class='col-md-9'>\
							<i:Article url='01-components-and-space'/>\
							<i:Article url='02-naming'/>\
							<i:Article url='03-abstract'/>\
							<i:Article url='04-dynamic-interface'/>\
							<i:Article url='05-static-interface'/>\
							<i:Article url='06-parameter-mapping'/>\
							<i:Article url='07-path'/>\
							<i:Article url='08-inheritting'/>\
							<i:Article url='09-searching'/>\
							<i:Article url='10-nesting'/>\
							<i:Article url='11-life-circle'/>\
							<i:Article url='12-events-and-communication'/>\
							<i:Article url='13-message-and-communication'/>\
							<i:Article url='14-sharing'/>\
							<i:Article url='15-lazy-instantiation'/>\
						</div>\
                        <div class='col-md-3'>\
                            <div class='bs-docs-sidebar hidden-print hidden-xs hidden-sm affix-top'><i:Navigator id='nav'/></div>\
                        </div>\
                    </div>\
                  </div>"
        }
    });
    $_("banner").imports({
        Title: {
            css: "#title { cursor: pointer; }",
            xml: "<div class='navbar-header'>\
                    <button class='navbar-toggle collapsed' type='button' data-toggle='collapse' data-target='.bs-navbar-collapse'>\
                        <span class='sr-only'>Toggle navigation</span>\
                        <span class='icon-bar'></span>\
                        <span class='icon-bar'></span>\
                        <span class='icon-bar'></span>\
                    </button>\
                    <a id='title' class='navbar-brand'>XMLPlus</a>\
                  </div>",
            fun: function( sys, items, opts ) {
                sys.title.on("click", function(e) {
                    this.trigger("change", "home");
                });
            }
        },
        Navigator: {
            css: "#nav li { cursor: pointer }",
            xml: "<nav id='nav' class='navbar-collapse bs-navbar-collapse collapse' role='navigation' aria-expanded='false' style='height: 1px;'>\
                   <ul class='nav navbar-nav'>\
                     <li id='startup'><a>起步</a></li>\
                     <li id='docs'><a>文档</a></li>\
                     <li id='components'><a>组件</a></li>\
                     <li id='examples'><a>示例</a></li>\
                   </ul>\
                   <ul class='nav navbar-nav navbar-right'>\
                    <li><a target='_blank'>高薪工作</a></li>\
                    <li><a target='_blank'>优站精选</a></li>\
                    <li><a target='_blank'>官方博客</a></li>\
                   </ul>\
                 </nav>",
            fun: function( sys, items, opts ) {
                var prev = sys.startup;
                sys.nav.on("click", "./ul/li", function (e) {
                    e.stopPropagation();
                    prev.removeClass("active");
                    prev = this.trigger("change", this.toString()).addClass("active");
                });
            }
        }
    });
    $_("docs").imports({
        Navigator: {
            css: "#nav { width: 100%; }\
                  .bs-docs-sidebar .nav>li>a { cursor: pointer; font-size: 14px; }",
            xml: "<ul id='nav' class='nav bs-docs-sidenav'>\
                    <li id='01-components-and-space'><a>组件与空间</a></li>\
                    <li id='02-naming'><a>命名</a></li>\
                    <li id='03-abstract'><a>抽象</a></li>\
                    <li id='04-dynamic-interface'><a>动态接口</a></li>\
                    <li id='05-static-interface'><a>静态接口</a></li>\
                    <li id='06-parameter-mapping'><a>参数映射</a></li>\
                    <li id='07-path'><a>路径</a></li>\
                    <li id='08-inheritting'><a>继承</a></li>\
                    <li id='09-searching'><a>检索</a></li>\
                    <li id='10-nesting'><a>嵌套</a></li>\
                    <li id='11-life-circle'><a>生命周期</a></li>\
                    <li id='12-events-and-communication'><a>事件与通信</a></li>\
                    <li id='13-message-and-communication'><a>消息与通信</a></li>\
                    <li id='14-sharing'><a>共享与通信</a></li>\
                    <li id='15-lazy-instantiation'><a>延迟实例化</a></li>\
                 </ul>",
            fun: function( sys, items, opts ) {
				var template = "<li><a href='%href'>%text</a></li>";
                this.watch("article-ready", function ( e, dt ) {
					sys[dt.url].first().attr("href", "#" + dt.h1.getAttribute("id"));
					var ul = "<ul class='nav'>";
					dt.h2s.forEach(function(h2) {
						ul += template.replace('%href', '#' + h2.getAttribute("id")).replace('%text', h2.innerHTML);
					});
					sys[dt.url].append(ul += "</ul>");
				});
            }
        },
		Article: {
			xml: "<div id='article' class='bs-docs-section'/>",
			fun: function( sys, items, opts ) {
				var str, msg, 
					article = sys.article.elem(),
					ajax = this.append("/tools/AJAX"),
					regexp = /body\>((.|\r|\n)*)\<\/body/g;
				ajax.once("success", function (e, value) {
                    regexp.test(value);
                    str = RegExp.$1.trim();
					article.innerHTML = str.substr(24, str.length - 11);
					(msg = [].slice.call(article.querySelectorAll("h1,h2"))).forEach(function(item) {
						item.setAttribute("id", xp.guid());
					});
					this.notify("article-ready", {url: opts.url, h1: msg[0], h2s: msg.slice(1)});
				}).value()({type: 'GET', url: 'docs/' + opts.url});
			}
		}
	});
    $_("tools").imports({
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
        },
        ViewStack: { 
            xml: "<div/>",
            fun: function ( sys, items, opts ) {
                var args, children = this.children(),
                    table = children.call("hide").hash(),
                    ptr = table[opts.index] || children[0];
                if ( ptr ) ptr = ptr.show().trigger("show", null, false);
                this.on("switch", function ( e, to ) {
                    table = this.children().hash();
                    if ( !table[to] || table[to] == ptr ) return;
                    e.stopPropagation();
                    args = [].slice.call(arguments).slice(2);
                    args.unshift(ptr + '');
                    ptr.hide().trigger("hide", to + '', false);
                    ptr = table[to].show().trigger("show", args, false);
                });
                return Object.defineProperty({}, "selected", { get: function() {return ptr;}});
            }
        }
	});
});