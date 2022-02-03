xmlplus("xp", function (xp, $_) {
    $_().imports({
        Example: {
            fun: function(sys, items, opts) {
                function sayHello() {
                    console.log(sys, items, "hello");
                }
                return { sayHello: sayHello };
            }
        }
    });
});
xmlplus.create("//xp/Example").sayHello(); // null null hello