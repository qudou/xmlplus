xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<Tree id='tree' xmlns='tree'/>",
            fun: function (sys, items, opts) {
                items.tree({
                    name: 'My Tree',
                    children: [
                        { name: 'hello' },
                        { name: 'world' },
                        { name: 'child folder', children: [{ name: 'alice' }]}
                    ]
                });
            }
        }
    });
    $_("tree").imports({
        Tree: {
            css: "#tree { font-family: Menlo, Consolas, monospace; color: #444; }\
                  #tree, #tree ul { padding-left: 1em; line-height: 1.5em; list-style-type: dot; }",
            xml: "<ul id='tree'>\
                    <Item id='item'/>\
                  </ul>",
            fun: function (sys, items, opts) {
                return items.item;
            }
        },
        Item: {
            css: "#item { cursor: pointer; }",
            xml: "<li id='item'>\
                    <div id='content'>\
                      <span id='neme'/><span id='expand'/>\
                    </div>\
                    <ul id='children'>\
                      <li id='add'>+</li>\
                    </ul>\
                  </li>",
            map: { defer: "children" },
            fun: function (sys, items, opts) {
                var data, open;
                sys.item.on("click", "//*[@id='add']", function () {
                    var stuff = {name: 'new stuff'};
                    data.children.push(stuff);
                    sys.add.before("Item").value()(stuff);
                });
                sys.expand.on("click", function () {
                    open = !open;
                    sys.expand.text(open ? " [-]" : " [+]");
                    open ? (sys.children.show() && load()) : sys.children.hide();
                });
                function load() {
                    if ( sys.children.children().length == 1 )
                      for ( var item of data.children )
                        sys.add.before("Item").value()(item);
                }
                return function (value) {
                    data = value;
                    sys.neme.text(data.name);
                    data.children && data.children.length && sys.expand.show().text(" [+]");
                };
            }
        }
    });
});