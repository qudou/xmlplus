xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            css: "#index { width: 640px; height: 480px; box-sizing: border-box; border: 1px solid blue; }\
                  #left0, #right0, #left1, #right1 { width: 100%; height: 100%; background: #AAA; }",
            xml: "<HDividedBox id='index'>\
                      <VDividedBox percent='30'>\
                          <div id='left0'/><div id='right0'/>\
                      </VDividedBox>\
                      <VDividedBox percent='30'>\
                          <div id='left1'/><div id='right1'/>\
                      </VDividedBox>\
                  </HDividedBox>"
        },
        VDividedBox: {
            css: "#vbox { position:relative; width:100%; height:100%; box-sizing: border-box; }\
                  #top { top: 0; height: 30%; } #bottom { bottom: 0; height: calc(70% - 5px); }\
                  #top,#bottom { left: 0; right: 0; position: absolute; }\
                  #handle { height: 5px; width: 100%; position:absolute; left:0; top: 30%; z-index:11; cursor:row-resize; }\
                  #mask { width: 100%; height: 100%; position: absolute; display: none; z-index: 10; }",
            xml: "<div id='vbox'>\
                    <div id='top'/>\
                    <div id='handle' draggable='true'/>\
                    <div id='bottom'/>\
                    <div id='mask'/>\
                  </div>",
            map: { format: {"int": "percent"}, appendTo: "top" }, 
            fun: function (sys, items, opts) {
                var percent = 50;
                sys.handle.on("dragstart", function (e) {
                    sys.mask.show();
                    sys.vbox.on("dragover", dragover);
                });
                sys.vbox.on("dragend", function (e) {
                    sys.mask.hide();
                    e.stopPropagation();
                    sys.vbox.off("dragover", dragover);
                });
                function dragover(e) {
                    e.preventDefault();
                    setPercent((e.pageY - sys.vbox.offset().top) / sys.vbox.height() * 100);
                }
                function setPercent(value) {
                    sys.handle.css("top", value + "%");
                    sys.top.css("height", value + "%");
                    sys.bottom.css("height", "calc(" + (100 - value) + "% - 5px)");
                }
                setPercent(opts.percent || percent);
                sys.bottom.elem().appendChild(this.last().elem());
                return Object.defineProperty({}, "percent", {get: () => {return percent}, set: setPercent});
            }
        },
        HDividedBox: {
            css: "#hbox { position:relative; width:100%; height:100%; box-sizing: border-box; }\
                  #left { left: 0; width: 40%;} #right { right: 0; width: calc(60% - 5px);}\
                  #left,#right { bottom: 0; top: 0; position: absolute; }\
                  #handle { width: 5px; height: 100%; position:absolute; top:0; left: 40%; z-index: 11; cursor:col-resize; }\
                  #mask { width: 100%; height: 100%; position: absolute; display: none; z-index: 10; }",
            xml: "<div id='hbox'>\
                    <div id='left'/>\
                    <div id='handle' draggable='true'/>\
                    <div id='right'/>\
                    <div id='mask'/>\
                  </div>",
            map: { format: {"int": "percent"}, appendTo: "left" }, 
            fun: function ( sys, items, opts ) {
                var percent = 50;
                sys.handle.on("dragstart", function (e) {
                    sys.mask.show();
                    sys.hbox.on("dragover", dragover);
                });
                sys.hbox.on("dragend", function (e) {
                    sys.mask.hide();
                    e.stopPropagation();
                    sys.hbox.off("dragover");
                });
                function dragover(e) {
                    e.preventDefault();
                    setPercent((e.pageX - sys.hbox.offset().left) / sys.hbox.width() * 100);
                }
                function setPercent(value) {
                    percent = value;
                    sys.handle.css("left", value + "%");
                    sys.left.css("width", value + "%");
                    sys.right.css("width", "calc(" + (100 - value) + "% - 5px)");
                }
                setPercent(opts.percent || percent);
                sys.right.elem().appendChild(this.last().elem());
                return Object.defineProperty({}, "percent", {get: () => {return percent}, set: setPercent});
            }
        }
    });
});