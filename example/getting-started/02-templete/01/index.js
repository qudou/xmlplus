const xmlplus = require("xmlplus");
xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            fun: function (sys, items, opts) {
                console.log("hello, world!");
            }
        }
    });
}).startup("//xp/Index");