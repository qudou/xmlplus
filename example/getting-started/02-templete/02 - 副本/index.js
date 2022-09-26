xmlplus("xp", function (xp, $_) {	
    $_().imports({
        Index: {
            css: "#text { color: red; }",
            xml: "<h1 id='text'>hello, world</h1>",
            fun: function (sys, items, opts) {
                sys.text.css("font-size", "28px");
                let doc = xp.parseXML("<dxx tx='30' b:a='xxx'/>");
				//var nameStartChar = /[A-Z_a-z\xC0-\xD6\xD8-\xF6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]///\u10000-\uEFFFF
                var nameStartChar = /[A-Z_a-z]///\u10000-\uEFFFF
				//var nameChar = new RegExp("[\\-\\.0-9" + nameStartChar.source.slice(1,-1) + "\\u00B7\\u0300-\\u036F\\u203F-\\u2040]");
				var nameChar = new RegExp("[\\-\\.0-9" + nameStartChar.source.slice(1,-1) + "]");
				var Name = new RegExp(nameStartChar.source + nameChar.source + '*');
				var S = /[\x20\x09\x0D\x0A]/;
				var Eq = new RegExp(`${S.source}*=${S.source}*`);
				var EntityRef = new RegExp(`&${Name.source};`);
				var CharRef = /&#[0-9];|&#x[0-9a-fA-F]+;/;
				var Reference = new RegExp(`${EntityRef.source}|${CharRef.source}`);
				//var AttValue = new RegExp(`"([^<&"]|${Reference.source})*"|'([^<&']|${Reference.source})*'`);
				var Char = /[#x09\x0A\x0D\x20-\xD7FF\xE000-\xFFFD]/ // \x10000-\x10FFFF
				
				// Comment	   ::=   	'<!--' ((Char - '-') | ('-' (Char - '-')))* '-->'
				var Comment = new RegExp(`<!--(${Char.source}*?)-->`);
				function parseComment(source) {
					var re = Comment.exec(source);
					var comment = re[0];
					if (re[1].indexOf("--") > -1)
						throw Error("Comment can't contain --");
					console.log("comment", comment);
					return source.substr(re[0].length);
				}

				// 	CDSect	   ::=   	CDStart CData CDEnd
                //  CDStart	   ::=   	'<![CDATA['
                //  CData	   ::=   	(Char* - (Char* ']]>' Char*))
                //  CDEnd	   ::=   	']]>'
				var CDSect = new RegExp(`<!\\[CDATA\\[(${Char.source}*?)\\]\\]>`);
				function parseCDSect(source) {
					var re = CDSect.exec(source);
					var cdata = re[0];
					console.log("cdata", cdata);
					return source.substr(re[0].length);
				}
				
				// CharData	   ::=   	[^<&]* - ([^<&]* ']]>' [^<&]*)
				var CharData = /[^<&]*/;
				function parseCharData(source) {
					var re = CharData.exec(source);
					var charData = re[0];
					if (charData.indexOf(']]>') > -1)
						throw new Error("charData can't contain ]]>");
					console.log("charData", charData);
					return source.substr(re[0].length);
				}
				
				function parseContent(source) {
					if (source.substr(0, 4) == '<!--')
						source = parseComment(source);
					else if (source.substr(0, 9) == '<![CDATA[')
						source = parseCDSect(source);
					else if (source.substr(0, 2) == '</')
						return source;
					else if (source.charAt(0) == '<') {
					    source = parseETagStart(source);
					} else {
					    source = parseCharData(source);
					}
					return parseContent(source);
				}
				
				var ElemTagStart = new RegExp(`<(([a-z]+):)?(${Name.source})([^]*?)${S.source}*(/>|>)`);
				function parseETagStart(source) {
					var re = ElemTagStart.exec(source);
					var prefix = re[2];
				    var localName = re[3];
				    var nodeName = prefix ? `${prefix}:${localName}` : localName;
				    var attributes = re[4];
					var end = re[5];
					parseAttrs(attributes);
				    console.log("ElemTagStart", re[0]);
					source = source.substr(re[0].length);
					if (end == '/>')
						return source;
					source = parseContent(source);
				    return parseETagEnd(source);
				}
				
				var ElemTagEnd = new RegExp(`</(([a-z]+):)?(${Name.source})>`);;
				function parseETagEnd(source) {
					var re = ElemTagEnd.exec(source);
					console.log("ElemTagEnd", re[0]);
					return source.substr(re[0].length);
				}
				
				var AttValue = new RegExp(`"([^<&"]*)"|'([^<&']*)'`);
			    var Attribute = new RegExp(`${S.source}+(([a-z]+):)?(${Name.source})${Eq.source}${AttValue.source}`, 'g');
				function parseAttrs(source) {
					let re;
					while((re = Attribute.exec(source)) !== null) {
						var prefix = re[2];
				        var localName = re[3];
				        var nodeName = prefix ? `${prefix}:${localName}` : localName;
						console.log("attribute", re[0]);
					}
				}

				let str = '<i:node xmlns:i="hello" k="great" ><!--hello, world-->weh<h2>wegood</h2>cat<![CDATA[mygod]]>gwei<h1/></i:node>';
				parseETagStart(str);
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