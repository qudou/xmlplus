/*!
 * xmlplus.js v1.5.18
 * http://xmlplus.cn
 * (c) 2009-2017 qudou
 * Released under the MIT license
 */
 (function (isInBrowser, undefined) {
"use strict";
  var ELEMENT_NODE                = 1;
//var ATTRIBUTE_NODE              = 2;
//var TEXT_NODE                   = 3;
//var CDATA_SECTION_NODE          = 4;
//var ENTITY_REFERENCE_NODE       = 5;
//var ENTITY_NODE                 = 6;
//var PROCESSING_INSTRUCTION_NODE = 7;
//var COMMENT_NODE                = 8;
//var DOCUMENT_NODE               = 9;
  var DOCUMENT_TYPE_NODE          = 10;
//var DOCUMENT_FRAGMENT_NODE      = 11;
//var NOTATION_NODE               = 12;

var WELL = /#(?=([^}])+?{)/ig;
var svgns = "http://www.w3.org/2000/svg";
var htmlns = "http://www.w3.org/1999/xhtml";
var xlinkns = "http://www.w3.org/1999/xlink";
var xdocument, $document, XPath, DOMParser_, XMLSerializer_, NodeElementAPI;
var Manager = [HtmlManager(),CompManager(),,TextManager(),TextManager(),,,,TextManager(),,];
var Formater = { "int": parseInt, "float": parseFloat, "bool": new Function("v","return v==true || v=='true';") };
var Template = { css: "", cfg: {}, opt: {}, ali: {}, map: { share: "", defer: "", cfgs: {}, attrs: {}, format: {} }, fun: new Function };
var isReady, isSVG = {}, isHTML = {}, Paths = {}, Themes = {}, Source = {}, Library = {}, Original = {}, Store = {}, Extends = [], Global = {};

(function () {
    var i = -1, k = -1,
        s = "animate animateMotion animateTransform circle clipPath cursor defs desc discard ellipse feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feDistantLight feDropShadow feFlood feFuncA feFuncB feFuncG feFuncR feGaussianBlur feImage feMerge feMergeNode feMorphology feOffset fePointLight feSpecularLighting feSpotLight feTile feTurbulence filter foreignObject g hatch hatchpath image line linearGradient marker mask mesh meshpatch meshrow metadata mpath path pattern polygon polyline radialGradient rect set solidcolor stop svg switch symbol text textPath tspan unknown use view".split(" "),
        h = "a abbr acronym address applet area article aside audio b base basefont bdi bdo big blockquote body br button canvas caption center cite code col colgroup command datalist dd del details dfn dialog dir div dl dt em embed fieldset figcaption figure font footer form frame frameset h1 h2 h3 h4 h5 h6 head header hr html i iframe img input ins kbd keygen label legend li link main map mark menu menuitem meta meter nav noframes noscript object ol optgroup option output p param pre progress q rp rt rtc ruby s samp script section select small source span strike strong style sub summary sup table tbody td textarea tfoot th thead time title tr track tt u ul var video wbr xmp void".split(" ");
    while (h[++k]) isHTML[h[k]] = 1;
    while (s[++i]) isSVG[s[i]] = isHTML[s[i]] = 1;
}());

var $ = {
    startup: startup,
    create: function (path, options) {
        var widget = $.hasComponent(path);
        if (!widget) $.error("component [" + path + "] not exists");
        return widget.fun(null, null, options);
    },
    guid: (function () {
        var counter = 0;
        function intToABC( num ) {
           var ch = String.fromCharCode(97 + num % 26);
           return num < 26 ? ch : intToABC(Math.floor(num / 26) - 1) + ch;
        }
        return function () {
            return intToABC(counter++);
        };
    }()),
    error: function (message) {
        throw new Error(message);
    },
    ready: function (callback) {
        if ( isReady ) return callback($);
        var t = setInterval(function() {
            if ( isReady )
                clearInterval(t), callback($);
        }, 0);
    },
    type: (function () {
        var i, class2type = {},
            types = "Boolean Number String Function Array Date RegExp Object Error".split(" ");
        for ( i = 0; i < types.length; i++ )
            class2type[ "[object " + types[i] + "]" ] = types[i].toLowerCase();
        return function( obj ) {
             return obj == null ? obj + "" : class2type[class2type.toString.call(obj)] || "object";
        };
    }()),
    isArray: Array.isArray || function (obj) {
        return obj instanceof Array
    },
    isWindow: function (obj) {
        return obj != null && obj == obj.window;
    },
    isFunction: function (obj) {
        return $.type(obj) == "function";
    },
    isNumeric: function (obj) {
        var type = $.type( obj );
        return ( type === "number" || type === "string" ) && !isNaN( obj - parseFloat( obj ) );
    },
    isPlainObject: function (obj) {
        return $.type(obj) == "object" && !$.isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype;
    },
    isEmptyObject: function (obj) {
        var name;
        for ( name in obj ) return false;
        return true;
    },
    isSystemObject: function (obj) {
        return obj && typeof obj.guid == "function" && !!Store[obj.guid()];
    },
    each: function (objs, callback) {
        var i, key;
        if ( hp.likeArray( objs ) ) {
            for ( i = 0; i < objs.length; i++ )
                if ( callback.call(objs[i], i, objs[i]) === false ) break;
        } else for ( key in objs ) {
            if ( callback.call(objs[key], key, objs[key] ) === false ) break;
        }
        return objs;
    },
    extend: function () {
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[ 0 ] || {},
            i = 1,
            length = arguments.length,
            deep = false;
        if ( typeof target === "boolean" ) {
            deep = target;
            target = arguments[ i ] || {};
            i++;
        }
        if ( typeof target !== "object" && !$.isFunction( target ) ) {
            target = {};
        }
        if ( i === length ) {
            target = this;
            i--;
        }
        for ( ; i < length; i++ ) {
            if ( ( options = arguments[ i ] ) != null ) {
                for ( name in options ) {
                    src = target[ name ];
                    copy = options[ name ];
                    if ( target === copy ) {
                        continue;
                    }
                    if ( deep && copy && ( $.isPlainObject( copy ) ||
                        ( copyIsArray = $.isArray( copy ) ) ) ) {
                        if ( copyIsArray ) {
                            copyIsArray = false;
                            clone = src && $.isArray( src ) ? src : [];
                        } else {
                            clone = src && $.isPlainObject( src ) ? src : {};
                        }
                        target[ name ] = $.extend( deep, clone, copy );
                    } else if ( copy !== undefined ) {
                        target[ name ] = copy;
                    }
                }
            }
        }
        return target;
    },
    expand: function (obj) {
        for ( var name in obj )
            NodeElementAPI[name] && $.error("the api '" + name + "', already exists");
        $.extend(NodeElementAPI, obj), $.extend(CopyElementAPI, obj);
        $.extend(DeferElementAPI, obj), $.extend(ShareElementAPI, obj);
        return this;
    },
    parseXML: function (data) {
        var xml;
        if ( !data || typeof data !== "string" )
            return null;
        try {
            xml = ( new DOMParser_() ).parseFromString( data, "text/xml" );
        } catch ( e ) {
            xml = undefined;
        }
        if ( !xml || xml.getElementsByTagName( "parsererror" ).length )
            $.error( "Invalid XML: " + data );
        return xml;
    },
    serialize: function (node) {
        return (new XMLSerializer_).serializeToString(node, true);
    },
    hasNamespace: function (space) {
        return !!Library[space];
    },
    hasComponent: function (path) {
        if ( typeof path != "string" ) 
            return false;
        if ( isHTML[path] )
            return true;
        var s = ph.split(path);
        s.dir = s.dir.substr(2);
        return Library[s.dir] && Library[s.dir][s.basename] || false;
    },
    clearLibrary: function (space) {
        if ( typeof space != "string" )
            $.error("invalid space, expected a string");
        var patt = new RegExp("^" + space.substr(2));
        for ( var k in Library )
            if ( k.match(patt) ) {
                delete Library[k];
                delete Original[k];
            }
        return this;
    },
    getElementById: function (id, isGuid) {
        if ( isGuid ) 
            return Store[id] && Store[id].api;
        return isInBrowser ? (Global[id] || $document.getElementById(id)) : null;
    }
};

var ph = (function () {
    var table = {};
    function normalizeArray(parts, allowAboveRoot) {
        var i = parts.length - 1, up = 0;
        for ( ; i >= 0; i-- ) {
            var last = parts[i];
            if (last === '.')
                parts.splice(i, 1);
            else if (last === '..')
                parts.splice(i, 1), up++;
            else if (up)
                parts.splice(i, 1), up--;
        }
        if ( allowAboveRoot )
            for ( ; up--; up )
                parts.unshift('..');
        return parts;
    }
    function filter(xs) {
        var i = 0, res = [];
        for ( ; i < xs.length; i++ )
            xs[i] && res.push(xs[i]);
        return res;
    }
    function isAbsolute(path) {
        return path.charAt(0) === '/';
    }
    function normalize(path) {
        var absolute = isAbsolute(path),
            trailingSlash = path.substr(-1) === '/';
        path = normalizeArray(filter(path.split('/')), !absolute).join('/');
        if (!path && !absolute)
            path = '.';
        if (path && trailingSlash)
            path += '/';
        return (absolute ? '/' : '') + path;
    }
    function join(part1, part2) {
        var paths = [part1,part2];
        return normalize(filter(paths).join('/'));
    }
    function split(path) {
        var i = path.lastIndexOf('/');
        return { dir: path.substring(0, i), basename: path.substr(i+1).toLowerCase() };
    }
    function fullPath(dir, patt) {
        var key = dir + patt;
        if ( table[key] )
            return table[key];
        if ( patt.substr(0, 2) == "//" )
            return table[key] = patt.substr(2);
        return table[key] = isAbsolute(patt) ? join(dir.split('/')[0], patt.slice(1)) : join(dir, patt);
    }
    return { split: split, fullPath: fullPath };
}());

var hp = {
    likeArray: function (obj) {
        var length = !!obj && "length" in obj && obj.length,
            type = $.type( obj );
        if ( type === "function" || $.isWindow( obj ) )
            return false;
        return type === "array" || length === 0 ||
            typeof length === "number" && length > 0 && ( length - 1 ) in obj;
    },
    parseToXML: function (input, dir) {
        if ( input == null )
            $.error("invalid input, expected a string a xml node");
        if ( input.ownerDocument )
            return input;
        if ( typeof input != "string" )
            $.error("invalid input, expected a string or a xml node");
        if ( isHTML[input] )
            return xdocument.createElement(input);
        if ( input.charAt(0) == '<' ) try {
            return $.parseXML(input).lastChild;
        } catch (e) {
            return xdocument.createTextNode(input);
        }
        var i = input.lastIndexOf('/'),
            dir = ph.fullPath(dir || "", input.substring(0, i) || "."),
            basename = input.substr(i+1);
        if ( Library[dir] && Library[dir][basename.toLowerCase()] )
            return xdocument.createElementNS("//" + dir, 'i:' + basename);
        return xdocument.createTextNode(input);
    },
    defDisplay: (function () {
        var elemDisplay = {};
        return function ( nodeName ) {
            var elem, display;
            if (!elemDisplay[nodeName]) {
                elem = $document.createElement(nodeName);
                $document.body.appendChild(elem);
                display = getComputedStyle(elem, "").getPropertyValue("display");
                elem.parentNode.removeChild(elem);
                display == "none" && (display = "block");
                elemDisplay[nodeName] = display;
            }
            return elemDisplay[nodeName];
        };
    }()),
    offsetParent: function (elem) {
        var parent = elem.offsetParent;
        while ( parent && hp.css(parent, "position") == "static" )
            parent = parent.offsetParent;
        return parent || $document.documentElement; 
    },
    offset: function (elem) {
        var obj = elem.getBoundingClientRect();
        return {
            left: obj.left + pageXOffset,
            top: obj.top + pageYOffset
        };
    },
    css: function (elem, name) { 
        return elem.style[name] || getComputedStyle(elem, "").getPropertyValue(name);
    },
    callback: function () {
        var ret = this.fn.apply(this.data, [].slice.call(arguments));
        return ret == this.data ? this.api : ret;
    },
    build: (function () {
        var table = [], objects = [];
        return function ( data, object ) {
            var api = {},
                k = objects.indexOf(object),
                keys = table[k] || (objects.push(object) && table[table.push(Object.keys(object))-1]);
            for ( k = 0; k < keys.length; k++ )
                api[keys[k]] = hp.callback.bind({fn: object[keys[k]], data: data, api: api});
            return api;
        }
    }()),
    create: function (item) {
        item.api || (item.api = item.back = hp.build(item, item.typ > 1 ? TextElementAPI : NodeElementAPI));
        return item;
    },
    elem: function () {
        return this.ele || Store[this.xml.lastChild.uid].elem();
    },
    appendTo: function () {
        if ( this.ele ) return this.ele;
        var target = this.fdr.sys[this.map.appendTo];
        return target && target.elem() || Store[this.xml.lastChild.uid].elem();
    },
    createElement: (function() {
        var buffer = {};
        return function ( node, parent ) {
            var nodeName = node.nodeName;
            buffer[nodeName] || (buffer[nodeName] = $document.createElementNS(isSVG[nodeName] ? svgns : (isHTML[nodeName] ? htmlns : node.namespaceURI), nodeName));
            var elem = buffer[nodeName].cloneNode();
            parent.appendChild(elem);
            for ( var i = 0; i < node.attributes.length; i++ ) {
                var attr = node.attributes[i];
                if ( attr.prefix == "xlink" )
                    elem.setAttributeNS(xlinkns, attr.nodeName, attr.nodeValue);
                if (  attr.nodeName != "id" && (!isHTML[nodeName] || !attr.prefix) )
                    elem.setAttribute(attr.nodeName, attr.nodeValue);
            }
            return elem;
        };
    }()),
    nodeIsMatch: function (xml, expr, node) {
        var i = XPath.select(expr, xml);
        return [].slice.call(i).indexOf(node) != -1
    },
    xpathQuery: function (expr, xml) {
        var nodes = [],
            evaluator = new XPathEvaluator,
            result = evaluator.evaluate(expr, xml, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if ( result )
            for ( var i = 0, len = result.snapshotLength; i < len; i++)
                nodes.push(result.snapshotItem(i));
        return nodes;
    },
    parseHTML: function parse(node) {
        if ( node.nodeType != ELEMENT_NODE ) return;
        if ( isHTML[node.nodeName.toLowerCase()] ) {
            for ( var k in node.childNodes )
                parse(node.childNodes[k]);
        } else {
            var xml = $.serialize(node).replace(/(<\/?\w:)((\w|\d)+)/ig, function (s, prefix, localName) {
                return prefix.toLowerCase() + localName;
            });
            var id = node.getAttribute("id"),
                val = startup(xml, node.parentNode);
            id && (Global[id] = val) && val.attr("id", id);
            node.parentNode.replaceChild(node.parentNode.lastChild, node);
        }
    },
    ready: isInBrowser && (function () {
        var fn = [], d = document,
            ie = !!(window.attachEvent && !window.opera),
            wk = /webkit\/(\d+)/i.test(navigator.userAgent) && (RegExp.$1 < 525),
            run = function () { for (var i = 0; i < fn.length; i++) fn[i](); };
        return function ( f ) {
            if ( !ie && !wk && d.addEventListener )
                return d.addEventListener('DOMContentLoaded', f, false);
            if (fn.push(f) > 1) return;
            if ( ie ) {
                (function ff() {
                    try { d.documentElement.doScroll('left'); run(); }
                    catch (err) { setTimeout(ff, 0); }
                })();
            } else if ( wk ) {
                var t = setInterval(function () {
                    if (/^(loaded|complete)$/.test(d.readyState))
                        clearInterval(t), run();
                }, 0);
            }
        };
    })()
};

$.extend(hp, (function () {
    function assert(obj) {
        typeof obj.css == "string" || $.error("invalid css, expected a string");
        typeof obj.fun == "function" || $.error("invalid fun, expected a function");
        ["opt","cfg","map","ali"].forEach(function (k) {
            $.isPlainObject(obj[k]) || $.error("invalid " + k + " expected a plainObject");
        });
        ["format","cfgs","attrs"].forEach(function (k) {
            $.isPlainObject(obj.map[k]) || $.error("invalid " + k + " in map, expected a plainObject");
        });
        typeof obj.map.defer == "string" || $.error("invalid defer in map, expected a string");
        typeof obj.map.share == "string" || $.error("invalid share in map, expected a string");
        typeof obj.xml == "string" || typeof obj.xml == "undefined" || $.error("invalid xml, expected a undefined value or a string");
    }
    function resetInput(item) {
        for ( var key in item ) {
            if ( typeof item[key] != "string" ) 
                continue;
            var i, tmp, buf = {},
                list = item[key].split(' ');
            for ( i = 0; i < list.length; i++ ) {
                tmp = list[i].split("->");
                buf[tmp[0]] = tmp[1] || tmp[0];
            }
            item[key] = buf;
        }
    }
    function initialize(obj) {
        var i, formats = {}, map = obj.map;
        for ( i in map.format )
            Formater[i] && (formats[i] = obj.map.format[i].split(' '));
        map.format = formats;
        resetInput(map.attrs), resetInput(map.cfgs);
        map.defer = map.defer ? map.defer.split(' ') : [];
        map.share = map.share ? map.share.split(' ') : [];
        var root = obj.dir.split('/')[0];
        obj.css = obj.css.replace(/%@/g, Paths[root]);
        obj.xml = $.parseXML(obj.xml && obj.xml.replace(/%@/g, Paths[root]) || "<void/>");
    }
    function imports(obj, name, space) {
        Source[space][name] = obj;
        Library[space][name] = obj = $.extend(true, {}, Template, obj);
        $.release || assert(obj);
        Library[space][name] || console.warn(space + "/" + name + " already exists");
        obj.dir = space;
        obj.cid = $.guid();
        obj.the = obj.css.match(/%[-a-z]+/ig) || [];
        initialize(obj);
    }
    function source(dir, patt) {
        var s = ph.split(ph.fullPath(dir, patt));
        return Source[s.dir] && Source[s.dir][s.basename];
    }
    function component(dir, node) {
        var p = ph.fullPath(dir, node.namespaceURI || "");
        return Library[p] && Library[p][node.localName.toLowerCase()];
    }
    function extend(target, source) {
        var result = {},
            extend = target.map.extend;
        result.xml = target.xml || source.xml;
        ["opt","cfg","map"].forEach(function (key) {
            result[key] = (extend[key] == "r") ? target[key] : $.extend({}, source[key], target[key]);
        });
        if ( extend.fun == "r" || !source.fun ) {
            result.fun = target.fun;
        } else if ( !target.fun ) {
            result.fun = source.fun;
        } else {
            result.fun = function (sys, items, opts) {
                var foo = source.fun.call(this, sys, items, opts);
                var bar = target.fun.call(this, sys, items, opts);
                return bar ? $.extend(foo, bar) : foo;
            };
        }
        result.css = (extend.css == "r") ? target.css : (source.css || '') + (target.css || '');
        return result;
    }
    return { imports: imports, source: source, extend: extend, component: component };
}()));

var Collection = (function () {
    var emptyArray = [],
        fn = new Function,
        slice = emptyArray.slice,
        list = "every forEach indexOf map pop push shift some splice unshift".split(' ');
    fn.prototype = {
        length: 0,
        slice: function () {
            var result = new Collection,
                list = slice.apply(this, slice.call(arguments));
            for ( var i = 0; i < list.length; i++ )
                result.push(list[i]);
            return result;
        },
        hash: function () {
            var i = 0, table = {};
            for ( ; i < this.length; i++ )
                table[this[i]] = this[i];
            return table;
        },
        call: function (fnName) {
            if ( typeof fnName != "string" )
                $.error("invalid function name, expected a string");
            var args = slice.call(arguments).slice(1);
            for ( var i = 0; i < this.length; i++ )
                if( typeof this[i][fnName] == "function" )
                    this[i][fnName].apply(this[i], args);
            return this;
        },
        values: function () {
            var result = new Collection;
            for ( var i = 0; i < this.length; i++ )
                result.push(this[i].value());
            return result;
        }
    };
    for ( var i = 0; i < list.length; i++ )
        fn.prototype[list[i]] = emptyArray[list[i]];
    return fn;
}());

var Communication = function () {
    var table = {};
    function watch(type, fn, priority) {
        var list = table[type] = table[type] || [],
            priority = $.isNumeric(priority) ? priority : -Infinity,
            target = { source: this, fn: fn, priority: priority };
        var i = 0, len = list.length;
        for ( ; i < len; i++ ) 
            if ( priority > list[i].priority ) {
                list.splice(i, 0, target);
                break;
            }
        list.length == len && list.push(target);
        return this;
    }
    function glance(type, fn, priority) {
        function callback(e) {
            e.currentTarget.unwatch(type, callback);
            fn.apply(this, [].slice.call(arguments));
        }
        return this.api.watch(type, callback, priority);
    }
    function unwatch(type, fn) {
        var key, buf;
        if ( type == undefined ) {
            for ( key in table )
              unwatch.call(this, key);
        } else if ( typeof type == "function" ) {
            for ( key in table )
              unwatch.call(this, key, type);
        } else if ( fn == undefined ) {
            buf = [].slice.call(table[type] || []);
            for ( key in buf )
              if ( buf[key].source == this )
                table[type].splice(table[type].indexOf(buf[key]), 1);
        } else {
            buf = [].slice.call(table[type] || []);
            for ( key in buf )
              if ( buf[key].source == this && buf[key].fn == fn )
                table[type].splice(table[type].indexOf(buf[key]), 1);
        }
        return this;
    }
    function notify(type, data) {
        if ( !table[type] ) return;
        data = data == null ? [] : ($.isArray(data) ? data : [data]);
        for ( var i = 0; i < table[type].length; i++ )
            table[type][i].fn.apply(this.api, [{type: type, target: this.api, currentTarget: table[type][i].source.api}].concat(data));
        return this;
    }
    function remove(item) {
        for ( var type in table ) {
            var i, array = [];
            for ( i = 0; i < table[type].length; i++ )
                if ( table[type][i].source != item )
                    array.push(table[type][i]);
            table[type] = array;
        }
    }
    return { watch: watch, glance: glance, unwatch: unwatch, notify: notify, remove: remove };
};

var EventModuleAPI = (function () {
    var eventTable = {},
        ignoreProps = /^([A-Z]|returnValue$|layer[XY]$|keyLocation$)/,
        eventMethods = "preventDefault stopImmediatePropagation stopPropagation".split(" "),
        specialEvents={ click: "MouseEvents", mousedown: "MouseEvents", mouseup: "MouseEvents", mousemove: "MouseEvents" };
    function assert(type, selector, fn) {
        typeof type == "string" || $.error("invalid type, expected a string");
        typeof fn == "function" || $.error("invalid handler, expected a function");
        selector == undefined || typeof selector == "string" || $.error("invalid selector, expected a string");
    }
    function on(type, selector, fn) {
        if ( typeof selector == "function" )
            fn = selector, selector = undefined;
        assert(type, selector, fn);
        var uid = this.uid, listener = this.api;
        function handler( event ) {
            if ( !event.target.xmlTarget ) return;
            var e = createProxy(event, listener);
            if ( !selector )
                return fn.apply(listener, [e].concat(event.data));
            listener.find(selector).forEach(function(item) {
                if ( item.contains(e.target) )
                    fn.apply(item, [e].concat(event.data));
            });
        }
        this.elem().addEventListener(type, handler);
        eventTable[uid] = eventTable[uid] || {};
        eventTable[uid][type] = eventTable[uid][type] || []
        eventTable[uid][type].push({ selector: selector, fn: fn, handler: handler})
        return this;
    }
    function once(type, selector, fn) {
        var realCallback;
        if ( $.isFunction(fn) )
            realCallback = fn, fn = callback;
        else if ( $.isFunction(selector) )
            realCallback = selector, selector = callback;
        else 
            $.error("invalid handler, expected a function");
        function callback(e) {
            e.currentTarget.off(type, callback);
            realCallback.apply(this, [].slice.call(arguments));
        }
        return this.api.on(type, selector, fn);
    }
    function off(type, selector, fn) {
        var k, elem = this.elem(),
            item = eventTable[this.uid] || {};
        if ( type == undefined ) {
            for ( type in item )
                off.call(this, type);
            return this;
        }
        if ( !item[type] ) return this;
        var buf = [].slice.call(item[type]);
        if ( typeof selector == "function" ) {
            for ( k in buf )
                if ( selector == buf[k].fn ) {
                    item[type].splice(item[type].indexOf(buf[k]), 1);
                    elem.removeEventListener(type, buf[k].handler);
                }
        } else if ( selector == undefined ) {
            for ( k in buf )
                 elem.removeEventListener(type, buf[k].handler);
            item[type].splice(0);
        } else if ( typeof fn == "function" ) {
            for ( k in buf )
                if ( fn == buf[k].fn && selector == buf[k].selector ) {
                    item[type].splice(item[type].indexOf(buf[k]), 1);
                    elem.removeEventListener(type, buf[k].handler);
                }
        } else { // typeof selector == "string" only
            for ( k in buf )
                if ( selector == buf[k].selector ) {
                    item[type].splice(item[type].indexOf(buf[k]), 1);
                    elem.removeEventListener(type, buf[k].handler);
                }
        }
        return this;
    }
    function trigger(type, data, bubble) {
        var event = Event(type, bubble);
        event.xmlTarget = Store[this.uid];
        event.data = data == null ? [] : ($.isArray(data) ? data : [data]);
        this.elem().dispatchEvent(event);
        return this;
    }
    function remove(item) {
        delete eventTable[item.uid];
    }
    function Event(type, bubble) {
        var canBubble = !(bubble === false),
            event = $document.createEvent(specialEvents[type] || "Events");
        event.initEvent(type, canBubble, true);
        return event;
    }
    function createProxy(event, listener) {
        var proxy = { originalEvent: event };
        for ( var key in event )
            if ( !ignoreProps.test(key) && event[key] !== undefined)
                proxy[key] = event[key];
        proxy.currentTarget = listener;
        proxy.target = (event.xmlTarget || hp.create(event.target.xmlTarget)).api;
        return compatible(proxy, event);
    }
    function compatible(event, source) {
        eventMethods.forEach(function( name ) {
            var method = source[name];
            event[name] = function () {
                return method && method.apply(source, arguments);
            };
        });
        return event;
    }
    return { on: on, once: once, off: off, trigger: trigger, remove: remove };
}());

var CommonElementAPI = {
    elem: function elem() {
        return this.elem();
    },
    text: function (value) {
        var elem = this.elem();
        if ( value === undefined )
            return elem.textContent;
        if ( elem.childNodes.length == 1 && elem.lastChild.nodeType ) {
            this.node.data = elem.lastChild.data = value + "";
        } else {
            this.api.children(0).call("remove");
            this.api.append(xdocument.createTextNode(value + ""));
        }
        return this;
    },
    prop: function (name, value) {
        if ( value === undefined )
            return this.elem()[name];
        this.elem()[name] = value;
        return this;
    },
    removeProp: function (name) {
        delete this.elem()[name];
        return this;
    },
    attr: function (name, value) {
        var elem = this.elem();
        if ( typeof name !== "string" )
            $.error("invalid attribute name, expected a string");
        if ( value === undefined )
            return elem.getAttribute(name);
        if ( typeof value === "string" ) {
            elem.setAttribute(name, value);
            return this;
        }
        $.error("invalid attribute value, expected a string");
    },
    removeAttr: function (name) {
        this.elem().removeAttribute(name);
        return this;
    },
    addClass: function (value, ctx) {
        var elem = this.elem(),
            ctx = (ctx && Store[ctx.guid()] || this).env,
            klass = elem.getAttribute("class"),
            input = value.replace(/#/g, ctx.aid + ctx.cid).split(/\s+/),
            result = klass ? klass.split(/\s+/) : [];
        for ( var i = 0; i < input.length; i++ )
            if ( result.indexOf(input[i]) < 0 )
                result.push(input[i]);
        elem.setAttribute("class", result.join(" "));
        return this;
    },
    removeClass: function (value, ctx) {
        var elem = this.elem();
        if ( value === undefined )
            return elem.setAttribute("class", ""), this;
        var ctx = (ctx && Store[ctx.guid()] || this).env,
            klass = elem.getAttribute("class"),
            input = value.replace(/#/g, ctx.aid + ctx.cid).split(/\s+/),
            result = klass ? klass.split(/\s+/) : [];
        for ( var i = 0; i < input.length; i++ ) {
            var k = result.indexOf(input[i]);
            k >= 0 && result.splice(k, 1);
        }
        elem.setAttribute("class", result.join(" "));
        return this;
    },
    contains: function (obj) {
        if ( !obj ) return false;
        var target = this.elem(),
            elem = $.isSystemObject(obj) && obj.elem() || obj;
        do {
            if ( elem == target ) return true;
            elem = elem.parentNode;
        } while (elem);
        return false;
    },
    data: function (key, value) {
        if ( value === undefined )
            return this.data[key];
        this.data[key] = value;
        return this;
    },
    removeData: function (key) {
        delete this.data[key];
        return this;
    },
    notify: function (type, data) {
        return this.ctr.notify.call(this, type, data);
    },
    watch: function (type, fn, priority) {
        if ( typeof fn != "function" )
            $.error("invalid callback, expected a function");
        return this.ctr.watch.call(this, type, fn, priority);
    },
    glance: function (type, fn, priority) {
        if ( typeof fn != "function" )
            $.error("invalid callback, expected a function");
        return this.ctr.glance.call(this, type, fn, priority);
    },
    unwatch: function (type, fn) {
        return this.ctr.unwatch.call(this, type, fn);
    },
    append: function (target, options) {
        var parent = this.appendTo();
        if ( $.isSystemObject(target) ) {
            if ( target.contains(this.api) )
                $.error("attempt to append a target which contains current");
            var src = Store[target.guid()],
                srcEnv = src.env,
                srcParent = src.elem().parentNode,
                isTop = srcEnv.xml.lastChild == src.node;
            parent.appendChild(src.elem());
            this.node.appendChild(src.node);
            Manager[src.typ].chenv(this.env, src);
            if ( isTop ) {
                srcEnv.xml.appendChild(xdocument.createElement("void"));
                parseEnvXML(srcEnv, srcParent, srcEnv.xml.lastChild);
            }
            srcEnv.fdr.refresh();
            this.env.fdr.refresh();
            return target;
        }
        target = hp.parseToXML(target, this.env.dir);
        if ( target.nodeType == ELEMENT_NODE && $.isPlainObject(options) ) {
            target.getAttribute("id") || target.setAttribute("id", $.guid());
            this.env.cfg[target.getAttribute("id")] = options;
        }
        this.node.appendChild(target);
        parseEnvXML(this.env, parent, this.node.lastChild);
        target.nodeType == ELEMENT_NODE && target.hasAttribute("id") && this.env.fdr.refresh();
        return hp.create(Store[this.node.lastChild.uid]).api;
    },
    before: function (target, options) {
        if ( this.node == this.env.xml.lastChild )
            $.error("insert before document node is not allow");
        var elem = this.elem();
        if ( $.isSystemObject(target) ) {
            if ( target.contains(this.api) )
                $.error("attempt to insert a target which contains current");
            var src = Store[target.guid()],
                srcEnv = src.env,
                srcParent = src.elem().parentNode,
                isTop = srcEnv.xml.lastChild == src.node;
            this.node.parentNode.insertBefore(src.node, this.node);
            elem.parentNode.insertBefore(src.elem(), elem);
            Manager[src.typ].chenv(this.env, src);
            if ( isTop ) {
                srcEnv.xml.appendChild(xdocument.createElement("void"));
                parseEnvXML(srcEnv, srcParent, srcEnv.xml.lastChild);
            }
            srcEnv.fdr.refresh();
            this.env.fdr.refresh();
            return target;
        }
        target = hp.parseToXML(target, this.env.dir);
        if ( target.nodeType == ELEMENT_NODE && $.isPlainObject(options) ) {
            target.getAttribute("id") || target.setAttribute("id", $.guid());
            this.env.cfg[target.getAttribute("id")] = options;
        }
        var newNode = this.node.parentNode.insertBefore(target, this.node);
        parseEnvXML(this.env, elem, newNode);
        elem.parentNode.insertBefore(elem.lastChild, elem);
        target.nodeType == ELEMENT_NODE && target.hasAttribute("id") && this.env.fdr.refresh();
        return hp.create(Store[this.node.previousSibling.uid]).api;
    },
    replace: function (target, options) {
        var elem = this.elem();
        if ( $.isSystemObject(target) ) {
            if ( target.contains(this.api) )
                $.error("attempt to replace a target which contains current");
            var src = Store[target.guid()],
                srcEnv = src.env,
                srcParent = src.elem().parentNode,
                isTop = srcEnv.xml.lastChild == src.node;
            this.api.trigger("willRemoved");
            elem.parentNode.replaceChild(src.elem(), elem);
            this.node.parentNode.replaceChild(src.node, this.node);
            this.node = src.node;
            Manager[src.typ].chenv(this.env, src);
            if ( isTop ) {
                srcEnv.xml.appendChild(xdocument.createElement("void"));
                parseEnvXML(srcEnv, srcParent, srcEnv.xml.lastChild);
            }
            srcEnv.fdr.refresh();
            this.env.fdr.refresh();
            Manager[this.typ].recycle(this);
            return target;
        }
        this.api.trigger("willRemoved");
        target = hp.parseToXML(target, this.env.dir);
        if ( target.nodeType == ELEMENT_NODE && $.isPlainObject(options) ) {
            target.getAttribute("id") || target.setAttribute("id", $.guid());
            this.env.cfg[target.getAttribute("id")] = options;
        }
        this.node.appendChild(target);
        parseEnvXML(this.env, elem, target);
        this.node.parentNode.replaceChild(target, this.node);
        elem.parentNode.replaceChild(elem.lastChild, elem);
        target.nodeType == ELEMENT_NODE && target.hasAttribute("id") && this.env.fdr.refresh();
        Manager[this.typ].recycle(this);
        return hp.create(Store[target.uid]).api;
    },
    remove: function () {
        if ( this.env.xml.lastChild == this.node ) {
            this.api.replace("void");
        } else {
            var elem = this.elem();
            this.api.trigger("willRemoved");
            elem.parentNode.removeChild(elem);
            this.node.parentNode.removeChild(this.node);
            this.node.nodeType == ELEMENT_NODE && this.node.hasAttribute("id") && this.env.fdr.refresh();
            Manager[this.typ].recycle(this);
        }
    },
    find: function (expr) {
        return this.env.fdr.sys(expr, this.api);
    },
    get: function (index, nodeType) {
        var nodeType = nodeType || ELEMENT_NODE,
            next = this.node.firstChild,
            count = -1;
        while ( next ) {
            if ( next.nodeType == nodeType && ++count == index )
                break;
            next = next.nextSibling;
        }
        return next && hp.create(Store[next.uid]).api;
    },
    first: function (nodeType) {
        var nodeType = nodeType || ELEMENT_NODE,
            next = this.node.firstChild;
        while ( next && next.nodeType != nodeType )
            next = next.nextSibling;
        return next && hp.create(Store[next.uid]).api;
    },
    last: function (nodeType) {
        var nodeType = nodeType || ELEMENT_NODE,
            prev = this.node.lastChild;
        while ( prev && prev.nodeType != nodeType )
            prev = prev.previousSibling;
        return prev && hp.create(Store[prev.uid]).api;
    },
    prev: function (nodeType) {
        var nodeType = nodeType || ELEMENT_NODE,
            prev = this.node.previousSibling;
        while ( prev ) {
            if ( prev.nodeType == nodeType )
                return hp.create(Store[prev.uid]).api;
            prev = prev.previousSibling;
        }
    },
    next: function (nodeType) {
        var nodeType = nodeType || ELEMENT_NODE,
            next = this.node.nextSibling;
        while ( next ) {
            if ( next.nodeType == nodeType )
                return hp.create(Store[next.uid]).api;
            next = next.nextSibling;
        }
    },
    children: function (nodeType) {
        if ( nodeType == undefined )
            nodeType = ELEMENT_NODE;
        var result = new Collection,
            next = this.node.firstChild;
        while ( next ) {
            if ( next.nodeType == nodeType || nodeType == 0 )
                result.push(hp.create(Store[next.uid]).api);
            next = next.nextSibling;
        }
        return result;
    },
    value: function () {
        return this.value;
    },
    localName: function () {
        return this.node.localName;
    },
    namespace: function () {
        var uri = this.node.namespaceURI;
        return isHTML[this.node.nodeName] ? uri : "//" + ph.fullPath(this.env.dir, uri || '');
    },
    guid: function () {
        return this.node.uid;
    },
    toString: function () {
        return this.node.getAttribute("id") || this.node.uid;
    },
    serialize: function (serializeXML) {
        var elem = serializeXML ? this.node : this.elem(),
            prev = elem.previousSibling;
        if ( prev && prev.nodeType == DOCUMENT_TYPE_NODE )
            elem = elem.ownerDocument;
        return $.serialize(elem);
    }
};

var ClientElementAPI = {
    css: function (name, value) {
        var elem = this.elem();
        if ( typeof name != "string" )
            $.error("invalid style name, expected a string");
        if ( value == undefined ) {
            var name = name.replace(/([A-Z])/g, "-$1").toLowerCase();
            return elem.style[name] || getComputedStyle(elem, "").getPropertyValue(name);
        }
        typeof value == "number" && (value += "");
        elem.style[name] = value;
        return this;
    },
    show: function () {
        var elem = this.elem(),
            style = elem.style;
        style.display == "none" && (style.display = "")
        if ( getComputedStyle(elem, "").display == "none" )
            style.display = hp.defDisplay(elem.nodeName);
        return this;
    },
    hide: function () {
        this.elem().style.display = "none";
        return this;
    },
    width: function (value) {
        var elem = this.elem();
        if (value === undefined)
            return elem.getBoundingClientRect().width;
        elem.style.width = parseFloat(value) + "px";
        return this;
    },
    height: function (value) {
        var elem = this.elem();
        if (value === undefined)
            return elem.getBoundingClientRect().height;
        elem.style.height = parseFloat(value) + "px";
        return this;
    },
    offset: function (coordinates) {
        var elem = this.elem();
        if ( coordinates ) {
            var parentOffset = hp.offset(hp.offsetParent(elem));
            elem.style.top = coordinates.top  - parentOffset.top + "px";
            elem.style.left = coordinates.left  - parentOffset.left + "px";
            (hp.css(elem,'position') == 'static') && (elem.style.position = 'relative');
            return this;
        }
        var obj = elem.getBoundingClientRect();
        return {
            left: obj.left + pageXOffset,
            top: obj.top + pageYOffset,
            width: Math.round(obj.width),
            height: Math.round(obj.height)
        };
    },
    position: function  () {
        var elem = this.elem(),
            offset = hp.offset(elem),
            offsetParent = hp.offsetParent(elem),
            parentOffset = hp.offset(offsetParent);
        offset.top  -= parseFloat(hp.css(elem, "margin-top"));
        offset.left -= parseFloat(hp.css(elem, "margin-left"));
        parentOffset.top  += parseFloat(hp.css(offsetParent, "border-top-width"));
        parentOffset.left += parseFloat(hp.css(offsetParent, "border-left-width"));
        return {
            top:  offset.top  - parentOffset.top,
            left: offset.left - parentOffset.left
        };
    },
    scrollTop: function (value) {
        var elem = this.elem(), 
            hasScrollTop = "scrollTop" in elem;
        if ( value === undefined ) 
            return hasScrollTop ? elem.scrollTop : elem.pageYOffset
        hasScrollTop ? (elem.scrollTop = value) : elem.scrollTo(elem.scrollX, value);
        return this;
    },
    scrollLeft: function (value) {
        var elem = this.elem(),
            hasScrollLeft = "scrollLeft" in elem;
        if ( value === undefined ) 
            return hasScrollLeft ? elem.scrollLeft : elem.pageXOffset
        hasScrollLeft ? (elem.scrollLeft = value) : elem.scrollTo(value, elem.scrollY);
        return this;
    }
};

var ServerElementAPI = {
    css: function (name, value) {
        if ( typeof name != "string" )
            $.error("invalid style name, expected a string");
        var table = {},
            elem = this.elem(),
            style = elem.getAttribute("style") || "",
            regexp = /(.+?):(.+?);/ig;
        while ( regexp.test(style) )
            table[RegExp.$1] = RegExp.$2;
        if ( value === undefined )
            return table[name];
        value == null ? (delete table[name]) : (table[name] = value);
        var buf = [];
        for ( var k in table )
            buf.push(k, ":", table[k], ";");
        elem.setAttribute("style", buf.join(""));
        return this;
    },
    show: function () {
        this.api.css("display", null);
        return this;
    },
    hide: function () {
        this.api.css("display", "none");
        return this;
    }
};

var TextElementAPI = (function () {
    var api = {};
    ["before","replace","prev","next","guid","toString"].forEach(function(k) {
        api[k] = CommonElementAPI[k];
    });
    api.text = function (value) {
        if ( value == undefined )
            return this.ele.textContent;
        this.ele.textContent = value;
        return this;
    };
    api.remove = function () {
        this.ele.parentNode.removeChild(this.ele);
        this.node.parentNode.removeChild(this.node);
        Manager[this.typ].recycle(this);
        return this;
    };
    return api;
}());

var DeferElementAPI = {
    show: function () {
        var defer = this.node.defer;
        if ( defer.loaded )
            $.error("the node has been loaded");
        defer.loaded = true;
        return this.api.replace(defer);
    }
};

var ShareElementAPI = {
    remove: function () {
        var k = this.dir + "/" + this.node.localName;
        this.env.share[k].copys.forEach(function( item ) {
            item.api.remove();
        });
        delete this.env.share[k];
        CommonElementAPI.remove.call(this);
    }
};

var CopyElementAPI = {
    remove: function () {
        var k = this.dir + "/" + this.node.localName,
            s = this.env.share[k];
        CommonElementAPI.remove.call(this);
        s.copys.splice(s.copys.indexOf(this), 1);
    }
};

var TextElement = (function() {
    var types = [,,,"TextNode","CDATASection",,,,"Comment"];
    return function ( node, parent ) {
        var o = { uid: $.guid() };
        o.typ = node.nodeType;
        o.ele = $document["create" + types[o.typ]](node.nodeValue);
        return o;
    };
}());

function HtmlElement(node, parent) {
    var o = { typ: 0, elem: hp.elem, uid: $.guid() };
    o.appendTo = hp.appendTo;
    return o;
}

function CompElement(node, parent) {
    var o = { typ: 1, elem: hp.elem, uid: $.guid(), appendTo: hp.appendTo };
    o.fdr = Finder(o);
    o.back = hp.build(o, NodeElementAPI);
    return o;
}

function TextManager() {
    var table = {};
    function create( env, node, parent ) {
        var k = node.nodeType,
            o = (table[k] || (table[k] = [])).pop() || TextElement(node, parent);
        o.ele.textContent = node.textContent;
        o.env = env, o.node = node, node.uid = o.uid;
        parent.appendChild(o.ele);
        return Store[o.uid] = o;
    }
    function recycle(item) {
        delete Store[item.uid];
        //isInBrowser || (item.ele.parentNode = null);
        table[item.typ].push(item);
    }
    function chenv(env, item) {
        item.env = env;
    }
    return { create: create, recycle: recycle, chenv: chenv };
}

function HtmlManager() {
    var table = {};
    function create(env, node, parent) {
        var k = node.nodeName,
            o = (table[k] || (table[k] = [])).pop() || HtmlElement(node, parent);
        node.defer || resetAttrs(env, node);
        o.ele = hp.createElement(node, parent);
        o.api = node.defer ? hp.build(o, DeferElementAPI) : o.back;
        o.ctr = env.ctr, o.env = env, o.node = node, node.uid = o.uid, o.data = {}, o.ele.xmlTarget = o;
        return Store[o.uid] = o;
    }
    function recycle(item) {
        var i = 0, o, c = XPath.select("./*", item.node); 
        for ( ; i < c.length; i++ ) {
            o = Store[c[i].uid];
            Manager[o.typ].recycle(o);
        }
        delete Store[item.uid];
        item.ctr.remove(item);
        item.env.smr.remove(item);
        EventModuleAPI.remove(item);
        table[item.node.nodeName].push(item);
    }
    function chenv(env, item) {
        var i = 0, o, c = item.node.childNodes;
        for ( ; i < c.length; i++ ) {
            o = Store[c[i].uid];
            Manager[o.typ].chenv(env, o);
        }
        item.env = env;
        item.ctr = env.ctr;
    }
    return { create: create, recycle: recycle, chenv: chenv };
}

function setComponent(env, ins) {
    var share = ins.env.share[ins.dir + "/" + ins.node.localName];
    if ( !share ) {
        ins.api = ins.back;
    } else if ( share.ins ) {
        ins.xml.replaceChild(xdocument.createElement("void"), ins.xml.lastChild);
        ins.api = hp.build(ins, CopyElementAPI);
        share.copys.push(ins);
        ins.fun = function () {return share.ins.value;};
    } else {
        ins.api = hp.build(ins, ShareElementAPI);
        share.ins = ins, share.copys = [];
    }
    return ins;
}

function CompManager() {
    var table = [];
    function create(env, node, parent) {
        var w = hp.component(env.dir, node);
        if ( !w ) return;
        var k, o = table.pop() || CompElement(node, parent);
        o.map = $.extend(true, {}, w.map);
        o.opt = $.extend(true, {}, w.opt);
        o.cfg = $.extend(true, {}, w.cfg);
        o.ctr = o.map.msgscope ? Communication() : env.ctr;
        o.dir = w.dir, o.css = w.css, o.ali = w.ali, o.fun = w.fun, o.cid = w.cid, o.the = w.the;
        o.smr = env.smr, o.env = env, o.node = node, o.aid = env.aid, node.uid = o.uid, o.data = {};
        resetAttrs(env, node);
        resetConfigs(env, node);
        resetOptions(env, o);
        o.share = $.extend({}, env.share);
        o.map.share.forEach(function( item ) {
            var p = ph.fullPath(o.dir, item),
                s = ph.split(p);
            Library[s.dir] && Library[s.dir][s.basename] ? (o.share[p] = {}) : $.error("shared object " + p + " not found");
        });
        o.xml = w.xml.cloneNode(true);
        return Store[o.uid] = setComponent(env, o);
    }
    function recycle(item) {
        var i = 0, o, 
            c = XPath.select("./*", item.node),
            deep = Store[item.xml.lastChild.uid];
        for ( ; i < c.length; i++ ) {
            o = Store[c[i].uid];
            Manager[o.typ].recycle(o);
        }
        Manager[deep.typ].recycle(deep);
        delete Store[item.uid];
        item.ctr.remove(item);
        item.smr.remove(item);
        EventModuleAPI.remove(item);
        table.push(item);
    }
    function chenv(env, item) {
        var i = 0, o, c = item.node.childNodes;
        for ( ; i < c.length; i++ ) {
            o = Store[c[i].uid];
            Manager[o.typ].chenv(env, o);
        }
        item.env = env;
        item.msgscope || (item.ctr = env.ctr);
    }
    return { create: create, recycle: recycle, chenv: chenv };
}

function StyleManager() {
    var table = {},
        current = "default",
        parent = $document.body ? $document.getElementsByTagName("head")[0] : $document.createElement("void");
    function cssText(ins) {
        var value, theme = Themes[ins.dir.split('/')[0]][current],
            klass = ins.aid + ins.cid,
            text = ins.css.replace(WELL, "." + klass).replace(/\$/ig, klass);
        theme && ins.the && ins.the.forEach(function( key ) {
            value = theme[key.replace(/%/g, "")];
            value && (text = text.replace(key, value));
        });
        return $document.createTextNode(text);
    }
    function newStyle(ins) {
        var style = $document.createElement("style");
        style.appendChild(cssText(ins));
        return parent.appendChild(style);
    }
    function addClass(elem, value) {
        var klass = elem.getAttribute("class"),
            input = value.split(/\s+/),
            result = klass ? klass.split(/\s+/) : [];
        for ( var i = 0; i < input.length; i++ )
            if ( result.indexOf(input[i]) < 0 )
                result.push(input[i]);
        elem.setAttribute("class", result.join(" "));
    }
    function create(ins) {
        var key = ins.env.aid + ins.cid;
        if ( table[key] ) {
            table[key].count++;
        } else if ( ins.css ) {
            table[key] = { count: 1, style: newStyle(ins), ins: ins };
        }
        var id = ins.node.getAttribute("id");
        if ( id && ins.env.css.indexOf("#" + id) != -1 ) {
            addClass(ins.elem(), ins.env.aid + ins.env.cid + id);
        }
    }
    function remove(ins) {
        var key = ins.env.aid + ins.cid,
            item = table[key];
        if (item && --item.count == 0 ) {
            parent.removeChild(item.style);
            delete table[key];
        }
    }
    function theme(value) {
        if ( value == undefined )
            return current;
        if ( typeof value != "string" ) 
            $.error("invalid theme, excepted a string");
        current = value;
        for ( var k in table )
            if ( Themes[table[k].ins.dir.split('/')[0]][current] )
                table[k].style.replaceChild(cssText(table[k].ins), table[k].style.lastChild);
        return this;
    }
    function style() {
        var i, temp = [], children = parent.childNodes;
        for ( i = 0; i < children.length; i++ )
            if ( children[i].nodeType == 1 )
                temp.push(children[i].textContent);
        return temp.join("");
    }
    return { create: create, remove: remove, theme: theme, style: style };
}

function Finder( env ) {
    function assert(expr, context) {
        if ( typeof expr != "string" )
            $.error("invalid expression, expected a css selector");
        if ( context == undefined )
            return env.xml;
        if ( $.isSystemObject(context) )
            return Store[context.guid()].node;
        $.error("invalid context, expected a InnerObject");
    }
    function sys(expr, context) {
        var context = assert(expr, context),
            result = new Collection,
            list = XPath.select(expr, context);
        for ( var i = 0; i < list.length; i++ )
            result.push(hp.create(Store[list[i].uid]).api);
        return result;
    }
    function items(expr, context) {
        var context = assert(expr, context),
            result = new Collection,
            list = XPath.select(expr, context);
        for ( var i = 0; i < list.length; i++ )
            result.push(Store[list[i].uid].value);
        return result;
    }
    function refresh() {
        var i, k, id, item,
            list = env.xml.querySelector ? env.xml.querySelectorAll("*[id]") : XPath.select("//*[@id]", env.xml);
        for ( i in items ) {
            delete sys[i]; delete items[i];
        }
        for ( i in env.ali ) {
            sys[i] = sys(env.ali[i]);
            items[i] = new Collection;
            for ( k = 0; k < sys[i].length; k++ )
                items[i].push(sys[i][k].value());
            sys[i].call("addClass", env.aid + env.cid + i);
        }
        for ( i = 0; i < list.length; i++ ) {
            id = list[i].getAttribute("id");
            item = hp.create(Store[list[i].uid]);
            sys[id] = item.api, items[id] = item.value;
        }
    }
    return { sys: sys, items: items, refresh: refresh };
}

function setDeferNode(env, node) {
    var index = -1, temp, k, newNode = node;
    for ( k in env.ali ) {
        temp = env.map.defer.indexOf(k);
        if ( temp != -1 && hp.nodeIsMatch(env.xml, env.ali[k], newNode) ) { 
            index = temp; 
            break;
        }
    }
    var id = newNode.getAttribute("id");
    if ( index != -1 || (id && env.map.defer.indexOf(id) != -1) ) {
        newNode = xdocument.createElement("void");
        id && newNode.setAttribute("id", id);
        node.parentNode.replaceChild(newNode, node);
        newNode.defer = node;
    }
    return newNode;
}

function resetAttrs(env, node) {
    var k, attrs = {}, id = node.getAttribute("id");
    for ( k in env.ali )
        if ( hp.nodeIsMatch(env.xml, env.ali[k], node) )
            $.extend(attrs, env.map.attrs[k]);
    if ( id && env.map.attrs[id] )
        attrs = $.extend(attrs, env.map.attrs[id]);
    for ( k in attrs ) {
        if ( env.opt[k] != null )
            node.setAttribute(attrs[k], env.opt[k]);
    }
}

function resetConfigs(env, node) {
    var k, cfgs = {}, id = node.getAttribute("id");
    for ( k in env.ali )
        if ( hp.nodeIsMatch(env.xml, env.ali[k], node) )
            $.extend(cfgs, env.map.cfgs[k]);
    if ( id && env.map.cfgs[id] )
        cfgs = $.extend(cfgs, env.map.cfgs[id]);
    for ( k in cfgs ) {
        env.cfg[id] = env.cfg[id] || {};
        if ( env.opt[k] != null )
            env.cfg[id][cfgs[k]] = env.opt[k];
    }
}

function resetOptions(env, ins) {
    var i, k, o, list, id = ins.node.getAttribute("id");
    for ( k in env.ali )
        if ( hp.nodeIsMatch(env.xml, env.ali[k], ins.node) )
            $.extend(ins.opt, env.cfg[k]);
    if ( id && env.cfg[id] )
        $.extend(ins.opt, env.cfg[id]);
    for ( i = 0; i < ins.node.attributes.length; i++ ) {
        o = ins.node.attributes[i];
        o.prefix || (ins.opt[o.name] = o.value);
    }
    for ( i in ins.map.format ) {
        list = ins.map.format[i];
        for ( k = 0; k < list.length; k++ ) {
            o = ins.opt[list[k]];
            o && (ins.opt[list[k]] = Formater[i](o));
        }
    }
}

function parseEnvXML(env, parent, node) {
    function iterate( node, parent ) {
        if ( node.nodeType > 1 ) {
            if ( Manager[node.nodeType] )
                return Manager[node.nodeType].create(env, node, parent);
            $.error("create failed, invalid node");
        }
        var i, ins, father, node = node.loaded ? node : setDeferNode(env, node);
        if ( isHTML[node.nodeName] ) {
            ins = Manager[0].create(env, node, parent);
            for ( i = 0; i < node.childNodes.length; i++ )
                iterate(node.childNodes[i], ins.ele);
            env.smr.create(ins);
        } else if ( (ins = Manager[1].create(env, node, parent)) ) {
            father = ins.map.nofragment && isInBrowser ? $document.body : parent;
            parseEnvXML(ins, father, ins.xml.lastChild);
            ins.fdr.refresh();
            var appendTo = ins.appendTo();
            for ( i = 0; i < node.childNodes.length; i++ )
                iterate(node.childNodes[i], appendTo);
            env.smr.create(ins);
            ins.value = ins.fun.call(ins.api, ins.fdr.sys, ins.fdr.items, ins.opt);
            ins.map.nofragment && isInBrowser && parent.appendChild($document.body.lastChild);
        } else {
            $.release || console.warn($.serialize(node) + " not found");
            ins = Manager[0].create(env, node, parent);
            for ( i = 0; i < node.childNodes.length; i++ )
                iterate(node.childNodes[i], ins.ele);
            env.smr.create(ins);
        }
        return ins;
    }
    return iterate(node, parent);
}

function makeTheme(root, theme) {
    function imports( target ) {
        if ( !$.isPlainObject(target) )
            $.error("invalid target, expected a plainObject");
        Themes[root][theme] = $.extend(Themes[root][theme], target) ;
        return this;
    }
    return { imports: imports };
}

function makePackage(root, space) {
    if ( !Library[space] )
        Source[space] = {}, Library[space] = {}, Original[space] = {};
    function imports( components ) {
        if ( !$.isPlainObject(components) )
            $.error("invalid components, expected a plainObject");
        for ( var name in components ) {
            var map = components[name].map,
                iname = name.toLowerCase();
            Original[space][iname] = components[name];
            if ( map && map.extend && $.type(map.extend.from) == "string" ) {
                Extends.push({name: iname, space: space, src: components[name] });
            } else {
                hp.imports(components[name], iname, space);
            }
        }
        [].slice.call(Extends).forEach(function ( item ) {
            var target = hp.source(item.space, item.src.map.extend.from);
            if ( target ) {
                Extends.splice(Extends.indexOf(item), 1);
                hp.imports(hp.extend(item.src, target), item.name, item.space);
            }
        });
        return this;
    }
    return { imports: imports };
}

function xmlplus(root, callback) {
    if ( $.type(root) != "string" || root.indexOf('/') > -1 )
        $.error("invalid root, expected a string");
    if ( !$.isFunction(callback) )
        $.error("invalid callback, expected a function");
    Themes[root] = Themes[root] || {};
    Paths[root] = ph.split([].slice.call($document.scripts || [{src:"./i"}]).pop().src).dir;
    function createPackage(space) {
        if ( $.type(space) != "string" && space != null )
            $.error("invalid namespace, expected a null value or a string");
        return makePackage(root, space ? (root + "/" + space) : root);
    }
    function createTheme(theme) {
        Themes[root][theme] = Themes[root][theme] || {};
        return makeTheme(root, theme);
    }
    callback.call(xmlplus, xmlplus, createPackage, createTheme);
    return xmlplus;
}

function startup(xml, parent, param) {
    var instance, fragment,
        env = $.extend(true, {xml: hp.parseToXML(xml), cid: $.guid(), share: {}, dir: ""}, Template);
    if ( env.xml.nodeType !== ELEMENT_NODE )
        $.error("target type must be ELEMENT_NODE");
    if ( $.isPlainObject(parent) ) {
        param = parent;
        parent = $document.body || $document.cloneNode();
    } else if ( parent === undefined ) {
        parent = $document.body || $document.cloneNode();
    } else if ( typeof parent == "string" ) {
        parent =  $document.getElementById(parent) || $.error("parent element " + parent + " not found");
    }
    env.fdr = Finder(env);
    env.smr = StyleManager();
    env.ctr = Communication();
    env.aid = isInBrowser ? $.guid() : "";
    env.api = hp.build(env, NodeElementAPI);
    if ( $.isPlainObject(param) ) {
        env.xml.getAttribute("id") || env.xml.setAttribute("id", $.guid());
        env.cfg[env.xml.getAttribute("id")] = param;
    }
    env.xml = env.xml.parentNode || xdocument.cloneNode().appendChild(env.xml).parentNode;
    fragment = isInBrowser ? $document.createDocumentFragment() : parent;
    instance = parseEnvXML(env, fragment, env.xml.lastChild);
    isInBrowser && parent.appendChild(fragment);
    return $.extend(hp.create(instance).api, {theme: env.smr.theme, style: env.smr.style});
}

(function () {
    if ( isInBrowser ) {
        XPath = window.xpath || { select: hp.xpathQuery };
        DOMParser_ = DOMParser;
        XMLSerializer_ = XMLSerializer;
        $document = document;
        xdocument = $.parseXML("<void/>");
        NodeElementAPI = $.extend(ClientElementAPI, EventModuleAPI, CommonElementAPI);
        window.xmlplus = window.xp = $.extend(xmlplus, $);
        if ( typeof define === "function" && define.amd )
            define( "xmlplus", [], new Function("return xmlplus;"));
        hp.ready(function () {
            $document.body.hasAttribute("noparse") || hp.parseHTML($document.body);
            isReady = true;
        });
    } else {
        delete $.ready;
        XPath = require("xpath");
        DOMParser_ = require("exmldom").DOMParser;
        XMLSerializer_ = require("exmldom").XMLSerializer;
        xdocument = $document = $.parseXML("<void/>");
        NodeElementAPI = $.extend(ServerElementAPI, EventModuleAPI, CommonElementAPI);
        module.exports = $.extend(xmlplus, $);
    }
    CopyElementAPI = $.extend({}, NodeElementAPI, CopyElementAPI);
    DeferElementAPI = $.extend({}, NodeElementAPI, DeferElementAPI);
    ShareElementAPI = $.extend({}, NodeElementAPI, ShareElementAPI);
}());

}(typeof navigator !== "undefined" && navigator.userAgent));