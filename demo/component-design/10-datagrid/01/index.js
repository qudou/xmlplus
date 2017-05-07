xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            css: "#index { font-family: Helvetica Neue, Arial, sans-serif; font-size: 14px; color: #444; }\
                  #search { margin: 8px 0; }",
            xml: "<div id='index' xmlns:i='datagrid'>\
                    Search <input id='search'/>\
                    <i:DataGrid id='datagrid'/>\
                  </div>",
            fun: function (sys, items, opts) {
                items.datagrid.val({
                    gridColumns: ['name', 'power'],
                    gridData: [
                      { name: 'Chuck Norris', power: Infinity },
                      { name: 'Bruce Lee', power: 9000 },
                      { name: 'Jackie Chan', power: 7000 },
                      { name: 'Jet Li', power: 8000 }
                    ]
                });
                sys.search.on("input", e => items.datagrid.filter(sys.search.prop("value")));
            }
        }
    });
    $_("datagrid").imports({
        DataGrid: {
            css: "#datagrid { border: 2px solid #42b983; border-radius: 3px; background-color: #fff; }\
                  #datagrid th { background-color: #42b983; color: rgba(255,255,255,0.66); cursor: pointer; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }\
                  #datagrid td { background-color: #f9f9f9; }\
                  #datagrid th, #datagrid td { min-width: 120px; padding: 10px 20px; }",
            xml: "<table id='datagrid'>\
                    <Thead id='thead'/>\
                    <Tbody id='tbody'/>\
                    <Sort id='sort'/>\
                    <Filter id='filter'/>\
                  </table>",
            fun: function (sys, items, opts) {
                var data = [];
                function setValue(value) {
                    data = value;
                    items.thead(data.gridColumns);
                    items.tbody(data.gridColumns, data.gridData);
                }
                function filter(filterKey) {
                    sys.datagrid.notify("filter", filterKey);
                }
                this.on("update", e => items.tbody(data.gridColumns, items.filter(items.sort(data.gridData))));
                return { val: setValue, filter: filter };
            }
        },
        Thead: {
            xml: "<thead id='thead'>\
                     <tr id='tr'/>\
                  </thead>",
            fun: function (sys, items, opts) {
                return function (data) {
                    sys.tr.children().call("remove");
                    data.forEach(item => sys.tr.append("Th").value()(item));
                }
            }
        },
        Tbody: {
            xml: "<tbody id='tbody'/>",
            fun: function (sys, items, opts) {
                return function (gridColumns, gridData) {
                    sys.tbody.children().call("remove");
                    gridData.forEach(data => {
                        tr = sys.tbody.append("tr");
                        gridColumns.forEach(key => tr.append("td").text(data[key]));
                    });
                };
            }
        },
        Th: {
            css: "#active { color: #fff; } #active #arrow { opacity: 1; } #active #key { color: #fff; }\
                  #arrow { display: inline-block; vertical-align: middle; width: 0; height: 0; margin-left: 5px; opacity: 0.66; }\
                  #asc { border-left: 4px solid transparent; border-right: 4px solid transparent; border-bottom: 4px solid #fff;}\
                  #dsc { border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 4px solid #fff; }",
            xml: "<th id='th'>\
                    <span id='key'/><span id='arrow'/>\
                  </th>",
            fun: function (sys, items, opts) {
                var order = "#asc";
                this.watch("sort", function (e, key, order) {
                    sys.key.text().toLowerCase() == key || sys.th.removeClass("#active");
                });
                this.on("click", function (e) {
                    sys.th.addClass("#active");
                    sys.arrow.removeClass(order);
                    order = order == "#asc" ? "#dsc" : "#asc";
                    sys.arrow.addClass(order).notify("sort", [sys.key.text().toLowerCase(), order]);
                });
                sys.arrow.addClass("#asc");
                return sys.key.text;
            }
        },
        Tr: {
            xml: "<tr id='tr'/>",
            fun: function (sys, items, opts) {
                return function (obj) {
                    sys.tr.children().call("remove");
                    for (var key in obj) 
                        sys.tr.append("td").text(obj[key]);
                };
            }
        },
        Sort: {
            fun: function (sys, items, opts) {
                var sortKey, sortOrder;
                this.watch("sort", function (e, key, order) {
                    sortKey = key, sortOrder = order;
                    this.trigger("update");
                });
                return function (data) {
                    return sortKey ? data.slice().sort(function (a, b) {
                        a = a[sortKey], b = b[sortKey];
                        return (a === b ? 0 : a > b ? 1 : -1) * (sortOrder == "#asc" ? 1 : -1);
                    }) : data;
                };
            }
        },
        Filter: {
            fun: function (sys, items, opts) {
                var filterKey = "";
                this.watch("filter", function (e, key) {
                    filterKey = key.toLowerCase();
                    this.trigger("update");
                });
                return function (data) {
                    return data.filter(function (row) {
                        return Object.keys(row).some(function (key) {
                            return String(row[key]).toLowerCase().indexOf(filterKey) > -1;
                        });
                    });
                };
            }
        }
    });
});