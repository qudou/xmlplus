/*!
 * xmlplus.js v1.7.18
 * https://xmlplus.cn
 * (c) 2017-2022 qudou
 * Released under the MIT license
 */
 (function (inBrowser, undefined) {
"use strict";
  const ELEMENT_NODE                = 1;
//const ATTRIBUTE_NODE              = 2;
//const TEXT_NODE                   = 3;
//const CDATA_SECTION_NODE          = 4;
//const ENTITY_REFERENCE_NODE       = 5;
//const ENTITY_NODE                 = 6;
//const PROCESSING_INSTRUCTION_NODE = 7;
//const COMMENT_NODE                = 8;
//const DOCUMENT_NODE               = 9;
  const DOCUMENT_TYPE_NODE          = 10;
//const DOCUMENT_FRAGMENT_NODE      = 11;
//const NOTATION_NODE               = 12;

const svgns = "http://www.w3.org/2000/svg";
const htmlns = "http://www.w3.org/1999/xhtml";
const xlinkns = "http://www.w3.org/1999/xlink";

// vdoc is for virtual DOM, and rdoc is for real DOM.
let vdoc, rdoc;

let XPath, DOMParser_, XMLSerializer_, NodeElementAPI;
const Manager = [HtmlManager(),CompManager(),,TextManager(),TextManager(),,,,TextManager(),,];
const PM = PackageManager();
const Template = { css: "", cfg: {}, opt: {}, ali: {}, map: { share: "", cfgs: {}, attrs: {}, bind: {} }, fun: new Function };

// isHTML contains isSVG
const isSVG = {}, isHTML = {};
(function () {
    let i = -1, k = -1,
        s = "animate animateMotion animateTransform circle clipPath cursor defs desc discard ellipse feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting feDisplacementMap feDistantLight feDropShadow feFlood feFuncA feFuncB feFuncG feFuncR feGaussianBlur feImage feMerge feMergeNode feMorphology feOffset fePointLight feSpecularLighting feSpotLight feTile feTurbulence filter foreignObject g hatch hatchpath image line linearGradient marker mask mesh meshpatch meshrow metadata mpath path pattern polygon polyline radialGradient rect set solidcolor stop svg switch symbol text textPath tspan unknown use view".split(" "),
        h = "a abbr acronym address applet area article aside audio b base basefont bdi bdo big blockquote body br button canvas caption center cite code col colgroup command datalist dd del details dfn dialog dir div dl dt em embed fieldset figcaption figure font footer form frame frameset h1 h2 h3 h4 h5 h6 head header hr html i iframe img input ins kbd keygen label legend li link main map mark menu menuitem meta meter nav noframes noscript object ol optgroup option output p param pre progress q rp rt rtc ruby s samp script section select small source span strike strong style sub summary sup table tbody td textarea tfoot th thead time title tr track tt u ul var video wbr xmp void".split(" ");
    while (h[++k]) isHTML[h[k]] = 1;
    while (s[++i]) isSVG[s[i]] = isHTML[s[i]] = 1;
}());

// The Library contains the components imported by the imports function.
// The components are initialized by the system
// It contains two levels: the first is the component space and the second is the component name.
// eg. Library["//xp"][Input] = {};
let Library = {};

// The Store establishes the mapping from component instance uid to component instance.
let Store = {};

// The Global stores the application objects created by the '$.startup' function. 
// You can access the objects through the function '$.getElementById'.
let Global = {};

let $ = {
    debug: true,
    startup: startup,
    create: function (path, options) {
        let widget = $.hasComponent(path);
        if (!widget) 
            throw Error(`component ${path} not exists`);
        return widget.fun(null, null, options);
    },
    guid: (function () {
        let counter = 0;
        function intToABC(num) {
           let ch = String.fromCharCode(97 + num % 26);
           return num < 26 ? ch : intToABC(Math.floor(num / 26) - 1) + ch;
        }
        return () => {
            return intToABC(counter++);
        };
    }()),
    ready: function (callback) {
        if (!$.isFunction(callback))
            throw Error("Invalid callback, expected a function");
        rdoc.addEventListener('DOMContentLoaded', callback);
    },
    type: (function () {
        let i, class2type = {},
            types = "Boolean Number String Function AsyncFunction Array Date RegExp Object Error".split(" ");
        for (i = 0; i < types.length; i++)
            class2type[ "[object " + types[i] + "]" ] = types[i].toLowerCase();
        return function(obj) {
             return obj == null ? obj + "" : class2type[class2type.toString.call(obj)] || "object";
        };
    }()),
    isArray: Array.isArray || function (obj) {
        return obj instanceof Array
    },
    likeArray: function (obj) {
        let length = !!obj && "length" in obj && obj.length,
            type = $.type(obj);
        if (type === "function" || $.isWindow(obj))
            return false;
        return type === "array" || length === 0 ||
            typeof length === "number" && length > 0 && (length - 1) in obj;
    },
    isWindow: function (obj) {
        return obj != null && obj == obj.window;
    },
    isFunction: function (obj) {
        let type = $.type(obj);
        return type == "function" || type == "asyncfunction";
    },
    isNumeric: function (obj) {
        let type = $.type(obj);
        return (type === "number" || type === "string") && !isNaN(obj - parseFloat(obj));
    },
    isPlainObject: function (obj) {
        return $.type(obj) == "object" && !$.isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype;
    },
    isEmptyObject: function (obj) {
        for (let name in obj) return false;
        return true;
    },
    isSystemObject: function (obj) {
        return obj && typeof obj.guid == "function" && !!Store[obj.guid()];
    },
    extend: function () {
        // This function is modified from jQuery.
        // https://jquery.com/
        let options, name, src, copy, copyIsArray, clone,
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
    each: function (objs, callback) {
        if ($.likeArray(objs)) {
            for (let i = 0; i < objs.length; i++ )
                if (callback.call(objs[i], i, objs[i]) === false) break;
        } else for (let key in objs) {
            if (callback.call(objs[key], key, objs[key]) === false) break;
        }
        return objs;
    },
    parseXML: function (data) {
        let xml;
        if (!data || typeof data !== "string")
            throw Error("Invalid data, expected a string");
        try {
            xml = (new DOMParser_()).parseFromString(data, "text/xml");
        } catch (e) {
            xml = undefined;
        }
        if (!xml || xml.getElementsByTagName( "parsererror" ).length)
            throw Error("Invalid XML: " + data);
        return xml;
    },
    serialize: function (node) {
        return (new XMLSerializer_).serializeToString(node, true);
    },
    hasNamespace: function (space) {
        return !!Library[space];
    },
    hasComponent: function (path) {
        if (typeof path != "string") 
            return false;
        if (isHTML[path])
            return true;
        let s = ph.split(path);
        s.dir = s.dir.substr(2);
        return Library[s.dir] && Library[s.dir][s.basename] || false;
    },
    getElementById: function (id, isGuid) {
        if (isGuid)
            return Store[id] && Store[id].api;
        return inBrowser ? (Global[id] || rdoc.getElementById(id)) : null;
    },
    exports: (function () {
        function fromObject(target) {
            let obj = {};
            for(let k in target) {
                if ($.linkArray(target[k]))
                    obj[k] = fromArray(target[k]);
                else if (typeof target[k] == "object")
                    obj[k] = fromObject(target[k])
                else obj[k] = target[k]
            }
            return obj;
        }
        function fromArray(target) {
            let i, arr = [];
            for (i = 0; i < target.length; i++) {
                if (target[i].push)
                    arr.push(fromArray(target[i]))
                else if (typeof target[i] == "object")
                    arr.push(fromObject(target[i]))
                else arr.push(target[i])
            }
            return arr;
        }
        return target => {
            if (target.push) return fromArray(target);
            return typeof target == "object" ? fromObject(target) : target;
        };
    }())
};

let ph = (function () {
    let table = {};
    function normalizeArray(parts, allowAboveRoot) {
        let i = parts.length - 1, up = 0;
        for (; i >= 0; i--) {
            let last = parts[i];
            if (last === '.')
                parts.splice(i, 1);
            else if (last === '..')
                parts.splice(i, 1), up++;
            else if (up)
                parts.splice(i, 1), up--;
        }
        if (allowAboveRoot)
            for ( ; up--; up )
                parts.unshift('..');
        return parts;
    }
    function filter(xs) {
        let i = 0, res = [];
        for (; i < xs.length; i++)
            xs[i] && res.push(xs[i]);
        return res;
    }
    function isAbsolute(path) {
        return path.charAt(0) === '/';
    }
    function normalize(path) {
        let absolute = isAbsolute(path),
            trailingSlash = path.substr(-1) === '/';
        path = normalizeArray(filter(path.split('/')), !absolute).join('/');
        if (!path && !absolute)
            path = '.';
        if (path && trailingSlash)
            path += '/';
        return (absolute ? '/' : '') + path;
    }
    function join(part1, part2) {
        let paths = [part1,part2];
        return normalize(filter(paths).join('/'));
    }
    function split(path) {
        let i = path.lastIndexOf('/');
        return { dir: path.substring(0, i), basename: path.substr(i+1).toLowerCase() };
    }
    // (dir/foo, ..) => dir, (dir, ./bar) => dir/bar
    function fullPath(dir, patt) {
        let key = dir + patt;
        if (table[key])
            return table[key];
        if (patt.substr(0, 2) == "//")
            return table[key] = patt.substr(2);
        return table[key] = isAbsolute(patt) ? join(dir.split('/')[0], patt.slice(1)) : join(dir, patt);
    }
    return { split: split, fullPath: fullPath };
}());

let hp = {
    parseToXML: function (input, dir) {
        if ( input == null )
            throw Error("Invalid input, expected a string or a xml node");
        if ( input.ownerDocument )
            return input;
        if ( typeof input != "string" )
            throw Error("invalid input, expected a string or a xml node");
        if ( isHTML[input] )
            return vdoc.createElement(input);
        if ( input.charAt(0) == '<' ) try {
            return $.parseXML(input).lastChild;
        } catch (e) {
            return vdoc.createTextNode(input);
        }
        let i = input.lastIndexOf('/');
        dir = ph.fullPath(dir || "", input.substring(0, i) || ".");
        let basename = input.substr(i+1);
        if ( Library[dir] && Library[dir][basename.toLowerCase()] )
            return vdoc.createElementNS("//" + dir, 'i:' + basename);
        return vdoc.createTextNode(input);
    },
    defDisplay: (function () {
        let elemDisplay = {};
        return function ( nodeName ) {
            let elem, display;
            if (!elemDisplay[nodeName]) {
                elem = rdoc.createElement(nodeName);
                rdoc.body.appendChild(elem);
                display = getComputedStyle(elem, "").getPropertyValue("display");
                elem.parentNode.removeChild(elem);
                display == "none" && (display = "block");
                elemDisplay[nodeName] = display;
            }
            return elemDisplay[nodeName];
        };
    }()),
    offsetParent: function (elem) {
        let parent = elem.offsetParent;
        while ( parent && hp.css(parent, "position") == "static" )
            parent = parent.offsetParent;
        return parent || rdoc.documentElement; 
    },
    offset: function (elem) {
        let obj = elem.getBoundingClientRect();
        return {
            left: obj.left + pageXOffset,
            top: obj.top + pageYOffset
        };
    },
    css: function (elem, name) { 
        return elem.style[name] || getComputedStyle(elem, "").getPropertyValue(name);
    },
    addClass: function (elem, value) {
        let klass = elem.getAttribute("class"),
            input = value.split(/\s+/),
            result = klass ? klass.split(/\s+/) : [];
        for (let i = 0; i < input.length; i++)
            if (result.indexOf(input[i]) < 0)
                result.push(input[i]);
        elem.setAttribute("class", result.join(" "));
    },
    callback: function () {
        let ret = this.fn.apply(this.data, [].slice.call(arguments));
        return ret == this.data ? this.api : ret;
    },
    build: function (data, object) {
        let api = {};
        let proxy = new Proxy(object, {
            get(target, propKey, receiver) {
                if (object[propKey] === undefined)
                    return Reflect.get(target, propKey, receiver);
                if (!api.hasOwnProperty(propKey))
                    api[propKey] = hp.callback.bind({fn: object[propKey], data: data, api: proxy});
                return api[propKey];
            },
        });
        return proxy;
    },
    create: function (item) {
        item.api || (item.api = item.back = hp.build(item, item.typ > 1 ? TextElementAPI : NodeElementAPI));
        return item;
    },
    elem: function () {
        return this.ele || Store[this.xml.lastChild.uid].elem();
    },
    appendTo: function () {
        if (this.ele) return this.ele;
        let target = this.fdr.sys[this.map.appendTo];
        if (!target)
            return Store[this.xml.lastChild.uid].elem()
        return Store[target.guid()].appendTo();
    },
    createElement: (function() {
        let buffer = {};
        return function (node, parent) {
            let nodeName = node.nodeName;
            buffer[nodeName] || (buffer[nodeName] = rdoc.createElementNS(isSVG[nodeName] ? svgns : (isHTML[nodeName] ? htmlns : node.namespaceURI), nodeName));
            let elem = buffer[nodeName].cloneNode();
            parent.appendChild(elem);
            for (let i = 0; i < node.attributes.length; i++) {
                let attr = node.attributes[i];
                if (attr.prefix == "xlink")
                    elem.setAttributeNS(xlinkns, attr.nodeName, attr.nodeValue);
                if (attr.nodeName != "id" && (!isHTML[nodeName] || !attr.prefix))
                    elem.setAttribute(attr.nodeName, attr.nodeValue);
            }
            return elem;
        };
    }()),
    nodeIsMatch: function (xml, expr, node) {
        let i = XPath.select(expr, xml);
        return [].slice.call(i).indexOf(node) != -1
    },
    xpathQuery: (function() {
        let exprs = {};
        return function (expr, xml) {
            let nodes = [];
            if (!exprs[expr])
                exprs[expr] = (new XPathEvaluator).createExpression(expr);
            let result = exprs[expr].evaluate(xml, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
            if (result)
                for (let i = 0, len = result.snapshotLength; i < len; i++)
                    nodes.push(result.snapshotItem(i));
            return nodes;
        }
    }()),
    parseHTML: function parse(node) {
        if (node.nodeType != ELEMENT_NODE) return;
        if (isHTML[node.nodeName.toLowerCase()]) {
            for (let k in node.childNodes)
                parse(node.childNodes[k]);
        } else {
            let xml = $.serialize(node).replace(/(<\/?\w:)((\w|\d)+)/ig, function (s, prefix, localName) {
                return prefix.toLowerCase() + localName;
            });
            let id = node.getAttribute("id"),
                val = startup(xml, node.parentNode);
            id && (Global[id] = val) && val.attr("id", id);
            node.parentNode.replaceChild(node.parentNode.lastChild, node);
        }
    }
};

let bd = {
    isLiteral: function (value) {
        return $.isNumeric(value) || $.type(value) == "string" || $.type(value) == "boolean";
    },
    bindObject: function (view) {
        let objects = {}, binds = {};
        let proxy = new bd.ObjectProxy(objects, binds);
        function setter(target) {
            let props = Object.getOwnPropertyNames(target);
            $.each(props, (i,key) => {
                objects.hasOwnProperty(key) || bind(target[key], key);
                proxy[key] = objects[key] = target[key];
            });
        }
        function delter() {
            for (let k in proxy)
                delete proxy[k];
            $.each(Object.getOwnPropertyNames(binds), (i,key) => {
                delete binds[key];
            });
        }
        function unbind() {
            $.each(Object.getOwnPropertyNames(binds), (i,key) => {
                binds[key].forEach(i => i.unbind());
                delete objects[key];
                delete binds[key];
            });
        }
        function bind(value, key) {
            binds[key] = binds[key] || [];
            let views = view.fdr.sys[view.map.bind[key] || key];
            if (!views || typeof views == "string")
                return binds[key].push(bd.BindNormal(view, key));
            if ($.isSystemObject(views))
                views = [views];
            views = views.map(v => {return Store[v.guid()]});
            if ($.isArray(value)) {
                views.forEach(view => {
                    binds[key].push(bd.bindArray(view));
                });
            } else if ($.isPlainObject(value)) {
                views.forEach(view => {
                    binds[key].push(bd.bindObject(view));
                });
            } else if (bd.isLiteral(value)) {
                views.forEach(view => {
                    binds[key].push(bd.bindLiteral(view, key));
                });
            } else {
                throw Error(`Type error: ${value}`);
            }
        }
        return {get: ()=>{return proxy}, set: setter, del: delter, unbind: unbind};
    },
    bindArray: function (view) {
        let render = view.node.cloneNode(false);
        render.removeAttribute("id");
        let proxy = bd.ArrayProxy(view.api.hide(), render);
        function setter(v) {
            for (let i in v)
                proxy[i] = v[i];
            while (proxy.length > v.length)
                proxy.pop(0);
        }
        function delter() {
            unbind();
            view.api.remove();
        }
        function unbind() {
            while (proxy.length)
                delete proxy[0];
        }
        return {get: ()=>{return proxy}, set: setter, del: delter, unbind: unbind};
    },
    bindLiteral: function (view, key) {
        let elem = view.elem();
        let type = 0;
        switch(elem.nodeName) {
            case "PROGRESS":
            case "SELECT":
            case "OPTION":
            case "TEXTAREA":
                type =  1;
                break;
            case "INPUT":
                let at = elem.getAttribute("type");
                type = (at == "range" || at == "text" ? 1 : 2);
        }
        function getter() {
            let v = view.fdr ? view.value : view.env.value;
            if (v && $.isFunction(v[key]))
                return v[key]();
            return type == 1 ? elem.value : (type ? elem.checked : view.api.text());
        }
        function setter(value) {
            let v = view.fdr ? view.value : view.env.value;
            if (v && $.isFunction(v[key]))
                return v[key](value);
            type == 1 ? (elem.value = value) : (type ? (elem.checked = value) : view.api.text(value));
        }
        function delter() {
            view.api.remove();
        }
        function unbind() {
            // nothing to do
        }
        return {get: getter, set: setter, del: delter, unbind: unbind};
    },
    BindNormal: function (view, key) {
        let tmpValue;
        let v = view.value;
        function getter() {
            return v && $.isFunction(v[key]) ? v[key]() : tmpValue;
        }
        function setter(value) {
            if (v && $.isFunction(v[key]))
                return v[key](value);
            tmpValue = value;
        }
        function dump() {}
        return {get: getter, set: setter, del: dump, unbind: dump};
    },
    ObjectProxy: function (target, objects) {
        return new Proxy(target, {
            get(target, propKey, receiver) {
                if (objects[propKey] !== undefined)
                    return objects[propKey][0].get();
                return Reflect.get(target, propKey, receiver);
            },
            set(target, propKey, value, receiver) {
                if (objects[propKey] !== undefined)
                    objects[propKey].forEach(i=>i.set(value));
                return true;
            },
            deleteProperty(target, propKey) {
                if (objects[propKey] !== undefined)
                    objects[propKey].forEach(i=>i.del());
                return Reflect.deleteProperty(target, propKey);
            }
        });
    },
    ArrayProxy: function (holder, render) {
        let List = new Function;
        List.prototype = {length: 0, push: push, pop: pop};
        let [views, list, empty] = [[], new List, []];
        let proxy = new Proxy(list, {get: getter, set: setter, deleteProperty: delter});
        function push(value) {
            let view = holder.before(render.cloneNode(false));
            views.push(view);
            empty.push.apply(list, [view.bind(value)])
            return true;
        }
        function pop(exports = 1) {
            if (!list.length)
                return undefined;
            let item,
                i = list.length - 1;
            if (exports)
                item = $.exports(list[i].model);
            delete proxy[i];
            return item;
        }
        function getter(target, propKey, receiver) {
            if ($.isNumeric(propKey))
                return list[propKey].model;
            return Reflect.get(target, propKey, receiver);
        }
        function setter(target, propKey, value) {
            if (propKey == list.length)
                return push(value);
            if (!views[propKey])
                throw Error(`prop name ${propKey} does not exist.`);
            list[propKey].model = value;
            return true;
        }
        function delter(target, propKey, receiver) {
            if (!views[propKey])
                return Reflect.get(target, propKey, receiver);
            views[propKey].remove();
            views.splice(propKey,1);
            empty.splice.apply(list, [propKey,1]);
            return true;
        }
        return proxy;
    }
};

let Collection = (function () {
    let emptyArray = [],
        fn = new Function,
        slice = emptyArray.slice,
        list = "every forEach indexOf map pop push shift some splice unshift".split(' ');
    fn.prototype = {
        length: 0,
        slice: function () {
            let result = new Collection,
                list = slice.apply(this, slice.call(arguments));
            for (let i = 0; i < list.length; i++)
                result.push(list[i]);
            return result;
        },
        hash: function () {
            let i = 0, table = {};
            for (; i < this.length; i++)
                table[this[i]] = this[i];
            return table;
        },
        call: function (fnName) {
            if (typeof fnName != "string")
                throw Error("Invalid function name, expected a string");
            let args = slice.call(arguments).slice(1);
            for (let i = 0; i < this.length; i++)
                if ($.isFunction(this[i][fnName]))
                    this[i][fnName].apply(this[i], args);
            return this;
        },
        values: function () {
            let result = new Collection;
            for (let i = 0; i < this.length; i++)
                result.push(this[i].val());
            return result;
        }
    };
    for (let i = 0; i < list.length; i++)
        fn.prototype[list[i]] = emptyArray[list[i]];
    return fn;
}());

let MessageModuleAPI = (function () {
    let table = {};
    function watch(type, fn) {
        if (typeof fn !== "function") 
            throw Error("Invalid handler, expected a function");
        let uid = this.elem().xmlTarget.uid;
        table[uid] = table[uid] || {};
        table[uid][type] = table[uid][type] || [];
        table[uid][type].push({watcher: this, fn: fn});
        return this;
    }
    function glance(type, fn) {
        function callback(e) {
            this.unwatch(type, callback);
            fn.apply(this, [].slice.call(arguments));
        }
        return this.api.watch(type, callback);
    }
    function unwatch(type, fn) {
        let item = table[this.elem().xmlTarget.uid] || {};
        if (type == undefined) {
            for (type in item)
                unwatch.call(this, type);
            return this;
        }
        if (!item[type]) return this;
        let buf = [].slice.call(item[type]);
        if (typeof fn == "function") {
            for (let k in buf)
                if (fn == buf[k].fn)
                    item[type].splice(item[type].indexOf(buf[k]), 1);
        } else {
            delete item[type];
        }
        return this;
    }
    function notify(type, data) {
        let that = this;
        data = data == null ? [] : ($.isArray(data) ? data : [data]);
        (function iterate(target) {
            let uid = target.uid;
            if (target.fdr) {
                let filter = target.map.msgFilter;
                if (filter && filter.test(type) && target != that)
                    return true;
                if (iterate(Store[Store[uid].xml.lastChild.uid]) == false)
                    return false;
            } else {
                let cancel;
                let targets = table[uid] && table[uid] || {};
                $.each(targets[type], (key, item) => {
                    let e = {type: type, target: that.api, currentTarget: item.watcher.api};
                    e.stopImmediateNotification = ()=> e.cancelImmediate = true;
                    e.stopNotification = ()=> e.cancel = true;
                    item.fn.apply(e.currentTarget, [e].concat(data));
                    if (e.cancelImmediate)
                        return !(cancel = true);
                    e.cancel && (cancel = e.cancel);
                });
                if (cancel) return false;
            }
            for (let i = 0; i < target.node.childNodes.length; i++) {
                let node = target.node.childNodes[i];
                if (node.nodeType == 1)
                    if (iterate(Store[node.uid]) == false)
                        return false;
            }
        }(this));
        return this;
    }
    function remove(target) {
        delete table[target.uid];
    }
    function messages() {
        let result = {};
        (function iterate(target) {
            let uid = target.uid;
            if (target.fdr)
                iterate(Store[Store[uid].xml.lastChild.uid]);
            else if (table[uid]) {
                for (let key in table[uid])
                    result[key] = 1;
            }
            for (let i = 0; i < target.node.childNodes.length; i++) {
                let node = target.node.childNodes[i];
                node.nodeType == 1 && iterate(Store[node.uid]);
            }
        }(this));
        return Object.keys(result);
    }
    return { watch: watch, glance: glance, unwatch: unwatch, notify: notify, remove: remove, messages: messages };
}());

let EventModuleAPI = (function () {
    let eventTable = {},
        listeners = {},
        ignoreProps = /^([A-Z]|returnValue$|layer[XY]$|keyLocation$)/,
        specialEvents={ click: "MouseEvents", mousedown: "MouseEvents", mouseup: "MouseEvents", mousemove: "MouseEvents" };
    function assert(type, selector, fn) {
        if ($.type(type) != "string")
            throw Error("Invalid type, expected a string");
        if (!$.isFunction(fn))
            throw Error("Invalid handler, expected a function");
        if (selector !== undefined && $.type(selector) != "string")
            throw Error("Invalid selector, expected a string");
    }
    function on(type, selector, fn) {
        if ($.isFunction(selector))
            fn = selector, selector = undefined;
        xmlplus.debug && assert(type, selector, fn);
        let uid = this.elem().xmlTarget.uid,
            listener = this.api;
        function handler(event) {
            let e = createProxy(event, listener);
            if (!selector)
                return fn.apply(listener, [e].concat(event.data)), e;
            listener.find(selector).forEach(function(item) {
                if (item.contains(e.target))
                    fn.apply(item, [e].concat(event.data));
            });
            return e;
        }
        eventTable[uid] = eventTable[uid] || {};
        eventTable[uid][type] = eventTable[uid][type] || [];
        eventTable[uid][type].push({selector: selector, fn: fn, handler: handler});
        if (!listeners[type]) {
            listeners[type] = type;
            rdoc.addEventListener(type, eventHandler)
        }
        return this;
    }
    function once(type, selector, fn) {
        let realCallback;
        if ($.isFunction(fn))
            realCallback = fn, fn = callback;
        else if ($.isFunction(selector))
            realCallback = selector, selector = callback;
        else 
            throw Error("Invalid handler, expected a function");
        function callback(e) {
            e.currentTarget.off(type, callback);
            realCallback.apply(this, [].slice.call(arguments));
        }
        return this.api.on(type, selector, fn);
    }
    function off(type, selector, fn) {
        let k, item = eventTable[this.elem().xmlTarget.uid] || {};
        if (type === undefined) {
            for (type in item)
                off.call(this, type);
            return this;
        }
        if (!item[type]) return this;
        let buf = [].slice.call(item[type]);
        if ($.isFunction(selector)) {
            for (k in buf)
                if (selector == buf[k].fn)
                    item[type].splice(item[type].indexOf(buf[k]), 1);
        } else if (selector === undefined) {
            item[type].splice(0);
        } else if ($.isFunction(fn)) {
            for (k in buf)
                if (fn == buf[k].fn && selector == buf[k].selector)
                    item[type].splice(item[type].indexOf(buf[k]), 1);
        } else { // typeof selector == "string" only
            for (k in buf)
                if (selector == buf[k].selector)
                    item[type].splice(item[type].indexOf(buf[k]), 1);
        }
        return this;
    }
    function trigger(type, data, bubble) {
        let event = Event(type, true);
        event.xmlTarget = Store[this.uid];
        event.bubble_ = bubble == false ? false : true;
        event.data = data == null ? [] : ($.isArray(data) ? data : [data]);
        this.elem().dispatchEvent(event);
        return this;
    }
    function remove(target) {
        delete eventTable[target.uid];
    }
    function Event(type, bubble) {
        let canBubble = !(bubble === false),
            event = rdoc.createEvent(specialEvents[type] || "Events");
        event.initEvent(type, canBubble, true);
        return event;
    }
    function createProxy(event, listener) {
        let proxy = { originalEvent: event };
        for (let key in event)
            if ( !ignoreProps.test(key) && event[key] !== undefined)
                proxy[key] = event[key];
        proxy.currentTarget = listener;
        proxy.target = (event.xmlTarget || hp.create(event.target.xmlTarget)).api;
        proxy.preventDefault = ()=> event.preventDefault();
        proxy.stopImmediatePropagation = ()=> proxy.cancelImmediateBubble = true;
        proxy.stopPropagation = ()=> proxy.cancelBubble = true;
        return proxy;
    }
    function eventHandler(event) {
        let target = event.target,
            cancelBubble = false;
        while (target && target.xmlTarget) {
            let uid = target.xmlTarget.uid,
                items =(eventTable[uid] || {})[event.type] || [];
            for (let i = 0; i < items.length; i++) {
                let e = items[i].handler(event);
                if (e.cancelImmediateBubble) {
                    cancelBubble = true;
                    break;
                }
                e.cancelBubble && (cancelBubble = true);
            }
            if (cancelBubble || event.bubbles === false || event.bubble_ === false) 
                break;
            target = target.parentNode;
        }
    }
    return { on: on, once: once, off: off, trigger: trigger, remove: remove };
}());

let CommonElementAPI = {
    elem: function elem() {
        return this.elem();
    },
    text: function (value) {
        let elem = this.elem();
        if (value === undefined)
            return elem.textContent;
        if ( elem.childNodes.length == 1 && elem.lastChild.nodeType ) {
            this.node.data = elem.lastChild.data = value + "";
        } else {
            this.api.kids(0).call("remove");
            this.api.append(vdoc.createTextNode(value + ""));
        }
        return this;
    },
    prop: function (name, value) {
        if (value === undefined)
            return this.elem()[name];
        this.elem()[name] = value;
        return this;
    },
    removeProp: function (name) {
        delete this.elem()[name];
        return this;
    },
    attr: function (name, value) {
        let elem = this.elem();
        if (value === undefined)
            return elem.getAttribute(name);
        elem.setAttribute(name, value + '');
        return this;
    },
    removeAttr: function (name) {
        this.elem().removeAttribute(name);
        return this;
    },
    addClass: function (value, ctx) {
        ctx = (ctx && Store[ctx.guid()] || this).env;
        let elem = this.elem(),
            klass = elem.getAttribute("class"),
            input = (value + '').replace(/#/g, ctx.aid + ctx.cid).split(/\s+/),
            result = klass ? klass.split(/\s+/) : [];
        for (let i = 0; i < input.length; i++)
            if (result.indexOf(input[i]) < 0)
                result.push(input[i]);
        elem.setAttribute("class", result.join(' '));
        return this;
    },
    removeClass: function (value, ctx) {
        let elem = this.elem();
        if (value === undefined)
            return elem.setAttribute("class", ""), this;
        ctx = (ctx && Store[ctx.guid()] || this).env;
        let klass = elem.getAttribute("class"),
            input = (value + '').replace(/#/g, ctx.aid + ctx.cid).split(/\s+/),
            result = klass ? klass.split(/\s+/) : [];
        for (let k, i = 0; i < input.length; i++ ) {
            k = result.indexOf(input[i]);
            k >= 0 && result.splice(k, 1);
        }
        elem.setAttribute("class", result.join(" "));
        return this;
    },
    hasClass: function(value) {
        let elem = this.elem(),
            env = this.env;
        value = (value + '').replace(/#/g, env.aid + env.cid);
        if (value.length == 0) 
            return false;
        return new RegExp(' ' + value + ' ').test(' ' + elem.getAttribute("class") + ' ');
    },
    contains: function (obj) {
        if (!obj) return false;
        let target = this.elem(),
            elem = $.isSystemObject(obj) && obj.elem() || obj;
        do {
            if (elem == target) return true;
            elem = elem.parentNode;
        } while (elem);
        return false;
    },
    append: function (target, options, parent) {
        parent = parent || this.appendTo();
        if ($.isSystemObject(target)) {
            if (target.contains(this.api))
                throw Error("attempt to append a object which contains current node!");
            let src = Store[target.guid()],
                srcEnv = src.env,
                srcParent = src.elem().parentNode,
                isTop = srcEnv.xml.lastChild == src.node;
            parent.appendChild(src.elem());
            this.node.appendChild(src.node);
            Manager[src.typ].chenv(this.env, src);
            if (isTop) {
                srcEnv.xml.appendChild(vdoc.createElement("void"));
                parseEnvXML(srcEnv, srcParent, srcEnv.xml.lastChild);
            }
            srcEnv.fdr.refresh();
            this.env.fdr.refresh();
            return target;
        }
        target = hp.parseToXML(target, this.env.dir);
        if (target.nodeType == ELEMENT_NODE && $.isPlainObject(options)) {
            target.getAttribute("id") || target.setAttribute("id", $.guid());
            this.env.cfg[target.getAttribute("id")] = options;
        }
        this.node.appendChild(target);
        parseEnvXML(this.env, parent, this.node.lastChild);
        target.nodeType == ELEMENT_NODE && target.hasAttribute("id") && this.env.fdr.refresh();
        return hp.create(Store[this.node.lastChild.uid]).api;
    },
    before: function (target, options, elem) {
        if (this.node == this.env.xml.lastChild)
            throw Error("insert before document node is not allowed");
        elem = elem || this.elem();
        if ($.isSystemObject(target)) {
            if (target.contains(this.api))
                throw Error("attempt to insert a object which contains current node");
            let src = Store[target.guid()],
                srcEnv = src.env,
                srcParent = src.elem().parentNode,
                isTop = srcEnv.xml.lastChild == src.node;
            this.node.parentNode.insertBefore(src.node, this.node);
            elem.parentNode.insertBefore(src.elem(), elem);
            Manager[src.typ].chenv(this.env, src);
            if (isTop) {
                srcEnv.xml.appendChild(vdoc.createElement("void"));
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
        let newNode = this.node.parentNode.insertBefore(target, this.node);
        parseEnvXML(this.env, elem, newNode);
        elem.parentNode.insertBefore(elem.lastChild, elem);
        target.nodeType == ELEMENT_NODE && target.hasAttribute("id") && this.env.fdr.refresh();
        return hp.create(Store[this.node.previousSibling.uid]).api;
    },
    replace: function (target, options) {
        let elem = this.elem();
        if ($.isSystemObject(target)) {
            if ( target.contains(this.api) )
                throw Error("attempt to replace a object which contains current node");
            let src = Store[target.guid()],
                srcEnv = src.env,
                srcParent = src.elem().parentNode,
                isTop = srcEnv.xml.lastChild == src.node;
            elem.parentNode.replaceChild(src.elem(), elem);
            this.node.parentNode.replaceChild(src.node, this.node);
            this.node = src.node;
            Manager[src.typ].chenv(this.env, src);
            if (isTop) {
                srcEnv.xml.appendChild(vdoc.createElement("void"));
                parseEnvXML(srcEnv, srcParent, srcEnv.xml.lastChild);
            }
            srcEnv.fdr.refresh();
            this.env.fdr.refresh();
            Manager[this.typ].recycle(this);
            return target;
        }
        target = hp.parseToXML(target, this.env.dir);
        if (target.nodeType == ELEMENT_NODE && $.isPlainObject(options)) {
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
        if (this.env.xml.lastChild == this.node) {
            this.api.replace("void");
        } else {
            let elem = this.elem();
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
        nodeType = nodeType || ELEMENT_NODE;
        let next = this.node.firstChild,
            count = -1;
        while (next) {
            if (next.nodeType == nodeType && ++count == index)
                break;
            next = next.nextSibling;
        }
        return next && hp.create(Store[next.uid]).api;
    },
    first: function (nodeType) {
        nodeType = nodeType || ELEMENT_NODE;
        let next = this.node.firstChild;
        while (next && next.nodeType != nodeType)
            next = next.nextSibling;
        return next && hp.create(Store[next.uid]).api;
    },
    last: function (nodeType) {
        nodeType = nodeType || ELEMENT_NODE;
        let prev = this.node.lastChild;
        while (prev && prev.nodeType != nodeType)
            prev = prev.previousSibling;
        return prev && hp.create(Store[prev.uid]).api;
    },
    prev: function (nodeType) {
        nodeType = nodeType || ELEMENT_NODE;
        let prev = this.node.previousSibling;
        while (prev) {
            if (prev.nodeType == nodeType)
                return hp.create(Store[prev.uid]).api;
            prev = prev.previousSibling;
        }
    },
    next: function (nodeType) {
        nodeType = nodeType || ELEMENT_NODE;
        let next = this.node.nextSibling;
        while (next) {
            if (next.nodeType == nodeType)
                return hp.create(Store[next.uid]).api;
            next = next.nextSibling;
        }
    },
    kids: function (nodeType) {
        if (nodeType == undefined)
            nodeType = ELEMENT_NODE;
        let result = new Collection,
            next = this.node.firstChild;
        while (next) {
            if (next.nodeType == nodeType || nodeType == 0)
                result.push(hp.create(Store[next.uid]).api);
            next = next.nextSibling;
        }
        return result;
    },
    val: function () {
        return this.value;
    },
    localName: function () {
        return this.node.localName;
    },
    namespace: function () {
        let uri = this.node.namespaceURI;
        return isHTML[this.node.nodeName] ? uri : "//" + ph.fullPath(this.env.dir, uri || '');
    },
    guid: function () {
        return this.node.uid;
    },
    toString: function () {
        return this.node.getAttribute("id") || this.node.uid;
    },
    serialize: function (serializeXML) {
        let elem = serializeXML ? this.node : this.elem(),
            prev = elem.previousSibling;
        if (prev && prev.nodeType == DOCUMENT_TYPE_NODE)
            elem = elem.ownerDocument;
        return $.serialize(elem);
    },
    bind: function (value) {
        let [view, model] = [this, null];
        let proxy = new Proxy({}, {get: getter, set: setter, deleteProperty: delter});
        function getter(target, propKey, receiver) {
            if (model == null)
                return Reflect.get(target, propKey, receiver);
            if (propKey == "model")
                return model.get();
            if (propKey == "unbind")
                return unbind;
        }
        function setter(target, propKey, value) {
            if (!proxy || propKey !== "model")
                return Reflect.set(target, propKey, value);
            view.api.trigger("$/before/bind", [value], false);
            if (model) {
                // nothing to do.
            } else if ($.isArray(value)) {
                model = bd.bindArray(view);
            } else if ($.isPlainObject(value)) {
                if (!view.fdr)
                    throw Error("a PlainObject is not allow to bind a htmltag!");
                model = bd.bindObject(view);
            } else if (bd.isLiteral(value)) {
                model = bd.bindLiteral(view, propKey);
            }
            model.set(value);
            view.api.trigger("$/after/bind", [value, proxy.model], false);
            return true;
        }
        function unbind() {
            model.unbind();
            model = null;
        }
        function delter(target, propKey) {
            if (model && propKey == "model") {
                model.del();
                proxy = model = null;
            }
            return Reflect.deleteProperty(target, propKey);
        }
        proxy.model = value;
        return proxy;
    }
};

let ClientElementAPI = {
    css: function (name, value) {
        let elem = this.elem();
        if (value == undefined) {
            name = (name + '').replace(/([A-Z])/g, "-$1").toLowerCase();
            return elem.style[name] || getComputedStyle(elem, "").getPropertyValue(name);
        }
        typeof value == "number" && (value += '');
        elem.style[name] = value;
        return this;
    },
    show: function () {
        let elem = this.elem(),
            style = elem.style;
        style.display == "none" && (style.display = "")
        if (getComputedStyle(elem, "").display == "none")
            style.display = hp.defDisplay(elem.nodeName);
        return this;
    },
    hide: function () {
        this.elem().style.display = "none";
        return this;
    },
    width: function (value) {
        let elem = this.elem();
        if (value === undefined)
            return elem.getBoundingClientRect().width;
        elem.style.width = parseFloat(value) + "px";
        return this;
    },
    outerWidth: function (includeMargins) {
        let elem = this.elem();
        if (includeMargins) {
            let styles = getComputedStyle(elem, null);
            return elem.offsetWidth + parseFloat(styles.getPropertyValue('margin-right')) + parseFloat(styles.getPropertyValue('margin-left'));
        }
        return elem.offsetWidth;
    },
    height: function (value) {
        let elem = this.elem();
        if (value === undefined)
            return elem.getBoundingClientRect().height;
        elem.style.height = parseFloat(value) + "px";
        return this;
    },
    outerHeight: function (includeMargins) {
        let elem = this.elem();
        if (includeMargins) {
            let styles = getComputedStyle(elem, null);
            return elem.offsetHeight + parseFloat(styles.getPropertyValue('margin-bottom')) + parseFloat(styles.getPropertyValue('margin-top'));
        }
        return elem.offsetHeight;
    },
    offset: function (coordinates) {
        let elem = this.elem();
        if (coordinates) {
            let parentOffset = hp.offset(hp.offsetParent(elem));
            elem.style.top = coordinates.top  - parentOffset.top + "px";
            elem.style.left = coordinates.left  - parentOffset.left + "px";
            (hp.css(elem,'position') == 'static') && (elem.style.position = 'relative');
            return this;
        }
        let obj = elem.getBoundingClientRect();
        return {
            left: obj.left + pageXOffset,
            top: obj.top + pageYOffset,
            width: Math.round(obj.width),
            height: Math.round(obj.height)
        };
    },
    position: function  () {
        let elem = this.elem(),
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
        let elem = this.elem(), 
            hasScrollTop = "scrollTop" in elem;
        if (value === undefined) 
            return hasScrollTop ? elem.scrollTop : elem.pageYOffset
        hasScrollTop ? (elem.scrollTop = value) : elem.scrollTo(elem.scrollX, value);
        return this;
    },
    scrollLeft: function (value) {
        let elem = this.elem(),
            hasScrollLeft = "scrollLeft" in elem;
        if (value === undefined)
            return hasScrollLeft ? elem.scrollLeft : elem.pageXOffset
        hasScrollLeft ? (elem.scrollLeft = value) : elem.scrollTo(value, elem.scrollY);
        return this;
    }
};

let ServerElementAPI = {
    css: function (name, value) {
        let table = {},
            elem = this.elem(),
            style = elem.getAttribute("style") || "",
            regexp = /(.+?):(.+?);/ig;
        while (regexp.test(style))
            table[RegExp.$1] = RegExp.$2;
        if (value === undefined)
            return table[name];
        value == null ? (delete table[name]) : (table[name] = value);
        let buf = [];
        for (let k in table)
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

let TextElementAPI = (function () {
    let api = {};
    ["before","replace","prev","next","guid","toString"].forEach(key => {
        api[key] = CommonElementAPI[key];
    });
    api.text = function (value) {
        if (value == undefined)
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

let ShareElementAPI = {
    remove: function () {
        let k = this.dir + "/" + this.node.localName;
        this.env.share[k].copys.forEach(function( item ) {
            item.api.remove();
        });
        delete this.env.share[k];
        CommonElementAPI.remove.call(this);
    }
};

let CopyElementAPI = {
    remove: function () {
        let k = this.dir + "/" + this.node.localName,
            s = this.env.share[k];
        CommonElementAPI.remove.call(this);
        s.copys.splice(s.copys.indexOf(this), 1);
    }
};

let TextElement = (function() {
    let types = [,,,"TextNode","CDATASection",,,,"Comment"];
    return (node, parent) => {
        let o = { uid: $.guid() };
        o.typ = node.nodeType;
        o.ele = rdoc["create" + types[o.typ]](node.nodeValue);
        return o;
    };
}());

function HtmlElement(node, parent) {
    let o = { typ: 0, elem: hp.elem, uid: $.guid() };
    o.appendTo = hp.appendTo;
    return o;
}

function CompElement(node, parent) {
    let o = { typ: 1, elem: hp.elem, uid: $.guid(), appendTo: hp.appendTo };
    o.fdr = Finder(o);
    o.back = hp.build(o, NodeElementAPI);
    return o;
}

function TextManager() {
    let table = {};
    function create(env, node, parent) {
        let k = node.nodeType,
            o = (table[k] || (table[k] = [])).pop() || TextElement(node, parent);
        o.ele.textContent = node.textContent;
        o.env = env, o.node = node, node.uid = o.uid;
        parent.appendChild(o.ele);
        return Store[o.uid] = o;
    }
    function recycle(item) {
        delete Store[item.uid];
        table[item.typ].push(item);
    }
    function chenv(env, item) {
        item.env = env;
    }
    return { create: create, recycle: recycle, chenv: chenv };
}

function HtmlManager() {
    let table = {};
    function create(env, node, parent) {
        let k = node.nodeName,
            o = (table[k] || (table[k] = [])).pop() || HtmlElement(node, parent);
        resetAttrs(env, node, aliasMatch(env, node));
        o.ele = hp.createElement(node, parent);
        o.api = o.back;
        o.env = env, o.node = node, node.uid = o.uid, o.ele.xmlTarget = o;
        return Store[o.uid] = o;
    }
    function recycle(item) {
        let i = 0, o,
            c = XPath.select("./*", item.node); 
        for (; i < c.length; i++) {
            o = Store[c[i].uid];
            Manager[o.typ].recycle(o);
        }
        delete Store[item.uid];
        MessageModuleAPI.remove(item);
        item.env.smr.remove(item);
        EventModuleAPI.remove(item);
        table[item.node.nodeName].push(item);
    }
    function chenv(env, item) {
        let i = 0, o, c = item.node.childNodes;
        for (; i < c.length; i++) {
            o = Store[c[i].uid];
            Manager[o.typ].chenv(env, o);
        }
        item.env = env;
    }
    return { create: create, recycle: recycle, chenv: chenv };
}

function setComponent(env, ins) {
    let share = ins.env.share[ins.dir + "/" + ins.node.localName];
    if (!share) {
        ins.api = ins.back;
    } else if (share.ins) {
        ins.xml.replaceChild(vdoc.createElement("void"), ins.xml.lastChild);
        ins.api = hp.build(ins, CopyElementAPI);
        share.copys.push(ins);
        ins.fun = () => { return share.ins.value };
    } else {
        ins.api = hp.build(ins, ShareElementAPI);
        share.ins = ins, share.copys = [];
    }
    return ins;
}

function CompManager() {
    let table = [];
    function create(env, node, parent) {
        let w = PM.component(env.dir, node);
        if (!w) return;
        let o = table.pop() || CompElement(node, parent);
        o.map = $.extend(true, {}, w.map);
        o.opt = $.extend(true, {}, w.opt);
        o.cfg = $.extend(true, {}, w.cfg);
        // aid: appid, cid: classid
        o.dir = w.dir, o.css = w.css, o.ali = w.ali, o.fun = w.fun, o.cid = w.cid;
        o.smr = env.smr, o.env = env, o.node = node, o.aid = env.aid, node.uid = o.uid;
        let exprs = aliasMatch(env, node);
        resetAttrs(env, node, exprs);
        resetConfigs(env, node, exprs);
        resetOptions(env, o, exprs);
        o.share = $.extend({}, env.share);
        o.map.share.forEach(item => {
            let p = ph.fullPath(o.dir, item),
                s = ph.split(p);
            if (Library[s.dir] && Library[s.dir][s.basename])
                return o.share[p] = {};
            throw Error(`Shared object ${p} not found`);
        });
        o.xml = w.xml.cloneNode(true);
        return Store[o.uid] = setComponent(env, o);
    }
    function recycle(item) {
        let i = 0, o, 
            c = XPath.select("./*", item.node),
            deep = Store[item.xml.lastChild.uid];
        for (; i < c.length; i++) {
            o = Store[c[i].uid];
            Manager[o.typ].recycle(o);
        }
        Manager[deep.typ].recycle(deep);
        delete Store[item.uid];
        MessageModuleAPI.remove(item);
        item.smr.remove(item);
        EventModuleAPI.remove(item);
        table.push(item);
    }
    function chenv(env, item) {
        let i = 0, o, c = item.node.childNodes;
        for (; i < c.length; i++) {
            o = Store[c[i].uid];
            Manager[o.typ].chenv(env, o);
        }
        item.env = env;
    }
    return { create: create, recycle: recycle, chenv: chenv };
}

function StyleManager() {
    let table = {},
        WELL = /#(?=([^}])+?{)/ig,
        parent = rdoc.body ? rdoc.getElementsByTagName("head")[0] : rdoc.createElement("void");
    function cssText(ins) {
        let klass = ins.aid + ins.cid,
            text = ins.css.replace(WELL, "." + klass).replace(/\$/ig, klass);
        return rdoc.createTextNode(text);
    }
    function newStyle(ins) {
        let style = rdoc.createElement("style");
        style.appendChild(cssText(ins));
        return parent.appendChild(style);
    }
    function create(ins) {
        let key = ins.env.aid + ins.cid;
        if (table[key]) {
            table[key].count++;
        } else if (ins.css) {
            table[key] = { count: 1, style: newStyle(ins), ins: ins };
        }
        let id = ins.node.getAttribute("id");
        if (id && ins.env.css.indexOf("#" + id) != -1) {
            hp.addClass(ins.elem(), ins.env.aid + ins.env.cid + id);
        }
    }
    function remove(ins) {
        let key = ins.env.aid + ins.cid,
            item = table[key];
        if (item && --item.count == 0) {
            parent.removeChild(item.style);
            delete table[key];
        }
    }
    function style() {
        let i, temp = [], kids = parent.childNodes;
        for (i = 0; i < kids.length; i++)
            if (kids[i].nodeType == 1)
                temp.push(kids[i].textContent);
        return temp.join("");
    }
    return { create: create, remove: remove, style: style };
}

function PackageManager() {
    // This array is used to store the inherited components temporarily.
    let Extends = [];
    // The Source is used to help implement the inheritance of components.
    let Source = {};
    function assert(obj) {
        if ($.type(obj.css) != "string")
            throw Error("Invalid css, expected a string");
        if (!$.isFunction(obj.fun)) 
            throw Error("Invalid fun, expected a function");
        ["opt","cfg","map","ali"].forEach(key => {
            if (!$.isPlainObject(obj[key]))
                throw Error(`Invalid ${key} expected a plainObject`);
        });
        ["cfgs","attrs"].forEach(key => {
            if (!$.isPlainObject(obj.map[key])) 
                throw Error(`Invalid ${key} in map, expected a plainObject`);
        });
        if ($.type(obj.map.share) != "string") 
            throw Error("Invalid share in map, expected a string");
        if ($.type(obj.xml) != "string" && obj.xml !== undefined) 
            throw Error("Invalid xml, expected a undefined value or a string");
    }
    function resetInput(item) {
        for (let key in item) {
            if (typeof item[key] != "string") 
                continue;
            let i, tmp, buf = {},
                list = item[key].split(' ');
            for (i = 0; i < list.length; i++) {
                tmp = list[i].split("->");
                buf[tmp[0]] = tmp[1] || tmp[0];
            }
            item[key] = buf;
        }
    }
    function init(obj, name, space) {
        if (Library[space][name])
            console.warn(`Component [${space}/${name}] already exists`);
        Source[space][name] = obj;
        Library[space][name] = obj = $.extend(true, {}, Template, obj);
        xmlplus.debug && assert(obj);
        obj.dir = space;
        obj.cid = $.guid();
        // initialize
        let map = obj.map;
        resetInput(map.attrs), resetInput(map.cfgs);
        map.share = map.share ? map.share.split(' ') : [];
        let root = obj.dir.split('/')[0];
        obj.xml = $.parseXML(obj.xml || "<void/>");
    }
    function source(dir, patt) {
        let s = ph.split(ph.fullPath(dir, patt));
        return Source[s.dir] && Source[s.dir][s.basename];
    }
    function component(dir, node) {
        let p = ph.fullPath(dir, node.namespaceURI || "");
        return Library[p] && Library[p][node.localName.toLowerCase()];
    }
    function extend(target, source) {
        let result = {},
            extend = target.map.extend;
        result.xml = target.xml || source.xml;
        ["opt","cfg","map"].forEach(key => {
            result[key] = (extend[key] == "r") ? target[key] : $.extend({}, source[key], target[key]);
        });
        if (extend.fun == "r" || !source.fun) {
            result.fun = target.fun;
        } else if (!target.fun) {
            result.fun = source.fun;
        } else {
            result.fun = function (sys, items, opts) {
                let foo = source.fun.call(this, sys, items, opts);
                let bar = target.fun.call(this, sys, items, opts);
                return bar ? $.extend(foo, bar) : foo;
            };
        }
        result.css = (extend.css == "r") ? target.css : (source.css || '') + (target.css || '');
        return result;
    }
    function imports(items, space) {
        if (!$.isPlainObject(items))
            throw Error("Invalid components, expected a plainObject");
        for (let name in items) {
            let map = items[name].map,
                iname = name.toLowerCase();
            if (map && map.extend && $.type(map.extend.from) == "string") {
                Extends.push({name: iname, space: space, src: items[name] });
            } else {
                init(items[name], iname, space);
            }
        }
        [].slice.call(Extends).forEach(item => {
            let target = source(item.space, item.src.map.extend.from);
            if (target) {
                Extends.splice(Extends.indexOf(item), 1);
                init(extend(item.src, target), item.name, item.space);
            }
        });
        return this;
    }
    function makePackage(root, space) {
        if (!Library[space]) {
            Source[space] = {};
            Library[space] = {};
        }
        return { imports: items => { return imports(items, space) } };
    }
    return { make: makePackage, component: component };
}

function Finder(env) {
    function assert(expr, context) {
        if (typeof expr != "string")
            throw Error("Invalid expression, expected a string");
        if (context === undefined)
            return env.xml;
        if ($.isSystemObject(context))
            return Store[context.guid()].node;
        throw Error("Invalid context, expected a SystemObject");
    }
    function sys(expr, context) {
        context = assert(expr, context);
        let result = new Collection,
            list = XPath.select(expr, context);
        for (let i = 0; i < list.length; i++)
            result.push(hp.create(Store[list[i].uid]).api);
        return result;
    }
    function items(expr, context) {
        context = assert(expr, context);
        let result = new Collection,
            list = XPath.select(expr, context);
        for (let i = 0; i < list.length; i++)
            result.push(Store[list[i].uid].value);
        return result;
    }
    function refresh() {
        for (let i in items) {
            delete sys[i];
            delete items[i];
        }
        for (let i in env.ali) {
            sys[i] = sys(env.ali[i]);
            items[i] = new Collection;
            for (let k = 0; k < sys[i].length; k++)
                items[i].push(sys[i][k].val());
            sys[i].call("addClass", env.aid + env.cid + i);
        }
        (function parse(node) {
            let id = node.getAttribute("id");
            if (id) {
                let item = hp.create(Store[node.uid]);
                sys[id] = item.api;
                items[id] = item.value;
            }
            let i, kids = node.childNodes;
            for (i = 0; i < kids.length; i++)
                kids[i].nodeType == 1 && parse(kids[i]);
        }(env.xml.lastChild));
    }
    return { sys: sys, items: items, refresh: refresh };
}

function aliasMatch(env, node) {
    let k, exprs = {};
    for (k in env.ali)
        if (hp.nodeIsMatch(env.xml, env.ali[k], node))
            exprs[k] = 1;
    return exprs;
}

function resetAttrs(env, node, exprs) {
    let k, attrs = {},
        id = node.getAttribute("id");
    for (k in exprs)
        $.extend(attrs, env.map.attrs[k]);
    if (id && env.map.attrs[id])
        attrs = $.extend(attrs, env.map.attrs[id]);
    for (k in attrs) {
        if (env.opt[k] != null)
            node.setAttribute(attrs[k], env.opt[k]);
    }
}

function resetConfigs(env, node, exprs) {
    let k, cfgs = {},
        id = node.getAttribute("id");
    for (k in exprs)
        $.extend(cfgs, env.map.cfgs[k]);
    if (id && env.map.cfgs[id])
        cfgs = $.extend(cfgs, env.map.cfgs[id]);
    for (k in cfgs) {
        env.cfg[id] = env.cfg[id] || {};
        if (env.opt[k] != null)
            env.cfg[id][cfgs[k]] = env.opt[k];
    }
}

function resetOptions(env, ins, exprs) {
    let i, k, o, list,
        id = ins.node.getAttribute("id");
    for (k in exprs)
        $.extend(ins.opt, env.cfg[k]);
    if (id && env.cfg[id])
        $.extend(ins.opt, env.cfg[id]);
    for (i = 0; i < ins.node.attributes.length; i++) {
        o = ins.node.attributes[i];
        o.prefix || (ins.opt[o.name] = o.value);
    }
}

// Here, the component is parsed recursively.
function parseEnvXML(env, parent, node) {
    function iterate( node, parent ) {
        if (node.nodeType > 1) {
            if (Manager[node.nodeType])
                return Manager[node.nodeType].create(env, node, parent);
            throw Error("Create failed, invalid node");
        }
        let i, ins;
        if (isHTML[node.nodeName]) {
            ins = Manager[0].create(env, node, parent);
            for (i = 0; i < node.childNodes.length; i++)
                iterate(node.childNodes[i], ins.ele);
            env.smr.create(ins);
        } else if ((ins = Manager[1].create(env, node, parent))) {
            parseEnvXML(ins, parent, ins.xml.lastChild);
            ins.fdr.refresh();
            let appendTo = ins.appendTo();
            for (i = 0; i < node.childNodes.length; i++)
                iterate(node.childNodes[i], appendTo);
            env.smr.create(ins);
            ins.value = ins.fun.call(ins.api, ins.fdr.sys, ins.fdr.items, ins.opt);
        } else {
            xmlplus.debug && console.warn($.serialize(node) + " not found");
            ins = Manager[0].create(env, node, parent);
            for (i = 0; i < node.childNodes.length; i++)
                iterate(node.childNodes[i], ins.ele);
            env.smr.create(ins);
        }
        return ins;
    }
    return iterate(node, parent);
}

function xmlplus(root, callback) {
    if ($.type(root) != "string" || root.indexOf('/') > -1)
        throw Error("Invalid root, expected a string which not contains '/'");
    if (!$.isFunction(callback))
        throw Error("Invalid callback, expected a function");
    function createPackage(space) {
        if ($.type(space) != "string" && space != null)
            throw Error("Invalid namespace, expected a null value or a string");
        return PM.make(root, space ? (root + "/" + space) : root);
    }
    callback.call(xmlplus, xmlplus, createPackage);
    return xmlplus;
}

// The entry function, which will be assigned to xmlplus.
function startup(xml, parent, param) {
    let env = $.extend(true, {xml: hp.parseToXML(xml), cid: $.guid(), share: {}, dir: ""}, Template);
    if (env.xml.nodeType !== ELEMENT_NODE)
        throw Error("Target type must be ELEMENT_NODE");
    if ($.isPlainObject(parent)) {
        param = parent;
        parent = rdoc.body || rdoc.lastChild;
    } else if (parent === undefined) {
        parent = rdoc.body || rdoc.lastChild;
    } else if (typeof parent == "string") {
        parent = rdoc.getElementById(parent);
        if (!parent)
            throw Error(`Parent element ${parent} not found`);
    }
    env.fdr = Finder(env);
    env.smr = StyleManager();
    env.aid = inBrowser ? $.guid() : "";
    env.api = hp.build(env, NodeElementAPI);
    if ($.isPlainObject(param)) {
        env.xml.getAttribute("id") || env.xml.setAttribute("id", $.guid());
        env.cfg[env.xml.getAttribute("id")] = param;
    }
    env.xml = env.xml.parentNode || vdoc.cloneNode().appendChild(env.xml).parentNode;
    let fragment = rdoc.createDocumentFragment();
    let instance = parseEnvXML(env, fragment, env.xml.lastChild);
    parent.appendChild(fragment);
    return $.extend(hp.create(instance).api, {style: env.smr.style});
}

(function () {
    if (inBrowser) {
        XPath = window.xpath || { select: hp.xpathQuery };
        DOMParser_ = DOMParser;
        XMLSerializer_ = XMLSerializer;
        rdoc = document;
        vdoc = $.parseXML("<void/>");
        NodeElementAPI = $.extend(ClientElementAPI, EventModuleAPI, MessageModuleAPI, CommonElementAPI);
        window.xmlplus = window.xp = $.extend(xmlplus, $);
        if (typeof define === "function" && define.amd)
            define("xmlplus", [], () => { return xmlplus });
        $.ready(() => {
            rdoc.body.getAttribute("init") == "false" || hp.parseHTML(rdoc.body);
        });
    } else {
        delete $.ready;
        XPath = require("xpath");
        DOMParser_ = require("exmldom").DOMParser;
        XMLSerializer_ = require("exmldom").XMLSerializer;
        vdoc = $.parseXML("<body/>");
        rdoc = $.parseXML("<body/>");
        NodeElementAPI = $.extend(ServerElementAPI, EventModuleAPI, MessageModuleAPI, CommonElementAPI);
        module.exports = $.extend(xmlplus, $);
    }
    CopyElementAPI = $.extend({}, NodeElementAPI, CopyElementAPI);
    ShareElementAPI = $.extend({}, NodeElementAPI, ShareElementAPI);
}());

}(typeof navigator !== "undefined" && navigator.userAgent));