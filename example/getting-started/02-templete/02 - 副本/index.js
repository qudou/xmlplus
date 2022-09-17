xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            css: "#text { color: red; }",
            xml: "<h1 id='text'>hello, world</h1>",
            fun: function (sys, items, opts) {
                sys.text.css("font-size", "28px");
                let doc = xp.parseXML("<dxx/>");
                console.time();
                for (let i = 0; i < 1000000; i++)
                    doc.createElement("doo");
                console.timeEnd();
                console.time();
                for (let i = 0; i < 1000000; i++) {
                    doc.createElement3("doo");
                }
                console.timeEnd();
                console.time();
                for (let i = 0; i < 1000000; i++) {
                    doc.createElement2("doo");
                }
                console.timeEnd();
            }
        }
    });
});

// Shape - superclass
function Shape() {
    this.x = 0;
    this.y = 0;
  }
  
  // superclass method
  Shape.prototype.move = function(x, y) {
    this.x += x;
    this.y += y;
    console.info('Shape moved.');
  };
  
  // Rectangle - subclass
  function Rectangle() {
    Shape.call(this); // call super constructor.
  }
  
  // subclass extends superclass
  Rectangle.prototype = Object.create(Shape.prototype);
  
  //If you don't set Rectangle.prototype.constructor to Rectangle,
  //it will take the prototype.constructor of Shape (parent).
  //To avoid that, we set the prototype.constructor to Rectangle (child).
  Rectangle.prototype.constructor = Rectangle;
  
  const rect = new Rectangle();
  
  console.log('Is rect an instance of Rectangle?', rect instanceof Rectangle); // true
  console.log('Is rect an instance of Shape?', rect instanceof Shape); // true
  rect.move(1, 1); // Outputs, 'Shape moved.'

  function Shape2() {}

  Shape2.prototype.__proto__ = {age: 99};

  let s2 = new Shape2()
  console.log(s2.age);