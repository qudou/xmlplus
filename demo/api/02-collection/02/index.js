xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Example: {
           xml: "<div id='example'>\
                     <h1 id='dog'>dog</h1>\
                     <h1 id='cat'>cat</h1>\
                 </div>",
           fun: function ( sys, items, opts ) {
               var children = sys.example.children(); // 函数 children 返回系统对象集
               var objects = children.hash();         // 函数 hash 返回包含键值对集合的普通对象
               for ( var key in objects ) {
                   console.log(key);                  // 会依次打印出 dog、cat
               }
           }
        }
    });
});