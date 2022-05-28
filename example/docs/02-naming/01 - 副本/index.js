xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
           css: "#dog { color: red; }\
                 #cat { color: blue; }",
           xml: "<div>\
                     <h1 id='dog'>dog</h1>\
                     <h1 id='cat'>cat</h1>\
                 </div>",
           ali: { animal: "/div" },
           fun: function (sys, items, opts) {
               console.log(sys.dog.text());
               console.log(sys.cat.text());
               sys.animal[0].css("border", "1px solid red");
           }
        }
    });
});