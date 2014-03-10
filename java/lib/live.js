/**
 * Dirty node.js check
 * @see http://stackoverflow.com/a/18057506/2207790
 */
var isNode = 
    typeof global !== "undefined" && 
    {}.toString.call(global) == '[object global]';

if (isNode) {
    try {
        var WebSocket = require('ws');
    } catch (e) {
        console.warn ('COLT requires https://github.com/einaros/ws in order to work under node.js')
    }
} else if (window != top) {
    LogUtil = top.LogUtil;
    LiveCodeRegistry = top.LiveCodeRegistry;
    LiveCodingCodeFlowUtil = top.LiveCodingCodeFlowUtil;
    console = top.console;
}

if ([].indexOf == undefined) {
    Array.prototype.indexOf = function(obj, start) {
        for (var i = (start || 0), j = this.length; i < j; i++) {
            if (this[i] === obj) { return i; }
        }
        return -1;
    }
}

if (!Date.now) {
    Date.now = function () {
        return (new Date()).getTime();
    };
}

// https://github.com/douglascrockford/JSON-js/blob/master/cycle.js
if (typeof JSON.decycle !== 'function') {
    JSON.decycle = function decycle(object) {
        'use strict';

// Make a deep copy of an object or array, assuring that there is at most
// one instance of each object or array in the resulting structure. The
// duplicate references (which might be forming cycles) are replaced with
// an object of the form
//      {$ref: PATH}
// where the PATH is a JSONPath string that locates the first occurance.
// So,
//      var a = [];
//      a[0] = a;
//      return JSON.stringify(JSON.decycle(a));
// produces the string '[{"$ref":"$"}]'.

// JSONPath is used to locate the unique object. $ indicates the top level of
// the object or array. [NUMBER] or [STRING] indicates a child member or
// property.

        var objects = [],   // Keep a reference to each unique object or array
            paths = [];     // Keep the path to each unique object or array

        return (function derez(value, path) {

// The derez recurses through the object, producing the deep copy.

            var i,          // The loop counter
                name,       // Property name
                nu;         // The new object or array

// typeof null === 'object', so go on if this value is really an object but not
// one of the weird builtin objects.

            if (typeof value === 'object' && value !== null &&
                !(value instanceof Boolean) &&
                !(value instanceof Date)    &&
                !(value instanceof Number)  &&
                !(value instanceof RegExp)  &&
                !(value instanceof String)) {

// If the value is an object or array, look to see if we have already
// encountered it. If so, return a $ref/path object. This is a hard way,
// linear search that will get slower as the number of unique objects grows.

                for (i = 0; i < objects.length; i += 1) {
                    if (objects[i] === value) {
                        return {$ref: paths[i]};
                    }
                }

// Otherwise, accumulate the unique value and its path.

                objects.push(value);
                paths.push(path);

// If it is an array, replicate the array.

                if (Object.prototype.toString.apply(value) === '[object Array]') {
                    nu = [];
                    for (i = 0; i < value.length; i += 1) {
                        nu[i] = derez(value[i], path + '[' + i + ']');
                    }
                } else {

// If it is an object, replicate the object.

                    nu = {};
                    for (name in value) {
                        if (Object.prototype.hasOwnProperty.call(value, name)) {
                            nu[name] = derez(value[name],
                                path + '[' + JSON.stringify(name) + ']');
                        }
                    }
                }
                return nu;
            }
            return value;
        }(object, '$'));
    };
}

if (!isNode && (self != top)) {
    // mercurial copies this into their frame - we need to prevent code below from running
    var LogUtil = top.LogUtil;
    var LiveCodeRegistry = top.LiveCodeRegistry;
    var LiveCodingCodeFlowUtil = top.LiveCodingCodeFlowUtil;
    var console = top.console;
}

/**
 * @author mrdoob / http://mrdoob.com/
 * @see https://github.com/mrdoob/eventdispatcher.js
 */

var EventDispatcher = function () {}

EventDispatcher.prototype = {

    constructor: EventDispatcher,

    apply: function ( object ) {

        object.addEventListener = EventDispatcher.prototype.addEventListener;
        object.hasEventListener = EventDispatcher.prototype.hasEventListener;
        object.removeEventListener = EventDispatcher.prototype.removeEventListener;
        object.dispatchEvent = EventDispatcher.prototype.dispatchEvent;

    },

    addEventListener: function ( type, listener ) {

        if ( this._listeners === undefined ) this._listeners = {};

        var listeners = this._listeners;

        if ( listeners[ type ] === undefined ) {

            listeners[ type ] = [];

        }

        if ( listeners[ type ].indexOf( listener ) === - 1 ) {

            listeners[ type ].push( listener );

        }

    },

    hasEventListener: function ( type, listener ) {

        if ( this._listeners === undefined ) return false;

        var listeners = this._listeners;

        if ( listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== - 1 ) {

            return true;

        }

        return false;

    },

    removeEventListener: function ( type, listener ) {

        if ( this._listeners === undefined ) return;

        var listeners = this._listeners;
        var index = listeners[ type ].indexOf( listener );

        if ( index !== - 1 ) {

            listeners[ type ].splice( index, 1 );

        }

    },

    dispatchEvent: function ( event ) {

        if ( this._listeners === undefined ) return;

        var listeners = this._listeners;
        var listenerArray = listeners[ event.type ];

        if ( listenerArray !== undefined ) {

            event.target = this;

            for ( var i = 0, l = listenerArray.length; i < l; i ++ ) {

                listenerArray[ i ].call( this, event );

            }

        }

    }

};


