var xmlplus = require("xmlweb");

xmlplus("xp", (xp, $_, t) => {

$_().imports({
    Index: {
        cfg: { "static": {root: __dirname + "/static" } },
        xml: "<i:HTTP listen='8086' xmlns:i='//xmlweb'>\
                <Rewrite id='rewrite'/>\
                <i:Static id='static'/>\
                <Home id='home'/>\
                <Start id='start'/>\
                <Docs id='docs'/>\
                <Components id='components'/>\
                <Xmlweb id='xmlweb'/>\
                <API id='api'/>\
                <NotFound id='notfound'/>\
              </i:HTTP>",
        fun: function (sys, items, opts) {
            require("marked").setOptions({
                highlight: code => {return require("highlight.js").highlightAuto(code).value}
            });
            console.log("service is ready!");
        }
    },
    Rewrite: {
        xml: "<i:Rewrite id='rewrite' xmlns:i='//xmlweb/rewrite'>\
                <i:Roule from='/' to='/home.html'/>\
                <i:Roule from='/getting-started' to='/getting-started.html'/>\
                <i:Roule from='/docs' to='/docs.html'/>\
                <i:Roule from='/components' to='/components.html'/>\
                <i:Roule from='/api' to='/api.html'/>\
                <i:Roule from='/xmlweb' to='/xmlweb.html'/>\
                <i:Roule from='/404' to='/404.html'/>\
              </i:Rewrite>",
        fun: function (sys, items, opts) {
            let fs = require("fs");
                chokidar = require('chokidar')
            chokidar.watch('docs', opts).on('all', (e, p) => {
                e == "change" && unlink(p.split(/\/|\\/)[1] + ".html");
            });
            sys.rewrite.children().forEach(item => unlink(item.attr("to")));
            function unlink(path) {
                var p = __dirname + "/static/" + path;
                fs.stat(p, (err, stat) => err || fs.unlink(p, err => {if (err) throw err;}));
            }
        }
    },
    Transfer: {
        fun: function (sys, items, opts) {
            var widget = xp.startup("//xp/" + opts.widget, opts);
            this.on("enter", (e, r) => widget.trigger("enter", r));
            widget.on("return", (e, r) => this.trigger("reject", [r,"static"]));
        }
    },
    Home: {
        xml: "<i:Flow xmlns:i='//xmlweb'>\
                <i:Router url='/'/>\
                <Transfer title='官网' widget='home/Index'/>\
              </i:Flow>"
    },
    Start: {
        xml: "<i:Flow xmlns:i='//xmlweb'>\
                <i:Router url='/getting-started'/>\
                <Transfer title='起步' widget='start/Index'/>\
              </i:Flow>"
    },
    Docs: {
        xml: "<i:Flow xmlns:i='//xmlweb'>\
                <i:Router url='/docs'/>\
                <Transfer title='文档' widget='docs/Index'/>\
              </i:Flow>"
    },
    Components: {
        xml: "<i:Flow xmlns:i='//xmlweb'>\
                <i:Router url='/components'/>\
                <Transfer title='组件' widget='components/Index'/>\
              </i:Flow>"
    },
    Xmlweb: {
        xml: "<i:Flow xmlns:i='//xmlweb'>\
                <i:Router url='/xmlweb'/>\
                <Transfer title='xmlweb' widget='xmlweb/Index'/>\
              </i:Flow>"
    },
    API: {
        xml: "<i:Flow xmlns:i='//xmlweb'>\
                <i:Router url='/api'/>\
                <Transfer title='API' widget='api/Index'/>\
              </i:Flow>"
    },
    NotFound: {
        xml: "<i:Flow xmlns:i='//xmlweb'>\
                <i:Router url='/*' method='GET'/>\
                <Rewrite from='/*' to='/404.html' xmlns='//xmlweb/rewrite'/>\
                <Transfer title='页面未找到' widget='notfound/Index'/>\
              </i:Flow>"
    }
});

$_("home").imports({
    Index: {
        // position is for scrollspy
        css: "#body { background: #F9F9F9; position: relative; }\
              #content { padding-top: 50px; }",
        xml: "<html id='index' xmlns:i='/home'>\
                <i:Head id='head'/>\
                <body id='body'>\
                    <i:Banner id='banner'/>\
                    <Content id='content'/>\
                    <i:Footer id='footer'/>\
                </body>\
              </html>",
        map: { attrs: {head: "title"} },
        fun: function (sys, items, opts) {
            let queue = [],
                fs = require("fs"),
                minify = require("html-minifier").minify;
            this.on("enter", (e, r) => {
                if (queue.length) return queue.push(r);
                let path = __dirname + "/static" + r.url;
                fs.stat(path, (err, stat) => {
                    if (!err) return this.trigger("return", r);
                    queue.push(r);
                    this.notify("enter", r);
                });
            });
            sys.content.on("complete", e => {
                let path = __dirname + "/static" + queue[0].url;
                items.head.style(this.style());
                fs.writeFile(path, serialize(), "utf8", () => {
                    queue.forEach(item => this.trigger("return", item));
                    queue.splice(0);
                });
            });
            function serialize() {
                return "<!DOCTYPE html>" + minify(sys.index.serialize(), {minifyCSS: true, minifyJS: true, collapseWhitespace: true});
            }
        }
    },
    Head: {
        xml: "<head id='head'>\
                <meta charset='utf-8'/>\
                <meta http-equiv='X-UA-Compatible' content='IE=edge'/>\
                <meta name='viewport' content='width=device-width, initial-scale=1'/>\
                <meta name='description' content='xmlplus - 简洁、直观、强悍的开发框架，让开发更迅速、简单。'/>\
                <meta name='keywords' content='HTML, CSS, JS, JavaScript, framework, xmlplus, front-end, frontend, web development'/>\
                <title id='title'>xmlplus，a javascript framework</title>\
                <link rel='stylesheet' href='http://cdn.bootcss.com/bootstrap/3.3.0/css/bootstrap.min.css'/>\
                <link rel='stylesheet' href='https://cdn.jsdelivr.net/docsearch.js/1/docsearch.min.css'/>\
                <link rel='stylesheet' href='/css/docs.css'/>\
                <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->\
                <!--[if lt IE 9]>\
                  <script src='http://cdn.bootcss.com/html5shiv/3.7.0/html5shiv.js'></script>\
                  <script src='http://cdn.bootcss.com/respond.js/1.4.2/respond.min.js'></script>\
                <![endif]-->\
                <style id='style'/>\
            </head>",
        fun: function (sys, items, opts) {
            sys.title.text("xmlplus · " + opts.title);
            return { style: sys.style.text };
        }
    },
    Banner: {
        css: "#banner { background: #222; height: 50px; position: fixed; top: 0; width: 100%; box-shadow: 0 0 5px rgba(0,0,0,0.5); }\
              #banner { margin-bottom: 0; background-color: #222; border-bottom: 0; }\
              #banner .navbar-brand, #banner li a { font-weight: 500; color: #ddd; }",
        xml: "<header id='banner' class='navbar navbar-static-top'>\
                 <div class='container' xmlns:i='/home/banner'>\
                    <i:Title/>\
                    <i:Navigator/>\
                 </div>\
              </header>"
    },
    Content: {
        xml: "<div id='home' xmlns:i='content'>\
               <i:Hero id='hero'/>\
               <i:Marketing id='marketing'/>\
              </div>",
        fun: function (sys, items, opts) {
            this.watch("enter", (e, r) => this.trigger("complete", r), -1);
        }
    },
    Footer: {
        css: "#footer { padding-top: 50px; padding-bottom: 50px; margin-top: 40px; color: #99979c; text-align: center; background-color: #2a2730; }\
              #footer a { color: #DDD }\
              #links { padding-left: 0; margin-bottom: 20px; }\
              #links li { display: inline-block; }\
              #links li + li { margin-left: 15px; }",
        xml: "<footer id='footer' class='bs-docs-footer' role='contentinfo'>\
                  <div class='container'>\
                    <p>Designed and built by <a href='http://blog.xmlplus.cn' target='_blank'>qudou</a>.</p>\
                    <p>本项目源码受 <a href='https://github.com/qudou/xmlplus/blob/master/LICENSE' target='_blank'>MIT</a> 开源协议保护，文档受 <a href='http://creativecommons.org/licenses/by/3.0/' target='_blank'>CC BY 3.0</a> 开源协议保护。</p>\
                    <ul id='links' class='muted'>\
                      <li>当前版本：v1.5.21</li>\
                      <li>·</li><li><a href='https://github.com/qudou/xmlplus' target='_blank'>GitHub</a></li>\
                      <li>·</li><li><a href='https://github.com/qudou/xmlplus/issues' target='_blank'>Issues</a></li>\
                      <li>·</li><li><a href='https://github.com/qudou/xmlplus/releases' target='_blank'>历史版本</a></li>\
                      <li>·</li><li><a href='mailto:xmlplus@qq.com' target='_blank'>联系作者</a></li>\
                      <li>·</li><li><a href='http://www.miibeian.gov.cn/' target='_blank'>桂ICP备16003038号-3</a></li>\
                    </ul>\
                  </div>\
                  <script src='http://cdn.bootcss.com/jquery/1.11.1/jquery.min.js'/>\
                  <script src='http://cdn.bootcss.com/bootstrap/3.3.0/js/bootstrap.min.js'/>\
                  <script src='https://cdn.jsdelivr.net/docsearch.js/1/docsearch.min.js'/>\
                  <script src='/js/docs.min.js'/>\
                  <!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->\
                  <script src='http://v3.bootcss.com/assets/js/ie10-viewport-bug-workaround.js'/>\
                  <script>var cnzz_protocol = ((\"https:\" == document.location.protocol) ? \" https://\" : \" http://\");document.write(unescape(\"%3Cspan id='cnzz_stat_icon_1261374925'%3E%3C/span%3E%3Cscript src='\" + cnzz_protocol + \"s95.cnzz.com/z_stat.php%3Fid%3D1261374925%26show%3Dpic1' type='text/javascript'%3E%3C/script%3E\"));</script>\
                  <script>docsearch({apiKey: '5f2d951cb79805f6c0f6d080b1d3fad6', indexName: 'xmlplus', inputSelector: '#algolia-doc-search', debug: false});</script>\
                </footer>"
    }
});

$_("home/banner").imports({
    Title: {
        css: "#title { cursor: pointer; }\
              #title .icon-bar { background-color: #ddd; }\
              #title .navbar-toggle { border-color: #ddd; }\
              #title .navbar-toggle:hover, #title .navbar-toggle:focus { background-color: #333; border-color: #fafafa; }",
        xml: "<div id='title' class='navbar-header'>\
                <button class='navbar-toggle collapsed' type='button' data-toggle='collapse' data-target='.bs-navbar-collapse'>\
                    <span class='sr-only'>Toggle navigation</span>\
                    <span class='icon-bar'/>\
                    <span class='icon-bar'/>\
                    <span class='icon-bar'/>\
                </button>\
                <a href='/' class='navbar-brand'>xmlplus</a>\
              </div>"
    },
    Navigator: {
        css: "#nav li { cursor: pointer }\
              #nav li > a:hover, #nav li > a:focus, #nav li.active > a, #nav li.active > a:hover { color: #fafafa; background-color: #333; }\
              @media (max-width: 767px) { ul > li#search { display: none; } #nav { background-color: #222; } }\
              @media (min-width: 768px) {#nav li.active > a:after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; border-bottom: 3px solid #cc7a6f; } }",
        xml: "<nav id='nav' class='navbar-collapse bs-navbar-collapse collapse' role='navigation' aria-expanded='false' style='height: 1px;'>\
               <ul class='nav navbar-nav'>\
                 <li id='getting-started'><a href='/getting-started'>起步</a></li>\
                 <li id='docs'><a href='/docs'>文档</a></li>\
                 <li id='components'><a href='/components'>组件</a></li>\
                 <li id='xmlweb'><a href='/xmlweb'>xmlweb</a></li>\
                 <li id='api'><a href='/api'>API</a></li>\
                 <li id='search' class='nav-site-search'><SearchBox id='searchbox'/></li>\
               </ul>\
               <ul class='nav navbar-nav navbar-right'>\
                <li><a href='https://github.com/qudou/xmlplus' target='_blank'>GitHub</a></li>\
                <li><a href='javascript:void(0)' onclick='alert(\"in developing\")'>En</a></li>\
               </ul>\
             </nav>",
        fun: function (sys, items, opts) {
            this.watch("enter", (e, r) => {
                let key = r.req.url.substr(1);
                sys[key] && sys[key].addClass("active")
            });
        }
    },
    SearchBox: {
        css: "#searchbox { -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; border: none; margin: 0; padding: 0 }\
              #searchbox { background: transparent url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYBAMAAAASWSDLAAAAMFBMVEUAAAD///////////////////////////////////////////////////////////87TQQwAAAAD3RSTlMAoDDw4MBgQCCwgBCQ0FAj+FgFAAAAr0lEQVQY02MAgsTQ0BUMUPDkPxBIQ9iM/0HgswKYI///y6mV//8bgdh8/z8nMDB0/v8L4rAAxcDyCUAyH0iCxRxAQl/AOtn+/wCS8X/AHO7/30GcXxAbsHB+gtlMYM76/w0Qd3wAkv3/J4A4+v8FwEIfQarswQq47f+7bWCS/w+WYVD+DwEfwebcB7OhUmz+//8bNkKlGDjKyxkYoLrgHoa4EurjnwxIUrcZEODkBgBOT16D0MC5eQAAAABJRU5ErkJggg==') no-repeat 10px center; background-size: 16px 16px; position: relative; vertical-align: top; margin-left: 10px; padding: 0 10px; padding-left: 35px; height: 30px; margin-top: 10px; font-size: 14px; line-height: 20px; background-color: #333; border-radius: 4px; color: white; outline: none; width: 170px; transition: width .2s ease }\
              #searchbox:focus { width: 240px }",
        xml: "<input id='searchbox' type='text' placeholder='Search docs...' />",
        fun: function (sys, items, opts) {
            this.watch("enter", (e, r) => {
                let key = r.req.url.substr(1);
                sys[key] && sys[key].addClass("active")
            });
            sys.searchbox.attr("id", "algolia-doc-search");
        }
    }
});

$_("home/content").imports({
    Hero: {
        css: "#home { background: #2D2D2D; box-shadow: 0 0 5px rgba(0,0,0,0.5); text-shadow: 0 1px 0 rgba(0,0,0,.1); text-align: center; padding: 30px 0; }\
              #title { margin: 0 auto 30px; font-size: 64px; display: block; font-weight: 500; color: #fff; line-height: normal; }\
              #btn { width: 100%; padding: 15px 30px; font-size: 20px; color: #DDD; border-color: #DDD; }\
              #btn:hover, #btn:focus, #btn:active { color: #fafafa; text-shadow: none; background-color: #444; border-color: #fafafa; }\
              #home p {margin: 0 auto 30px; font-size: 20px; color: #e9e9e9;}\
              @media (min-width: 480px) {#btn {width: auto; }}\
              @media (min-width: 768px) {#home {padding: 80px 0;} #home p {font-size: 24px;}}\
              @media (min-width: 992px) {#home p {width: 80%; font-size: 30px;}}",
        xml: "<main id='home'>\
               <div class='container'>\
                <span id='title'>xmlplus</span>\
                <p>xmlplus 是一个 JavaScript 框架，用于快速开发前后端项目。</p>\
                <p><a id='btn' href='getting-started#安装' class='btn btn-lg'>下载 xmlplus</a></p>\
              </div>\
             </main>"
    },
    Marketing: {
        css: "#marketing h3 { color: #2d2d2d; }",
        xml: "<div id='marketing' class='container'>\
                <div class='col-md-4'>\
                  <h3>基于组件设计</h3>\
                  <p>在 xmlplus 中，组件是基本的构造块。评价组件设计好坏的一个重要标准是封装度。基于 xmlplus 设计的组件具有极高的封装度。</p>\
                  <p>组件由命名空间组织。基于传统目录路径的组件引用方式，让组件的使用更为便捷。</p>\
                </div>\
                <div class='col-md-4'>\
                  <h3>友好的相容性</h3>\
                  <p>非侵入式的设计，使得 xmlplus 可以与当今几乎所有的框架或者库集成使用。</p>\
                  <p>利用 xmlplus 出色的整合能力，你可以整合现有的库或框架到你的项目中，以避免陷入重造轮子的困境。</p>\
                </div>\
                <div class='col-md-4'>\
                  <h3>一次学习, 多端使用</h3>\
                  <p>xmlplus 独特的设计，使得它可以以相同的方式，设计基于浏览器端以及基于服务端的应用。</p>\
                  <p>在浏览器端，使用它可以高效地开发单页应用。在服务端，你既可以用它来开发服务应用，还能用它开发传统网站。</p>\
                </div>\
             </div>"
    }
});

$_("start").imports({
    Index: {
        map: { extend: {"from": "/home/Index"} }
    },
    Content: {
        css: "#header { margin-bottom: 0px; font-size: 20px; position: relative; padding: 30px 0; color: #99979c; text-align: center; text-shadow: 0 1px 0 rgba(0,0,0,.1); }\
              #header h1 { margin-top: 0; color: #333; }\
              #header p { margin-bottom: 0; font-weight: 300; line-height: 1.4; }\
              #back { display: none; padding: 4px 10px; margin-top: 10px; margin-left: 10px; font-size: 12px; font-weight: 500; color: #999; }\
              #back:hover { color: #563d7c; text-decoration: none; }\
              #sidebar.affix {position: static;}\
              @media (min-width: 768px) { #back {display: block;} #sidebar { padding-left: 20px; } #header {padding-top: 60px; font-size: 24px; text-align: left;} #header h1 {font-size: 60px; line-height: 1;}}\
              @media (min-width: 992px) {\
                  #sidebar .nav > .active > ul {display: block;}\
                  #sidebar.affix, #sidebar.affix-bottom {width: 213px;}\
                  #sidebar.affix {position: fixed; top: 60px;}\
                  #sidebar.affix-bottom {position: absolute;}\
                  #sidebar.affix-bottom .bs-docs-sidenav, #sidebar.affix .bs-docs-sidenav {margin-top: 0; margin-bottom: 0;}\
              }\
              @media (min-width: 1200px) {#sidebar.affix-bottom, .bs-docs-sidebar.affix {width: 263px;}}",
        xml: "<div id='content' class='container bs-docs-container'>\
                <div class='row'>\
                    <div id='body' class='col-md-9'>\
                        <Header id='header'/>\
                    </div>\
                    <div class='col-md-3'>\
                        <div id='sidebar' class='bs-docs-sidebar hidden-print hidden-xs hidden-sm affix-top'>\
                            <div id='nav'/>\
                            <a id='back' class='back-to-top' href='#top' data-scroll='#'>返回顶部</a>\
                        </div>\
                    </div>\
                </div>\
              </div>",
        fun: function (sys, items, opts) {
            let array = [], length,
                fs = require("fs"),
                dir = __dirname + "/docs";
            this.watch("enter", (e, r) => {
                array.splice(0);
                sys.body.children().slice(1).call("remove");
                sys.nav.replace("<Navigator id='nav' xmlns='/start'/>");
                fs.readdir(dir + r.req.url, (err,files) => {
                    length = files.length;
                    for (let file of files)
                        sys.body.append("/start/Article", {url: dir + r.req.url + '/' + file});
                });
            }, -1);
            sys.body.on("article-ready", (e,item) => {
                if ( array.push(item) == length ) {
                    array.sort((a,b) => {return a.idx - b.idx}).forEach(item => {items.nav.articleReady(null,item)});
                    sys.body.trigger("complete");
                }
            });
            sys.content.attr("id", "top");
        }
    },
    Header: {
        xml: "<div id='content'>\
                  <h1>起步</h1>\
                  <p>简要介绍了 xmlplus 的下载安装和基本的开发模版，另外还给出了一个小游戏示例以及框架对浏览器和设备的支持情况描述。</p>\
              </div>"
    },
    Navigator: {
        css: "#nav { width: 100%; margin-top: 60px; margin-bottom: 20px; }\
              #nav li > a { display: block; padding: 4px 20px; font-size: 14px; font-weight: 500; color: #767676; }\
              #nav li > a:hover, #nav li > a:focus { padding-left: 19px; color: #563d7c; text-decoration: none; background-color: transparent; border-left: 1px solid #563d7c; }\
              #nav .active > a, #nav .active:hover > a, #nav .active:focus > a { padding-left: 18px; font-weight: bold; color: #563d7c; background-color: transparent; border-left: 2px solid #563d7c;}\
              #nav .nav { display: none; padding-bottom: 10px; }\
              #nav .nav > li > a { padding-top: 1px; padding-bottom: 1px; padding-left: 30px; font-size: 12px; font-weight: normal; }\
              #nav .nav > li > a:hover, #nav .nav > li > a:focus { padding-left: 29px;}\
              #nav .nav > .active > a, #nav .nav > .active:hover > a, #nav .nav > .active:focus > a { padding-left: 28px; font-weight: 500; }",
        xml: "<ul id='nav' class='nav bs-docs-sidenav'/>",
        fun: function (sys, items, opts) {
            let template = "<li><a data-scroll='#' href='%href'>%text</a></li>";
            function articleReady( e, dt ) {
                let li = template.replace('%href', '#' + dt.h1.attr("id")).replace('%text', dt.h1.text());
                let ul = "<ul class='nav'>";
                dt.h2s.forEach(h2 => {
                    ul += template.replace('%href', '#' + h2.attr("id")).replace('%text', h2.text());
                });
                sys.nav.append(li).append(ul += "</ul>");
            }
            return { articleReady: articleReady };
        }
    },
    Article: {
        css: "#article { margin-bottom: 60px; }\
              #article > p, #article > ul, #article > ol { line-height: 1.75; margin-bottom: 1.2em; }\
              #article h1:before, #article h2:before, #article h3:before { content: ''; display: block; margin-top: -60px; height: 60px; visibility: hidden; }",
        xml: "<div id='article' class='bs-docs-section'/>",
        fun: async function (sys, items, opts) {
            let h1, h2s, h3, fs = require("fs"),
                doc = await readFile();
            sys.article.replace("<div id='article' class='bs-docs-section'>" + require("marked")(doc) + "</div>");
            (h1 = sys.article.find("//h1")[0]).attr("id", h1.text().replace(/\s+/g, '-'));
            (h2s = sys.article.find("//h2")).forEach(h2 => {
                h3 = h2.attr("id", h1.attr("id") + "_" + h2.text().replace(/\s+/g, '-'));
                while ( (h3 = h3.next()) && h3.localName() != "h2" ) {
                    if ( h3.localName() == "h3" )
                        h3.attr("id", h2.attr("id") + "_" + h3.text().replace(/\s+/g, '-'));
                }
            });
            function readFile() {
                return new Promise((resolve, reject) => fs.readFile(opts.url, 'utf8', (e,doc) => resolve(doc)));
            }
            sys.article.trigger("article-ready", {h1: h1, h2s: h2s, idx: opts.url.match(/\d\d/)[0]});
        }
    }
});

$_("docs").imports({
    Index: {
        map: { extend: {"from": "/home/Index"} }
    },
    Content: {
        map: { extend: {"from": "/start/Content"} }
    },
    Header: {
        xml: "<div id='header'>\
                 <h1>文档</h1>\
                 <p>全方位介绍框架特性，包含接口、属性映射、通信、延迟加载等丰富内容，如果你已经阅读过《起步》中的相关内容，那么就从这里进阶吧！</p>\
              </div>"
    }
});

$_("components").imports({
    Index: {
        map: { extend: {"from": "/home/Index"} }
    },
    Content: {
        map: { extend: {"from": "/start/Content"} }
    },
    Header: {
        xml: "<div id='header'>\
                  <h1>组件</h1>\
                  <p>本系列作为基础教程《文档》的进阶内容，主要通过十类组件示例论述 xmlplus 组件的设计与实现。</p>\
              </div>"
    }
});

$_("xmlweb").imports({
    Index: {
        map: { extend: {"from": "/home/Index"} }
    },
    Content: {
        map: { extend: {"from": "/start/Content"} }
    },
    Header: {
        xml: "<div id='header'>\
                  <h1>xmlweb</h1>\
                  <p>xmlweb 是一个基于状态机理论设计的 web 服务器，使用它可以设计出高可读性、高可维护性的 web 服务应用。</p>\
              </div>"
    }
});

$_("api").imports({
    Index: {
        map: { extend: {"from": "/home/Index"} }
    },
    Content: {
        map: { extend: {"from": "/start/Content"} }
    },
    Header: {
        xml: "<div id='header'>\
                  <h1>API</h1>\
                  <p>提供全面的框架七类接口索引以及描述，如文档中已有详细介绍的，则仅作简要说明，并给出相应的文档链接。</p>\
              </div>"
    }
});

$_("notfound").imports({
    Index: {
        xml: "<html id='index' xmlns:i='/home'>\
                <Head id='head'/>\
                <body id='body'>\
                    <Content id='content'/>\
                </body>\
              </html>",
        map: { extend: { "from": "/home/Index", css: 'r' } },
    },
    Head: {
        xml: "<head id='head'>\
                <meta charset='utf-8'/>\
                <title id='title'>xmlplus · 页面未找到</title>\
                <style id='style'/>\
              </head>",
        fun: function (sys, items, opts) {
            sys.title.text("xmlplus · " + opts.title);
            return { style: sys.style.text };
        }
    },
    Content: {
        xml: "<script src='http://www.qq.com/404/search_children.js' charset='utf-8'/>",
        fun: function (sys, items, opts) {
            this.watch("enter", (e, r) => this.trigger("complete", r), -1);
        }
    }
});

}).startup("//xp/Index");