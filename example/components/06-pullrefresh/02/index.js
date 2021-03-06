xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            css: "html,body { width: 100%; height: 100%; margin: 0; padding: 0; text-align: center; user-select: none; }",
            xml: "<PullRefresh id='index'>\
                     <h1>Twitter</h1>\
                     <h2>Loren Brichter</h2>\
                  </PullRefresh>",
            fun: function (sys, items, opts) {
                this.on("ready", () => {
                    setTimeout(() => sys.index.trigger("complete"), 3000);
                });
            }
        },
        PullRefresh: {
            css: "#refresh { position: relative; height: 100%; cursor: pointer; overflow-y: hidden; }\
                  #page { height: 100%; transform: translateY(0); }\
                  #status, #content { transform: translateY(-40px); } #content { height: 100%; }",
            xml: "<div id='refresh' xmlns:i='pullrefresh'>\
                    <div id='page'>\
                        <i:Status id='status'/>\
                        <div id='content'></div>\
                    </div>\
                  </div>",
            map: { "appendTo": "content", "nofragment": true },
            fun: function (sys, items, opts) {
                var startY, translateY;
                sys.page.on("touchstart", function (e) {
                    startY = e.targetTouches[0].pageY;
                    translateY = parseInt(sys.page.css("transform").match(/\d+/)[0]);
                    sys.page.on("touchmove", touchmove).on("touchend", touchend).css("transition", "");
                });
                function touchmove(e) {
                    var offset = e.targetTouches[0].pageY - startY;
                    if ( offset > 0 ) {
                        sys.page.css("transform", "translateY(" + (offset + translateY) + "px)");
                        if (items.status.value != "release")
                            items.status.value = offset > 40 ? "release" : "pull";
                    }
                }
                function touchend(e) {
                    var offset = e.changedTouches[0].pageY - startY;
                    sys.page.off("touchmove").off("touchend").css("transition", "all 0.3s ease-in 0s");
                    if ( items.status.value == "loading" ) {
                        sys.page.css("transform", "translateY(40px)");
                    } else if ( offset < 40 ) {
                        sys.page.css("transform", "translateY(0)");
                    } else {
                        release();
                    }
                }
                function release() {
                    items.status.value = "loading";
                    sys.refresh.once("complete", () => {
                        items.status.value = "success";
                        setTimeout(e => {
                            sys.page.css("transform", "translateY(0)").once("webkitTransitionEnd", e => items.status.value = "pull");
                        }, 300);
                    });
                    sys.page.css("transform", "translateY(40px)").trigger("ready");
                }
            }
        }
    });
    $_("pullrefresh").imports({
        Status: {
            css: "#statusbar { height: 2.5em; line-height: 2.5em; text-align: center; }",
            xml: "<ViewStack id='statusbar'>\
                    <span id='pull'>Pull to refresh...</span>\
                    <span id='release'>Release to refresh...</span>\
                    <Release id='loading'>Loading...</Release>\
                    <span id='success'>Loading success</span>\
                  </ViewStack>",
            fun: function (sys, items, opts) {
                var status = "pull";
                function getValue() {
                    return status;
                }
                function setValue(value) {
                    sys.statusbar.trigger("switch", status = value);
                }
                return Object.defineProperty({}, "value", {get: getValue, set: setValue});
            }
        },
        Release: {
            css: "#loader { display: inline-block; position: relative; height: 2.5em; line-height: 2.5em; }\
                  #spinner { width: 1.2em; height: 1.2em; position: absolute; top: .7em; }\
                  #label { display: inline-block; font-size: 0.75em; margin: 0 0 0 2em; }",
            xml: "<div id='loader'>\
                    <Spinner id='spinner'/><span id='label'/>\
                  </div>",
            map: { appendTo: "label" }
        },
        Spinner: {
            css: "#loader { width: 1.5em; height: 1.5em; animation: spin 1s linear infinite; -webkit-animation: spin 1s linear infinite; }\
                  @keyframes spin {0% {transform: rotate(0deg);} 100% {transform: rotate(360deg); } }\
                  @-webkit-keyframes spin {0% {-webkit-transform: rotate(0deg);} 100% {-webkit-transform: rotate(360deg); } }",
            xml: "<svg id='loader' width='48' height='48' viewBox='0 0 1024 1024'>\
                    <path d='M512.151961 3.978614l-0.308015 0c-21.655206 0-39.162952 17.479093-39.162952 39.021735l0 238.350526c0 21.61939 17.507746 39.098483 39.162952 39.098483l0.308015 0c21.655206 0 39.163975-17.479093 39.163975-39.098483L551.315936 43.001373C551.316959 21.457708 533.807167 3.978614 512.151961 3.978614z'/>\
                    <path d='M373.688399 316.033793 205.552028 148.214646c-15.474436-15.409968-40.547485-15.409968-56.057737 0-15.436574 15.486716-15.436574 40.478923 0 55.964616l168.174234 167.82017c15.434527 15.408945 40.546461 15.408945 56.018851 0C389.162836 356.512716 389.162836 331.519486 373.688399 316.033793z'/>\
                    <path d='M281.307386 440.070784 43.520701 440.070784c-21.886473 0-39.625486 17.71036-39.625486 39.559994s17.739013 39.558971 39.625486 39.558971l237.786685 0c21.886473 0 39.663348-17.71036 39.663348-39.558971S303.193859 440.070784 281.307386 440.070784z'/>\
                    <path d='M370.273626 588.362178c-15.434527-15.409968-40.547485-15.409968-56.019875 0L146.115334 756.181325c-15.511275 15.485693-15.511275 40.554648 0 55.964616 15.474436 15.487739 40.547485 15.487739 56.059783 0l168.098509-167.819147C385.785925 628.91785 385.785925 603.848894 370.273626 588.362178z'/>\
                    <path d='M512.017908 638.798894c-21.922289 0-39.663348 17.709337-39.663348 39.557948l0 237.352803c0 21.850657 17.740036 39.558971 39.663348 39.558971 21.88852 0 39.626509-17.709337 39.626509-39.558971L551.644417 678.356842C551.644417 656.508231 533.906427 638.798894 512.017908 638.798894z'/>\
                    <path d='M877.377106 756.248863 709.239711 588.428693c-15.473413-15.485693-40.583301-15.485693-56.05876 0-15.473413 15.410991-15.473413 40.479947 0 55.889915l168.137395 167.818123c15.473413 15.488763 40.584324 15.488763 56.05876 0C892.850519 796.72574 892.850519 771.656785 877.377106 756.248863z'/>\
                    <path d='M978.390731 440.070784 742.408135 440.070784c-21.694091 0-39.317471 17.709337-39.317471 39.559994 0 21.848611 17.623379 39.558971 39.317471 39.558971l235.982596 0c21.694091 0 39.316447-17.71036 39.316447-39.558971C1017.707179 457.780121 1000.085846 440.070784 978.390731 440.070784z'/>\
                    <path d='M864.81193 158.775166c-14.820544-14.795984-38.780235-14.795984-53.562916 0L650.638035 319.082222c-14.744819 14.719236-14.744819 38.639019 0 53.435003 14.820544 14.719236 38.779212 14.719236 53.524031 0l160.649863-160.306033C879.554702 197.415208 879.554702 173.495426 864.81193 158.775166z'/>\
                  </svg>"
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
                    ptr.trigger("hide", [to+''].concat(args)).hide();
                    ptr = table[to].trigger("show", [ptr+''].concat(args)).show();
                });
                return Object.defineProperty({}, "selected", { get: function() {return ptr}});
            }
        }
    });
});