// LogUtil
if (this["LogUtil"] == undefined) {
    LogUtil = {
        host : "127.0.0.1",
        port : 6127,
        socket : null,
        messages : [],
        clientId : Date.now() + "",
        tabsString : "",
        pongDisable : false,
        muted : false,
        ajaxInterval : -1,
        flush : function () {
            // phonegap on android relies on plugins for WebSocket,
            // so it is not going to be available immediately
            if (typeof WebSocket == "undefined") {
                if (LogUtil.ajaxInterval < 0) {
                    LogUtil.ajaxInterval = setInterval (function () {
                        if ( !(LogUtil.pongDisable) ) {
                            // pong();
                            // inlined
                            LogUtil.log("pong", "", "", "", "");
                        }
                    }, 1000);
                }

                if (LogUtil.messages.length > 0) {
                    setTimeout(function () {
                        var m = LogUtil.messages.shift();

                        var s = document.getElementById('colt-ajax');
                        if (s) s.parentNode.removeChild(s);

                        // https://gist.github.com/calvinf/817519
                        var el = document.createElement('script');
                        el.async = false;
                        el.src = 'http://' + LogUtil.host + ':' + LogUtil.port + '/ajax/?clientId=' + LogUtil.clientId +
                            '&message=' + encodeURIComponent(m); //+ '&d=' + Date.now();
                        el.type = 'text/javascript';
                        el.id = 'colt-ajax';
                        (document.getElementsByTagName('HEAD')[0]||document.body).appendChild(el);

                    }, 50);
                }

                return;
            }

            if (LogUtil.socket == null) {
                // initSocket()
                LogUtil.socket = new WebSocket('ws://' + LogUtil.host + ':' + LogUtil.port + '/live/');
                LogUtil.socket.onopen = function () {
                    LogUtil.flush ();
                }
                LogUtil.socket.onclose = function (e) {
					//console.log2(':( lost socket, error code: ' + e.code + ', reason: ' + e.reason);
                    LogUtil.socket = null;
                }

                LogUtil.socket.onmessage = function (e) {
                    LogUtil.onMessage(e);
                }

                LogUtil.socket.onerror = function (e) {
                }
            } else if (LogUtil.socket.readyState == 1) {
                while (LogUtil.messages.length > 0) {
					//console.log2(">> sending: " + this.messages[0]);
                    LogUtil.socket.send (LogUtil.messages.shift());
                }
            }
        },
        handleMessages : function (array) {
            while (array.length > 0) LogUtil.onMessage({ data: array.shift() });
        },
        onMessage : function (e) {
            e.data = e.data.replace(/^\W+/, "");
            if ( /^ping$/.test(e.data) ) {
                if ( !(LogUtil.pongDisable) ) {
                    // pong();
                    // inlined
                    LogUtil.log("pong", "", "", "", "");
                }
            } else if (/^reload$/.test(e.data)) {
                LogUtil.socket.close(); top.location.reload(true);
            } else if (/^runMethod/.test(e.data)) {
                try {
                    var rmMethodId = /^runMethod:(.+)$/.exec(e.data)[1];
                    var rmMethodEvaluator = LiveCodeRegistry.getInstance().evaluators[rmMethodId];
                    if (rmMethodEvaluator) {
                        var rmMethodBody = LiveCodeRegistry.getInstance().getMethod(rmMethodId);

                        // get rid of sourcemap comment
                        rmMethodBody = rmMethodBody.substr(0, rmMethodBody.lastIndexOf("//"));

                        var rmSignature = rmMethodBody.match(/function[^(]*(\([^(]*\))/)[1];
                        rmMethodEvaluator(rmMethodBody + rmSignature);
                    } else {
                        // fallback to evaluating directly
                        eval(LiveCodeRegistry.getInstance().getMethod(/^runMethod:(.+)$/.exec(e.data)[1]))();
                    }
                    // incCallCount call is not on method body, so call it here explicitly
                    LiveCodeRegistry.getInstance().incCallCount(rmMethodId);
                } catch (ignore) {
                    ;
                }
            } else if (/^getContext/.test(e.data)) {
                //console.log2("Received request: " + e.data)
                var fpArgs = /^getContext(\d):(.*)::(.+)$/.exec(e.data);
                var fpMethodIds = fpArgs[2].split(",");
                var fpExpression = fpArgs[3];

                var fpMethodId = "", fpEvaluator;

                // CJ-977
                for (var mid = fpMethodIds.length -1; mid > -1; mid--) {
                    fpMethodId = fpMethodIds[mid]
                    fpEvaluator = LiveCodeRegistry.getInstance().evaluators[fpMethodId];
                    if (fpEvaluator) break;
                }

                // CJ-911
                if ((fpMethodId != "") && !fpEvaluator) {
                    try {
                        LogUtil.muted = true;
                        eval(LiveCodeRegistry.getInstance().getMethod(fpMethodId))();
                    } catch (hmm) {} finally {
                        LogUtil.muted = false;
                    }
                    fpEvaluator = LiveCodeRegistry.getInstance().evaluators[fpMethodId];
                }

                //if (fpExpression == "$scope") console.log("fpExpr: " + fpExpression + ", fpEvaluator: " + fpEvaluator);
                try {
                    var fpObject = ((fpMethodId != "") && fpEvaluator) ? fpEvaluator(fpExpression)[0] : eval(fpExpression);
                    //if (parseInt( fpArgs[1] ) == 1) console.log("fpExpression: " + fpExpression + ", fpObject: " + fpObject);
                    var fpResults;
                    switch (parseInt( fpArgs[1] )) {
                        case 1:
                            // list properties
                            var propertyList = [];

                            try {
                                propertyList = Object.getOwnPropertyNames(fpObject);
                            } catch (failsForLiteralsEtc) {}

                            for (var enumerableProperty in fpObject) {
                                if (propertyList.indexOf(enumerableProperty) < 0) {
                                    propertyList.push(enumerableProperty);
                                }
                            }

                            if (fpObject) for (var jsClass in LogUtil.JS_CLASSES) {
                                if ((jsClass == "Object") ||
                                    (fpObject == eval(jsClass)) || (fpObject.__proto__ == eval(jsClass).prototype)) {

                                    var jsClassList = LogUtil.JS_CLASSES[jsClass];
                                    for (var p = 0; p < jsClassList.length; p++) {
                                        var jsClassProperty = jsClassList[p];
                                        // http://jsfiddle.net/yM7dy/
                                        try {
                                            if ((fpObject[jsClassProperty] !== undefined) && (propertyList.indexOf(jsClassProperty) < 0)) {
                                                propertyList.push(jsClassProperty);
                                            }
                                        } catch (stupidAccessException) {
                                            // ignore - jsClassProperty is simply not added to propertyList
                                        }
                                    }
                                }
                            }

                            fpResults = [];
                            for (var p = 0; p < propertyList.length; p++) {
                                var fpProperty = propertyList[p];
                                if (/^\d/.test(fpProperty)) continue;
                                // http://jsfiddle.net/yM7dy/
                                try {
                                    var propInfo = fpProperty + LogUtil.signature(fpObject[fpProperty]);
                                    fpResults.push(propInfo);
                                } catch (stupidAccessException) {
                                    // ignore - propInfo is simply not added to fpResults
                                }
                            }
                            break;
                        case 2:
                            // return value
                            fpResults = fpObject;
                            break;
                        case 3:
                            // find method id
                            fpResults = LiveCodeRegistry.getInstance().extractMethodId(fpObject);
                            break;
                    }

                    var fpResultsStr;
                    try {
                        fpResultsStr = JSON.stringify(JSON.decycle(fpResults));
                    } catch (woops) { /* probably self-reference */ }

                    if (fpResultsStr == undefined) {
                        if (fpResults) {
                            // functions etc
                            fpResultsStr = JSON.stringify(fpResults.toString());
                        } else {
                            fpResultsStr = "undefined";
                        }
                    }

                    //console.log2("getContextResult = " + fpResultsStr)
                    LogUtil.log("getContextResult", "", "", "", fpResultsStr);
                    //console.log2("...sent")
                } catch (fpError) {
                    // no evaluator or evaluation runtime error
                    var errorMessage = fpError ? (fpError.message ? fpError.message : fpError.toString()) : "undefined";
                    //console.log("shit: " + errorMessage + ", stack: " + fpError.stack);
                    LogUtil.log("getContextError", "", "", "", errorMessage);
                }
            } else {
				//console.log2("<< receiving: " + e.data);
                LogUtil.dispatchEvent({ type: "data", detail: e.data });
            }
        },
        signature : function (f) {
            // if f is a function, try to figure out its signature
            if (f && (f.constructor == Function)) {
                try {
                    var methodId = null;
                    try {
                        methodId = LiveCodeRegistry.getInstance().extractMethodId(f);
                    } catch (methodIsNotLive) { /* why would it throw... but it does */ }

                    var methodBody = null;
                    if (methodId && methodId.length > 0) {
                        // this is live method - take the signature from the registry
                        methodBody = LiveCodeRegistry.getInstance().getMethod(methodId);
                    } else {
                        // native or livecoding-disabled method
                        methodBody = f.toString();
                    }
                    return methodBody.match(/function[^(]*(\([^(]*\))/)[1];
                } catch (whatever) {
                    // failed to find signature - just mark it as a function
                    return "()";
                }
            }
            // not a function
            return "";
        },
        log : function ( severity, nodeId, modelId, rootFQN, messageString, exception ) {
            if (LogUtil.muted) return;
            //if(severity == "changes") console.log2("log: " + messageString)

            messageString = messageString.replace(/(\n|\r)+/, "\r");

            var stack = "";
            if (exception) {
                stack = exception.stack;
                if (stack.length > 2000) {
                    stack = stack.substr(0, 1000) + "\n...\n" + stack.substr(-1000);
                }
            }

            var xmlMessageString = "|" + this.tabsString + messageString;

            if (severity == "changes" || severity == "mercuryEdit") {
                xmlMessageString = "<![CDATA[" + messageString + "]]>";
            } else if (severity == "trace" || severity == "error" || severity == "getContextResult" || severity == "getContextError") {
                xmlMessageString = "<![CDATA[" + xmlMessageString + "]]>";
            }

            var xmlMessage = '<logMessage clientId="' + this.clientId + '">' +
                    '<source nodeId="' + nodeId + '" modelReference="' + modelId + '" />' +
                    '<message severity="' + severity + '" >' + xmlMessageString + '</message>' +
                    '<root>' + rootFQN + '</root>' +
                    '<timestamp>' + Date.now() + '</timestamp>' +
                    '<stackTrace><![CDATA[' + stack + ']]></stackTrace>' +
                    '<scopes/>' + // do we need scopes...
                    '</logMessage>';

            LogUtil.messages.push(xmlMessage);

            LogUtil.flush();

            return messageString;
        },
        enterLogScope : function () { /* todo */ },
        exitLogScope : function () { /* todo */ },
        startLiveCodingSession : function ( broadcastId ) {
            // colt-as uses OS, ARCH, L, R from Capabilities.serverString
			var n, s;
			if (isNode) {
				n = {
					platform : "node.js",
					oscpu : "todo",
					language : "todo"
				}
				s = {
					width : 0,
					height : 0
				}
			} else {
				n = navigator;
				s = screen;
			}
            var serverString =
                    "OS=" + escape( n.platform ) +
                            "&amp;ARCH=" + escape( n.oscpu ? n.oscpu : (n.cpuClass ? n.cpuClass : n.platform) ) +
                            "&amp;L=" + escape( (n.language || n.browserLanguage).substr(0,2) ) +
                            "&amp;R=" + escape( s.width + "x" + s.height );
            LogUtil.log("start-live-coding-session", "", "", "", broadcastId + ":" + this.clientId + ":" + serverString);
            return this.clientId;
        },
        setSocketAddress : function ( host, port ) {
            LogUtil.host = host;
            LogUtil.port = port;
        },
        // CJ-822
        logExpression : function (e, n) {
            console.log(n ? (n + ": " + e) : e); return e;
        }
    }

    EventDispatcher.prototype.apply(LogUtil);

    // CJ-900
    LogUtil.JS_CLASSES =
    {
        "Object" : [
            "prototype",/*
            "__count__",
            "__noSuchMethod__",
            "__parent__",
            "__proto__",*/
            "constructor",
            "create",
            "defineProperties",
            "defineProperty",
            "freeze",
            "getOwnPropertyDescriptor",
            "getOwnPropertyNames",
            "getPrototypeOf",
            "is",
            "isExtensible",
            "isFrozen",
            "isSealed",
            "keys",
            "preventExtensions",/*
            "__defineGetter__",
            "__defineSetter__",
            "__lookupGetter__",
            "__lookupSetter__",*/
            "eval",
            "hasOwnProperty",
            "isPrototypeOf",
            "propertyIsEnumerable",
            "toLocaleString",
            "toSource",
            "toString",
            "unwatch",
            "valueOf",
            "watch",
            "seal",
            "setPrototypeOf"
        ],

        "Function" : [
            "arguments",
            "arity",
            "caller",
            "length",
            "name",
            "prototype",
            "apply",
            "bind",
            "call",
            "isGenerator",
            "toSource",
            "toString"
        ],

        "Boolean" : [
            "prototype",
            "toSource",
            "toString",
            "valueOf"
        ],

        "Number" : [
            "EPSILON",
            "MAX_VALUE",
            "MIN_VALUE",
            "NEGATIVE_INFINITY",
            "NaN",
            "POSITIVE_INFINITY",
            "prototype",
            "isFinite",
            "isInteger",
            "isNaN",
            "parseFloat",
            "parseInt",
            "toExponential",
            "toFixed",
            "toLocaleString",
            "toPrecision",
            "toSource",
            "toString",
            "valueOf",
            "toInteger"
        ],

        "Math" : [
            "E",
            "LN10",
            "LN2",
            "LOG10E",
            "LOG2E",
            "PI",
            "SQRT1_2",
            "SQRT2",
            "abs",
            "acos",
            "acosh",
            "asin",
            "asinh",
            "atan",
            "atan2",
            "atanh",
            "cbrt",
            "ceil",
            "cos",
            "cosh",
            "exp",
            "expm1",
            "floor",
            "fround",
            "hypot",
            "imul",
            "log",
            "log10",
            "log1p",
            "log2",
            "max",
            "min",
            "pow",
            "random",
            "round",
            "sign",
            "sin",
            "sinh",
            "sqrt",
            "tan",
            "tanh",
            "trunc"
        ],

        "Date" : [
            "prototype",
            "UTC",
            "now",
            "parse",
            "getDate",
            "getDay",
            "getFullYear",
            "getHours",
            "getMilliseconds",
            "getMinutes",
            "getMonth",
            "getSeconds",
            "getTime",
            "getTimezoneOffset",
            "getUTCDate",
            "getUTCDay",
            "getUTCFullYear",
            "getUTCHours",
            "getUTCMilliseconds",
            "getUTCMinutes",
            "getUTCMonth",
            "getUTCSeconds",
            "getYear",
            "setDate",
            "setFullYear",
            "setHours",
            "setMilliseconds",
            "setMinutes",
            "setMonth",
            "setSeconds",
            "setTime",
            "setUTCDate",
            "setUTCFullYear",
            "setUTCHours",
            "setUTCMilliseconds",
            "setUTCMinutes",
            "setUTCMonth",
            "setUTCSeconds",
            "setYear",
            "toDateString",
            "toGMTString",
            "toISOString",
            "toJSON",
            "toLocaleDateString",
            "toLocaleFormat",
            "toLocaleString",
            "toLocaleTimeString",
            "toSource",
            "toString",
            "toTimeString",
            "toUTCString",
            "valueOf"
        ],

        "String" : [
            "constructor",
            "length",
            "charAt",
            "charCodeAt",
            "concat",
            "indexOf",
            "lastIndexOf",
            "localeCompare",
            "match",
            "quote",
            "replace",
            "search",
            "slice",
            "split",
            "substr",
            "substring",
            "toLocaleLowerCase",
            "toLowerCase",
            "toLocaleUpperCase",
            "toUpperCase",
            "toSource",
            "toString",
            "valueOf",
            "anchor",
            "big",
            "blink",
            "bold",
            "fixed",
            "fontcolor",
            "fontsize",
            "italics",
            "link",
            "small",
            "strike",
            "sub",
            "sup"
        ],

        "RegExp" : [
            "lastIndex",
            "prototype",
            "global",
            "ignoreCase",
            "multiline",
            "source",
            "sticky",
            "exec",
            "test",
            "toSource",
            "toString"
        ],

        "Array" : [
            "constructor",
            "length",
            "pop",
            "push",
            "reverse",
            "shift",
            "sort",
            "splice",
            "unshift",
            "concat",
            "join",
            "slice",
            "toSource",
            "toString",
            "indexOf",
            "lastIndexOf",
            "forEach",
            "every",
            "some",
            "filter",
            "map"
        ]
    }
	
	// intercept console
	if (this["console"] == undefined) console = {};

    var onConsoleChanged = function () {
        if (!isNode && document.all) {
            // IE8 console.log.apply exists but console.log.apply(console, ["hello"]) throws error
            return console;
        }

		var msg = function (args) {
		    var a = [];
		    var tokens = ('' + args[0]).split(/\%[^\s]+/);
		    var n = Math.max (tokens.length, args.length - 1);
		    for (var i = 0; i < n; i++) {
		        if (i < tokens.length) a.push (tokens[i]);
		        if (i + 1 < arguments.length) a.push (arguments[i + 1] + ((i + 1 < tokens.length - 1) ? '' : ' '));
		    }
			return a.join('');
		}

        var c = console;
        if (arguments.length > 2) {
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/watch
            // handler(prop, oldval, newval) -> get newval
            c = arguments[2];
        }

		var clog = c.log;
		c.log = function () {
			if (clog && !isNode) clog.apply (c, arguments);
			LogUtil.log ("trace", "", "", "console", msg (arguments), "");
		}
		
		c.log2 = function () {
			// for internal debug
			if (clog) clog.apply (c, arguments);
		}
		
		var cdebug = c.debug;
		c.debug = function () {
			if (cdebug && !isNode) cdebug.apply (c, arguments);
			LogUtil.log ("debug", "", "", "console", msg (arguments), "");
		}

		var cinfo = c.info;
		c.info = function () {
			if (cinfo && !isNode) cinfo.apply (c, arguments);
			LogUtil.log ("info", "", "", "console", msg (arguments), "");
		}

		var cwarn = c.warn;
		c.warn = function () {
			if (cwarn && !isNode) cwarn.apply (c, arguments);
			LogUtil.log ("warn", "", "", "console", msg (arguments), "");
		}
		
		var cerror = c.error;
		c.error = function () {
			if (cerror && !isNode) cerror.apply (c, arguments);
			LogUtil.log ("error", "", "", "console", msg (arguments), "");
		}

        return c;
	};

    onConsoleChanged();

    if (!isNode && navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        // firebug overwrites console at will - so we need to watch it
        window.watch("console", onConsoleChanged);
    }
}

// LiveCodeRegistry
if (this["LiveCodeRegistry"] == undefined) {

    __coltScope = 0;
    __coltThis = this;

    setInterval (function () {
        var cache = LiveCodeRegistry.getInstance().cachedMethods;
        var kills = [], now = Date.now();
        for (var id in cache) {
            var entry = cache[id];
            if (now - entry.time > 1000) {
                kills.push(id);
            }
        }
        for (var i = 0; i < kills.length; i++) {
            delete cache[kills[i]];
        }
    }, 900);

    function LiveCodeRegistryInstance () {
        this.methods = {};
        this.cachedMethods = {};
        this.changedMethodIds = [];
        this.enableEvents = false;
        this.lastLoadedPackage = 0;
        // track method-body correspondence if requested
        this.trackedMethods = [];
        this.trackedMethodIds = [];

        this.lastUsedScope = 0;

        this.inspectables = {};
        this.inspectablesCanvasTimer = 0;
        this.inspectablesCanvasTimerLast = 0;
        this.inspectablesFormsPositions = {};
        this.inspectablesShouldUpdateDialog = false;
        this.inspectablesSomeSliderIsActive = false;
        this.inspectablesStringCenters = {};

        // CJ-791
        this.targets = [];

        // CJ-818
        this.evaluators = {};

        // CJ-890
        this.callCounts = {};
    }

    LiveCodeRegistryInstance.prototype.resetCallCounts = function () {
        this.callCounts = {};
    }

    LiveCodeRegistryInstance.prototype.getCallCount = function (id) {
        return this.callCounts[id] ? this.callCounts[id] : 0;
    }

    LiveCodeRegistryInstance.prototype.incCallCount = function (id) {
        this.callCounts[id] = this.callCounts[id] ? (this.callCounts[id] + 1) : 1;
    }

    LiveCodeRegistryInstance.prototype.getScope = function () {
        this.lastUsedScope++; return this.lastUsedScope;
    }

    LiveCodeRegistryInstance.prototype.extractMethodId = function (f) {
        return f.toString().match(/getMethod\("([^"]+)"\)/)[1];
    }

    LiveCodeRegistryInstance.prototype.trackMethod = function (f) {
        if (this.trackedMethods.indexOf(f) < 0) {
            this.trackedMethods.push(f);
            // parse call to getMethod("methodId") from function body to get id
            this.trackedMethodIds.push(this.extractMethodId(f));
        }
    }

    // signature changed, addMethod not required
    LiveCodeRegistryInstance.prototype.putMethod = function ( id, method ) {
        this.methods[id] = method;
        // also clear cache
        var kills = [];
        for (var scopedId in this.cachedMethods) {
            if ((scopedId.indexOf(id) == 0) && (scopedId.charCodeAt(id.length) == 95 /* "_" */)) {
                kills.push (scopedId);
            }
        }
        for (var i = 0; i < kills.length; i++) {
            delete this.cachedMethods[kills[i]];
        }
        // also store id for event
        this.changedMethodIds.push(id);
    }

    LiveCodeRegistryInstance.prototype.getMethod = function ( id ) {
        return this.methods[id];
    }

    LiveCodeRegistryInstance.prototype.putCachedMethod = function ( id, method ) {
        this.cachedMethods[id] = { method: method, time: Date.now() };
    }

    LiveCodeRegistryInstance.prototype.getCachedMethod = function ( id ) {
        var entry = this.cachedMethods[id];
        if (entry) {
            entry.time = Date.now();
            return entry.method;
        }
        return null;
    }

    LiveCodeRegistryInstance.prototype.initSession = function ( sessionId ) {
		if (this.sessionId) {
			// to keep 2+ calls from breaking stuff
			return;
		}

        this.sessionId = sessionId;
        LogUtil.addEventListener ("data", function (e) {
            if (e.detail.indexOf("enableEvents") == 0) {
                LiveCodeRegistry.getInstance().enableEvents = true;
                LiveCodeRegistry.getInstance().lastLoadedPackage = parseInt(e.detail.substr("enableEvents".length)) - 1;
            } else {
                LiveCodeRegistry.getInstance().incomingData (e.detail, sessionId);
            }
        });
        var clientId = LogUtil.startLiveCodingSession (sessionId);
        // todo: implement scopes in LogUtil ?
//        LogUtil.enterLogScope("livecoding", "9091078376703266005");
//        LogUtil.log("trace", "4144789857666611501", "r:5865b376-a157-43b1-b990-70db6dbffde6(codeOrchestra.actionScript.liveCoding.util)", "codeOrchestra.actionScript.liveCoding.util.LiveCodeRegistry", "" + ["Start Live Code Session: " + clientId].join(", "));
//        LogUtil.exitLogScope("livecoding", "9091078376703266005");
    }

    LiveCodeRegistryInstance.prototype.incomingData = function ( stringData, sessionId ) {

//        LogUtil.enterLogScope("livecoding", "3572192687419688036");
//        LogUtil.log("trace", "3572192687419688040", "r:5865b376-a157-43b1-b990-70db6dbffde6(codeOrchestra.actionScript.liveCoding.util)", "codeOrchestra.actionScript.liveCoding.util.LiveCodeRegistry", "" + ["incoming-data: " + stringData].join(", "));
//        LogUtil.exitLogScope("livecoding", "3572192687419688036");

        var result = /^livecoding::(.+)::(.+)::(-?\d+)$/.exec(stringData);
        if ( result ) {
            var data = result[1];
            var result2 = /^htmlUpdate:[^:]+:([^:]+):#document\[\d+\]\/([^:]+):([^:]+):(.*)$/.exec(data);
            if ( result2 ) {
                var file = result2[1];
                var tagPath = result2[2].split("/");
                var coltId = result2[3];
                var changes = result2[4].split(":");

                // is this the file we want?
                if (location.pathname.indexOf(file) > -1) {

                    // locate elements
                    var findTag = function (tag, tagName, tagIndex) {
                        var counter = -1;
                        for (var i = 0; i < tag.children.length; i++) {
                            if (tag.children[i].tagName == tagName) {
                                counter++;
                                if (counter == tagIndex) {
                                    return tag.children[i];
                                }
                            }
                        }
                        // browsers can create missing tags at run time - we need to go deeper
                        for (var i = 0; i < tag.children.length; i++) {
                            var result = findTag (tag.children[i], tagName, tagIndex);
                            if (result) return result;
                        }
                        return null;
                    }

                    var mercuryIframe = document.getElementById ("mercury_iframe");
                    var tag = { children: [ mercuryIframe ? mercuryIframe.contentDocument.documentElement : document.documentElement ] };
                    for (var i = 0; i < tagPath.length - 1; i++) {
                        var addr = tagPath[i].split("[");
                        tag = findTag (tag, addr[0].toUpperCase(), parseInt(addr[1]));

                        if (tag == null) {
                            // if we can't find the tag, just reload the page
                            LogUtil.socket.close(); top.location.reload(true); return;
                        }
                    }

                    // in this tag, find all tags with coltId
                    var tags = [];
                    for (var i = 0; i < tag.children.length; i++) {
                        if (tag.children[i].getAttribute("data-colt-id") == coltId) {
                            tags.push (tag.children[i]);
                        }
                    }

                    if (tags.length == 0) {
                        // if we can't find the tag, again, just reload the page
                        LogUtil.socket.close(); top.location.reload(true); return;
                    }

                    // changes are either element's innerHTML or attributes
                    if (changes[0] == "element") {
                        for (var i = 0; i < tags.length; i++) {
                            tags[i].innerHTML = decodeURIComponent(changes[1]);
                        }
                    } else
                    if (changes[0] == "attribute-remove") {
                        for (var i = 0; i < tags.length; i++) {
                            tags[i].removeAttribute(changes[1]);
                        }
                    } else {
                        var attr = changes[1].split("=");
                        for (var i = 0; i < tags.length; i++) {
                            tags[i].setAttribute(attr[0], decodeURIComponent(attr[1]));
                        }
                    }

                }

                if (this.enableEvents) {
                    this.dispatchEvent({ type: "htmlUpdate", source: file, tags: tags });
                    this.dispatchEvent({ type: "liveUpdate" });
                }

                return;
            }

            var dataSessionId = result[2];
            if ( !(sessionId) || dataSessionId == sessionId ) {
                var packageId = parseInt(result[3]);
                var tokens = data.split("|");
                var methods = [];
                var assets = [];
                for (var i = 0; i < tokens.length; i++) {
                    var token = tokens[i];
                    if ( /^base-url:/.test(token) ) {
                        this.baseUrl = /^(base-url:)(.+)$/.exec(token)[2];
                        LiveCodeRegistryInstance.prototype.baseUrl = this.baseUrl;
                    }else{
                        if ( /^method:/.test(token) ) {
                            /*
                             var methodChange : MethodChange = new MethodChange(token);
                             methodChange.event = new MethodUpdateEvent(methodChange.className, methodChange.methodName);
                             (CollectionsLanguageUtil.add(methods, methodChange, MethodChange) as MethodChange);
                             */
                            methods.push(token);
                        } else if ( /^asset:/.test(token) ) {
                            /*
                             var assetChange : AssetChange = new AssetChange(token);
                             assetChange.event = new AssetUpdateEvent(assetChange.source, assetChange.mimeType);
                             (CollectionsLanguageUtil.add(assets, assetChange, AssetChange) as AssetChange);
                             */
                            assets.push(token);
                        }
                    }
                }
                if ( (methods.length > 0) || (assets.length > 0) ) {
                    this.loadPackage(packageId, methods, assets);
                }
            }
        }
    }

    LiveCodeRegistryInstance.prototype.loadPackage = function ( packageId, methods, assets ) {
        // deal with events here: send out assetUpdate immediately, delay codeUpdate
        var assetPaths = assets.map(function (token) { return token.split(":")[2]; });
        if (assetPaths.length > 0) {
            if (assets[0].split(":")[1] == "true") {
                // try to automatically refresh external css and images
                // for each asset, loop through link/img tags and refresh those with assets in href/src
                var refreshTags = function (tag, tagName, attrName, paths) {
                    if (tag.tagName.toLowerCase() == tagName) {
                        var value = tag.getAttribute(attrName);
                        if (value != null) {
                            value = value.split("?")[0];
                            for (var i = 0; i < paths.length; i++) {
                                // value is actual content of attrName attribute
                                // paths[i] is file path rel. to project root
                                // this check will break if there are "../" in the value
                                var slashless = (value.charAt(0) == '/') ? value.substr(1) : value;
                                if (paths[i].indexOf(slashless) > -1) {
                                    tag.setAttribute(attrName, value.split("?")[0] + "?d=" + (new Date()).valueOf());
                                    break;
                                }
                            }
                        }
                    } else {
                        for (var i = 0; i < tag.children.length; i++) {
                            refreshTags(tag.children[i], tagName, attrName, paths);
                        }
                    }
                }

                refreshTags(document.documentElement, "img", "src", assetPaths);
                refreshTags(document.documentElement, "link", "href", assetPaths);
            }
            this.dispatchEvent ({ type: "assetUpdate", sources: assetPaths });
            this.dispatchEvent ({ type: "liveUpdate" });
        }

        if (packageId <= this.lastLoadedPackage) {
            return;
        }

        // if here, this is code update
        // use putMethod-s in package to collect changed method id-s
        this.changedMethodIds.length = 0;

        var url = "livecoding/package_" + packageId + ".js";
        if ( isNode ) {
            url = "./" + url;
        } else
        if ( this.baseUrl ) {
            url = this.baseUrl + "/" + url;
        }


        // load package_X.js
		if (isNode) {
            if (url.substr(0, 4) == "file") {
                url = url.substr(7);
            }
			var p = require (url);
		} else {
			// https://gist.github.com/calvinf/817519
			var el = document.createElement('script');
			el.async = false;
			el.src = url + ((url.indexOf("?") > -1) ? "&" : "?") + "d=" + Date.now();
			el.type = 'text/javascript';
			(document.getElementsByTagName('HEAD')[0]||document.body).appendChild(el);
		}
    }

    LiveCodeRegistryInstance.prototype.setLastLoadedPackage = function ( packageId, sourcePath ) {
        if (this.lastLoadedPackage < packageId) {
            this.lastLoadedPackage = packageId;
            if (this.enableEvents) {
                LogUtil.log ("live", "", "", "live.js", "Received package " + packageId + ": " + sourcePath, "");

                // check if tracked methods have changed
                var changedMethods = [];
                for (var i = 0; i < this.changedMethodIds.length; i++) {
                    var j = this.trackedMethodIds.indexOf(this.changedMethodIds[i]);
                    if (j > -1) {
                        changedMethods.push(this.trackedMethods[j]);
                    }
                }

                this.dispatchEvent({ type: "codeUpdate", source: sourcePath, methods: changedMethods });
                this.dispatchEvent({ type: "liveUpdate" });
            }
        }
    }

    LiveCodeRegistryInstance.prototype.onKeyPress = function (e) {
        e = e || window.event;
        var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
        if(((charCode==105)||(charCode==73)||(charCode==9))&&(e.ctrlKey)) {
            // Ctrl + i/I in Chrome/FF/Safari, http://jsfiddle.net/DSAz3/
            if (!LiveCodeRegistry.getInstance().hideInspectablesDialog()) {
                LiveCodeRegistry.getInstance().showInspectablesDialog(true);
            }
        }
    }

    LiveCodeRegistryInstance.prototype.setInspectables = function ( values, sourcePath ) {
        values.sendingInspectables = false;
        this.inspectables [sourcePath] = values;
        //console.log2("received stuff from package for " + sourcePath);

        if (!isNode && document.removeEventListener) {
            if (values.length > 0) {
                document.removeEventListener('keypress', this.onKeyPress);
                document.addEventListener('keypress', this.onKeyPress);

                var loadSliderPlugin = function () {
                    var colt_jquery_slider = "/colt-jquery-slider.js";
                    if (LiveCodeRegistry.getInstance().baseUrl) {
                        colt_jquery_slider = LiveCodeRegistry.getInstance().baseUrl + colt_jquery_slider;
                    }
                    var script = document.createElement('script');
                    script.src = colt_jquery_slider; script.async = false; script.type = 'text/javascript';
                    document.getElementsByTagName('head')[0].appendChild(script);
                };

                // if values are not empty and there is no jquery - load it
                if (window["jQuery"] == undefined) {
                    var colt_jquery = "/mercury/jquery-1.7.js";
                    if (this.baseUrl) {
                        colt_jquery = this.baseUrl + colt_jquery;
                    }
                    var script = document.createElement('script');
                    script.src = colt_jquery; script.async = false; script.type = 'text/javascript';
                    document.getElementsByTagName('head')[0].appendChild(script);
                    var jqueryChecker = setInterval(function () {
                        if (window["jQuery"] != undefined) {
                            clearInterval(jqueryChecker);
                            // time to load slider plugin
                            loadSliderPlugin();
                        }
                    }, 100);
                } else {
                    loadSliderPlugin();
                }
            }

            if ( document.getElementById("colt-inspectables-dialog") ) {
                // go over received values
                for (var i = 0; i < values.length; i++) {
                    var field = values[i];
                    var fieldId = this.makeInspectableId(sourcePath, field);

                    // fielfId might now have different length than corresponding input in the dialog
                    // to support sliders, we need to find the input with corresponding file/offset and patch its id/name
                    var fieldIdParts = fieldId.split(":");
                    if (this.inspectablesSomeSliderIsActive) {
                        jQuery.each (jQuery('div.colt-eip input'), function (i, v) {
                            var idParts = v.id.split(":");
                            if ((fieldIdParts[0] == idParts[0]) && (fieldIdParts[1] == idParts[1])) {
                                v.id = fieldId; v.name = fieldId;
                            }
                        });
                    }

                    var input = document.getElementById(fieldId);
                    if (input) {
                        // slider:
                        // if currently displayed numeric values in the dialog differ from those received, send them again
                        if (typeof field.value == "number") {
                            var delta = parseFloat (input.value) - field.value;
                            if ((delta != 0) && ((field.value == 0) || (Math.abs(delta / field.value) > 1e-6))) {
                                // yes, there is a difference
                                //console.log2("Found difference for " + fieldId + ": i.v=" + input.value + ", f.v=" + field.value);
                                LiveCodeRegistry.getInstance().sendInspectables();
                                return;
                            }
                        }
                    } else {
                        //console.log2("no input for " + fieldId + ": f.v=" + field.value);
                        //console.log2(document.getElementById('colt-inspectables-dialog').innerHTML);
                    }
                }
            }

            var waitingForResponse = false;
            for (var file in this.inspectables) {
                waitingForResponse = waitingForResponse || this.inspectables[file].sendingInspectables;
            }

            if (!waitingForResponse) {
                if (this.inspectablesSomeSliderIsActive) {
                    this.inspectablesShouldUpdateDialog = true;
                } else {
                    // if here, rebuild the dialog, if present
                    this.showInspectablesDialog(false);
                    this.inspectablesShouldUpdateDialog = false;
                }
            }
        }
    }

    LiveCodeRegistryInstance.prototype.hideInspectablesDialog = function () {
        clearInterval(this.inspectablesCanvasTimer);
        this.inspectablesStringCenters = {};
        var old = document.getElementById("colt-inspectables-dialog");
        if (old) {
            old.parentNode.removeChild(old);
            var canvas = document.getElementById("colt-inspectables-canvas");
            if (canvas) {
                canvas.parentNode.removeChild(canvas);
            }
            return true;
        }
        return false;
    }

    LiveCodeRegistryInstance.prototype.makeInspectableId = function (file, field) {
        var fieldId = file + ":" + field.position + ":" + field.length;

        if (typeof field.value == "string") {
            fieldId += "s";
        }

        return fieldId;
    }

    // CJ-791
    LiveCodeRegistryInstance.prototype.targetToId = function (target) {
        var a = this.targets;
        for (var i = 0; i < a.length; i++) {
            if (a[i] == target) return i;
            if (a[i] && a[i].is && a[i].is(target)) return i;
        }
        a.push (target); return a.length - 1;
    }

    LiveCodeRegistryInstance.prototype.showInspectablesDialog = function (anyway) {
        //if(!anyway) console.log2("showInspectablesDialog 1")
        if (this.hideInspectablesDialog() || anyway) {
            //if(!anyway) console.log2("showInspectablesDialog 2")
            var html = "<div id='colt-inspectables-dialog' class='colt-eip' style='position: absolute; left: 0; top: 0;'><br /><br />";

            var groups = {};
            for (var file in this.inspectables) {
                var fields = this.inspectables[file];
                for (var i = 0; i < fields.length; i++) {
                    var field = fields[i];
                    var fieldId = this.makeInspectableId(file, field);

                    // CJ-791
                    var min = null, max = null, name = field.context, target = null;
                    //console.log2("evaluating: " + field.options);
                    eval (field.options);

                    var rows = groups[this.targetToId(target)];
                    if (rows == undefined) {
                        rows = (groups[this.targetToId(target)] = []);
                    }

                    rows.push({
                        id: fieldId,
                        name: name,
                        value: (""+field.value).split('"').join('&quot;'),
                        originalValue: field.value,
                        min: min,
                        max: max,
                        target: target
                    });
                }
            }

            for (var targetId in groups) {
                var rows = groups[targetId];
                html += '<form onsubmit="return false;" id="colt-inspectables-dialog-form-' + targetId + '" class="insp insp-left ui-draggable" style="left: 60px;">';

                for (var i = 0; i < rows.length; i++) {
                    var rowClass = "";
                    if (i == 0) {
                        rowClass = "first";
                    }
                    if (i == rows.length - 1) {
                        rowClass += " last";
                    }

                    var inputStr = '<input type="text" id="' + rows[i].id + '" name="' + rows[i].id +
                        '" value="' + rows[i].value +
                        '" onchange="LiveCodeRegistry.getInstance().sendInspectables();" ></input>';

                    if (typeof rows[i].originalValue == "number") {

                        // add the slider
                        var pct = 1e-2;
                        if (rows[i].originalValue != 0) {
                            pct *= Math.abs (rows[i].originalValue);
                        }
                        var min = rows[i].originalValue - 50 * pct;
                        var max = rows[i].originalValue + 50 * pct;
                        if (rows[i].min) min = rows[i].min;
                        if (rows[i].max) max = rows[i].max;
                        pct = (max - min) * 1e-2;

                        inputStr = '<span class="i-group"><input type="text" id="' + rows[i].id + '" name="' + rows[i].id +
                            '" value="' + rows[i].value +
                            '" onchange="LiveCodeRegistry.getInstance().sendInspectables();" class="i-slider"></input>' +
                            '<span class="slider" min="' + min + '" max="' + max + '" step="' + pct +
                            '" value="' + rows[i].value + '"></span></span>';
                    }

                    html +=
                        '<div class="row">' +
                            '<label class="' + rowClass + '">' + rows[i].name +
                                inputStr +
                            '</label>' +
                        '</div>';
                }

                html += '</form><br /><br />';
            }

            html += '</div>';
            document.body.insertAdjacentHTML("beforeend", html);

            // we should now already have jquery if here
            jQuery.each (jQuery('.i-group .slider'), function (i, v) {
                jQuery(v).slider({
                    range: 'min',
                    value: parseFloat(jQuery(this).attr('value')),
                    step: parseFloat(jQuery(this).attr('step')),
                    min: parseFloat(jQuery(this).attr('min')),
                    max: parseFloat(jQuery(this).attr('max')),
                    slide: function(event, ui) {
                        jQuery(this).parents('.i-group').children('.i-slider').val(ui.value).change();
                    },
                    start: function() {
                        LiveCodeRegistry.getInstance().inspectablesSomeSliderIsActive = true;
                    },
                    stop: function() {
                        var instance = LiveCodeRegistry.getInstance();
                        instance.inspectablesSomeSliderIsActive = false;

                        if (instance.inspectablesShouldUpdateDialog) {
                            instance.showInspectablesDialog(false);
                            instance.inspectablesShouldUpdateDialog = false;
                        }
                    }
                });
            });

            jQuery('.i-slider').change(function () {
                var sldr = jQuery(this).parents('.i-group').children('.slider');
                jQuery(sldr).slider('value', parseInt(this.value));
            });

            jQuery("div.colt-eip form").draggable({
                drag: function () {
                    LiveCodeRegistry.instance.drawStringsForInspectables();
                },
                stop: function () {
                    LiveCodeRegistry.instance.inspectablesFormsPositions[this.id] = { top: this.style.top, left: this.style.left };
                }
            });

            for (var formId in this.inspectablesFormsPositions) {
                jQuery("#" + formId).css (this.inspectablesFormsPositions[formId]);
            }

            // canvas for strings
            if (document.all) {
                // canvas is not supported in (old) IEs
            } else {
                $('#colt-inspectables-dialog')[0].insertAdjacentHTML('beforebegin', '<canvas id="colt-inspectables-canvas"></canvas>');
                window.removeEventListener('resize', this.onWindowResize);
                window.addEventListener('resize', this.onWindowResize);
                this.onWindowResize();
                clearInterval(this.inspectablesCanvasTimer);
                this.inspectablesCanvasTimer = setInterval(this.drawStringsForInspectables, 33);
            }
        }
    }

    LiveCodeRegistryInstance.prototype.onWindowResize = function () {
        var canvas = document.getElementById( 'colt-inspectables-canvas' );
        var ctx = canvas.getContext( '2d' );
        ctx.canvas.width  = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
    }

    LiveCodeRegistryInstance.prototype.drawStringsForInspectables = function () {
        var canvas = document.getElementById( 'colt-inspectables-canvas' );
        if (canvas) {
            var context = canvas.getContext( '2d' );
            context.clearRect(0,0,/*context.*/canvas.width,/*context.*/canvas.height);

            var now = Date.now();
            var forms = jQuery("div.colt-eip form").toArray();
            for (var i = 0; i < forms.length; i++) {
                var targetId = forms[i].id.substr('colt-inspectables-dialog-form-'.length);
                var target = LiveCodeRegistry.instance.targets[parseInt(targetId)];
                if (typeof target == "string") {
                    target = [ document.getElementById(target) ];
                } else if (target instanceof jQuery) {
                    target = target.toArray();
                } else {
                    target = [ target ];
                }
                for (var j = 0; j < target.length; j++) {
                    if (target[j] == null) continue;

                    var formBox = forms[i].getBoundingClientRect();

                    var targetBox = { left: 0, top: 0, height: 0 };
                    if (target[j].getBoundingClientRect) {
                        targetBox = target[j].getBoundingClientRect();
                    }

                    // offset to form "arrow" endpoint
                    var fx = formBox.left + 205.5;
                    var fy = formBox.top + 27;

                    var tx = targetBox.left;
                    var ty = targetBox.top + Math.min (15, targetBox.height / 2);

                    var jf = jQuery(forms[i]);
                    if (j == 0) {
                        // if 1st target is on the left
                        if (tx < fx - 100 /* fx is right edge, form is ~200px wide */) {
                            jf.removeClass("insp-left"); jf.addClass("insp-right"); fx -= 211;
                        } else {
                            jf.removeClass("insp-right"); jf.addClass("insp-left");
                        }
                    } else {
                        if (jf.hasClass("insp-right")) fx -= 210;
                    }

                    var r = Math.sqrt ((tx - fx)*(tx - fx) + (ty - fy)*(ty - fy)), H = 400;
                    var cx = 0.5 * (fx + tx);
                    var cy = 0.5 * (fy + ty) + H * Math.exp(-0.5 * r / H);

                    var center = LiveCodeRegistry.instance.inspectablesStringCenters[forms[i].id + "_" + j];
                    if (center) {
                        // change speed towards "perfect" center (cx, cy)
                        var cvx = cx - center.x;
                        var cvy = cy - center.y;
                        center.vx = 0.95 * 0.99 * center.vx + 0.01 * cvx;
                        center.vy = 0.95 * 0.90 * center.vy + 0.10 * cvy;
                        // adjust the center (this might be called faster than once in 33 ms during drags)
                        var t = (now - LiveCodeRegistry.instance.inspectablesCanvasTimerLast) / 33;
                        center.x += t * center.vx;
                        center.y += t * center.vy;
                    } else {
                        LiveCodeRegistry.instance.inspectablesStringCenters[forms[i].id + "_" + j] = (center = {
                            x: cx, y: cy, vx: 0, vy: 0
                        });
                    }

                    // draw the string
                    context.strokeStyle = '#000000';
                    context.lineWidth = 1;
                    context.beginPath();
                    context.moveTo(fx, fy);
                    context.quadraticCurveTo(center.x, center.y, tx, ty);
                    context.stroke();

                    // draw the anchor
                    context.beginPath();
                    context.rect(tx - 3, ty - 3, 6, 6);
                    context.fillStyle = '#000000';
                    context.fill();
                }
            }
            LiveCodeRegistry.instance.inspectablesCanvasTimerLast = now;
        }
    }

    LiveCodeRegistryInstance.prototype.sendInspectables = function () {

        var m = "";

        for (var file in this.inspectables) {
            if (this.inspectables[file].sendingInspectables) {
                // we saw no reply for last changes to this file yet, so we have no valid offsets
                //console.log2("waiting for update on " + file);
            } else {
                // if here, we might have valid offsets and stuff to send
                var fields = this.inspectables[file];
                for (var i = 0; i < fields.length; i++) {
                    var field = fields[i];
                    var fieldId = this.makeInspectableId(file, field);
                    var input = document.getElementById(fieldId);
                    if (input) {
                        var value = input.value;

                        // now we have to check if this value has actually changed :(

                        // if we send unchanged values, there will be never package_X.js, and
                        // we wait it to call setInspectables() and clear sendingInspectables

                        if (input.value != (""+field.value).split('"').join('&quot;')) {

                            if (fieldId[fieldId.length - 1] == "s") {
                                fieldId = fieldId.substr(0, fieldId.length - 1);
                                value = JSON.stringify(value);
                            }
                            m += fieldId + ":" + encodeURIComponent(value) + ";";

                            // we will be sending this, so mark the file dirty
                            this.inspectables[file].sendingInspectables = true;
                            //console.log2("Marked " + file + " dirty: sending " + fieldId);

                        }
                    } else {
                        // offset is not up to date, so we aren't sending this field
                    }
                }
            }
        }

        // at this point, check if we have something to send, and send it

        if((m.length>0)&&(m.charAt(m.length-1)==";")) {
            m = m.substr(0,m.length-1);
            LogUtil.log("changes", "", "", "", m);
        }
    }

    LiveCodeRegistry = {
        instance : new LiveCodeRegistryInstance (),
        getInstance : function () { return this.instance; }
    }

    EventDispatcher.prototype.apply(LiveCodeRegistry.instance);
}


// LiveCodingCodeFlowUtil
if (this["LiveCodingCodeFlowUtil"] == undefined) {
    LiveCodingCodeFlowUtil = {
        maxRecursionCount : 10000,
        maxLoopCount : 10000,
        lastMethod : "", //null,
        lastLoop : "", //null,
        recursionCount : 0,
        loopCount : 0,
        enterFrameCounter : -1,
        setMaxLoopCount : function (value) { this.maxLoopCount = value; },
        setMaxRecursionCount : function (value) { this.maxRecursionCount = value; },
        checkRecursion : function (reqursionId) {
            this.loopCount = 0;
            this.lastLoop = null;
            this.initCounter();
            if ( reqursionId != this.lastMethod ) {
                this.lastMethod = reqursionId;
                this.recursionCount = 0;
            }
            this.recursionCount++;
            if ( this.recursionCount > this.maxRecursionCount ) {
                throw new Error("Possible infinite recursion: " + reqursionId + ".");
            }
        },
        checkRecursion2 : function (reqursionId) {
            this.recursionCount--;
        },
        checkLoop : function (loop) {
            this.initCounter();
            if ( loop != this.lastLoop ) {
                this.lastLoop = loop;
                this.loopCount = 0;
            }
            this.loopCount++;
            if ( this.loopCount > this.maxLoopCount ) {
                throw new Error("Possible infinite loop.");
            }
        },
        initCounter : function () {
            if (this.enterFrameCounter < 0) {
                this.enterFrameCounter = setInterval (function () {
                    LiveCodingCodeFlowUtil.loopCount = 0;
                    LiveCodingCodeFlowUtil.lastLoop = "";
                    LiveCodingCodeFlowUtil.recursionCount = 0;
                }, 20);
            }
        }
    }
}

if (isNode) {
	global.LogUtil = LogUtil;
	global.LiveCodeRegistry = LiveCodeRegistry;
	global.LiveCodingCodeFlowUtil = LiveCodingCodeFlowUtil;
}

__coltScope = LiveCodeRegistry.getInstance().getScope();
