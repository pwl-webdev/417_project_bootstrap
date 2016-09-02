if (typeof console === "undefined" || typeof console.log === "undefined") {
    console = {};
    console.log = function() {};
}

(function( window, undefined ) {

    // Use the correct document accordingly with window argument (sandbox)
    var document = window.document,
        navigator = window.navigator,
        location = window.location;

    if (!document.nodeName)
    {
        document.nodeName = '#document';
    }

    if (window.Node && Node.prototype && !Node.prototype.contains)
    {
        Node.prototype.contains = function(arg)
        {
            return !!(this.compareDocumentPosition(arg) & 16)
        }
    }

    var PianoMediaQuery = (function() {

        var PianoMediaQuery = function( selector, context ) {
            return new PianoMediaQuery.fn.init( selector, context, rootPianoMediaQuery );
        },

        // Map over PianoMediaQuery in case of overwrite
        _PianoMediaQuery = window.PianoMediaQuery,

        // A central reference to the root PianoMediaQuery(document)
        rootPianoMediaQuery,

        // Keep a UserAgent string for use with PianoMediaQuery.browser
        userAgent = navigator.userAgent,

        // For matching the engine and version of the browser
        browserMatch,

        // The deferred used on DOM ready
        readyList,

        // The ready event handler
        DOMContentLoaded,

        // Save a reference to some core methods
        toString = Object.prototype.toString,
        hasOwn = Object.prototype.hasOwnProperty,
        push = Array.prototype.push,
        slice = Array.prototype.slice,
        trim = String.prototype.trim,
        indexOf = Array.prototype.indexOf,

        // [[Class]] -> type pairs
        class2type = {};

        PianoMediaQuery.fn = PianoMediaQuery.prototype = {
            constructor: PianoMediaQuery,
            init: function( selector, context, rootPianoMediaQuery )
            {
                var match, elem, ret, doc;

                if ( !selector ) {
                    return this;
                }

                // The body element only exists once, optimize finding it
                if ( selector === "body" && !context && document.body )
                {
                    this.context = document;
                    this[0] = document.body;
                    this.selector = selector;
                    this.length = 1;
                    return this;
                }

                // Handle HTML strings
                if ( typeof selector === "string" )
                {
                    elem = document.getElementById(selector );
                    this.context = document;
                    this.selector = selector;
                    return this;
                }

                if (selector.selector !== undefined)
                {
                    this.selector = selector.selector;
                    this.context = selector.context;
                }

                return PianoMediaQuery.makeArray( selector, this );
            },

            // Start with an empty selector
            selector: "",

            // The current version of PianoMediaQuery being used
            PianoMediaQuery: "0.0.2",

            // The default length of a PianoMediaQuery object is 0
            length: 0,

            // The number of elements contained in the matched element set
            size: function()
            {
                return this.length;
            },

            toArray: function()
            {
                return slice.call(this, 0);
            },

            // Get the Nth element in the matched element set OR
            // Get the whole matched element set as a clean array
            get: function(num)
            {
                return num == null ?

                // Return a 'clean' array
                this.toArray() :

                // Return just the object
                ( num < 0 ? this[ this.length + num ] : this[ num ] );
            },

            // Take an array of elements and push it onto the stack
            // (returning the new matched element set)
            pushStack: function( elems, name, selector )
            {
                // Build a new PianoMediaQuery matched element set
                var ret = this.constructor();

                if ( this.isArray( elems ) )
                {
                    push.apply( ret, elems );

                }
                else
                {
                    this.merge( ret, elems );
                }

                // Add the old object onto the stack (as a reference)
                ret.prevObject = this;

                ret.context = this.context;

                if ( name === "find" )
                {
                    ret.selector = this.selector + (this.selector ? " " : "") + selector;
                }
                else if ( name )
                {
                    ret.selector = this.selector + "." + name + "(" + selector + ")";
                }

                // Return the newly-formed element set
                return ret;
            },

            isArray: function( obj )
            {
                return PianoMediaQuery.type(obj) === "array";
            },

            // Execute a callback for every element in the matched set.
            // (You can seed the arguments with an array of args, but this is
            // only used internally.)
            each: function( callback, args )
            {
                return PianoMediaQuery.each( this, callback, args );
            },

            ready: function( fn )
            {
                // Attach the listeners
                // PianoMediaQuery.bindReady();

                // Add the callback
                //readyList.done( fn );

                return this;
            },

            eq: function( i )
            {
                return i === -1 ?
                this.slice( i ) :
                this.slice( i, +i + 1 );
            },

            first: function()
            {
                return this.eq( 0 );
            },

            last: function()
            {
                return this.eq( -1 );
            },

            slice: function()
            {
                return this.pushStack( slice.apply( this, arguments ),
                    "slice", slice.call(arguments).join(",") );
            },

            map: function( callback )
            {
                return this.pushStack( PianoMediaQuery.map(this, function( elem, i ) {
                    return callback.call( elem, i, elem );
                }));
            },

            end: function()
            {
                return this.prevObject || this.constructor(null);
            },

            bindEvent: function(evt, callback)
            {
                for (var i = 0; i < this.length ; i++)
                {
                    var elem = this[i];

                    if (elem.addEventListener)
                    {
                        elem.addEventListener(evt, callback, false);
                    }
                    else if (elem.attachEvent)
                    {
                        elem.attachEvent('on' + evt, function(){
                            callback.call(event.srcElement, event);
                        });
                    }
                }
            },

            // For internal use only.
            // Behaves like an Array's method, not like a PianoMediaQuery method.
            push: push,
            sort: [].sort,
            splice: [].splice
        };

        PianoMediaQuery.fn.init.prototype = PianoMediaQuery.fn;

        PianoMediaQuery.extend = PianoMediaQuery.fn.extend = function()
        {
            var options, name, src, copy, copyIsArray, clone,
                target = arguments[0] || {},
                i = 1,
                length = arguments.length,
                deep = false;

            // Handle a deep copy situation
            if ( typeof target === "boolean" )
            {
                deep = target;
                target = arguments[1] || {};
                // skip the boolean and the target
                i = 2;
            }

            // Handle case when target is a string or something (possible in deep copy)
            if ( typeof target !== "object" && !PianoMediaQuery.isFunction(target) )
            {
                target = {};
            }

            // extend PianoMediaQuery itself if only one argument is passed
            if ( length === i )
            {
                target = this;
                --i;
            }

            for ( ; i < length; i++ )
            {
                // Only deal with non-null/undefined values
                if ( (options = arguments[ i ]) != null )
                {
                    // Extend the base object
                    for ( name in options )
                    {
                        src = target[ name ];
                        copy = options[ name ];

                        // Prevent never-ending loop
                        if ( target === copy )
                        {
                            continue;
                        }

                        // Recurse if we're merging plain objects or arrays
                        if ( deep && copy && ( PianoMediaQuery.isPlainObject(copy) || (copyIsArray = PianoMediaQuery.isArray(copy)) ) )
                        {
                            if ( copyIsArray )
                            {
                                copyIsArray = false;
                                clone = src && PianoMediaQuery.isArray(src) ? src : [];

                            }
                            else
                            {
                                clone = src && PianoMediaQuery.isPlainObject(src) ? src : {};
                            }

                            // Never move original objects, clone them
                            target[ name ] = PianoMediaQuery.extend( deep, clone, copy );

                        // Don't bring in undefined values
                        }
                        else if ( copy !== undefined )
                        {
                            target[ name ] = copy;
                        }
                    }
                }
            }

            // Return the modified object
            return target;
        };

        PianoMediaQuery.extend({
            isFunction: function( obj )
            {
                return PianoMediaQuery.type(obj) === "function";
            },

            makeArray: function(array, results)
            {
                var ret = results || [];

                if ( array != null ) {
                    // The window, strings (and functions) also have 'length'
                    // The extra typeof function check is to prevent crashes
                    // in Safari 2 (See: #3039)
                    // Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
                    var type = PianoMediaQuery.type( array );

                    if ( array.length == null || type === "string" || type === "function" || type === "regexp" || PianoMediaQuery.isWindow( array ) ) {
                        push.call( ret, array );
                    } else {
                        PianoMediaQuery.merge( ret, array );
                    }
                }

                return ret;

            },

            merge: function( first, second )
            {
                var i = first.length,
                    j = 0;

                if ( typeof second.length === "number" )
                {
                    for ( var l = second.length; j < l; j++ )
                    {
                        first[ i++ ] = second[ j ];
                    }

                }
                else
                {
                    while ( second[j] !== undefined )
                    {
                        first[ i++ ] = second[ j++ ];
                    }
                }

                first.length = i;

                return first;
            },

            each: function( object, callback, args )
            {
                var name, i = 0,
                    length = object.length,
                    isObj = length === undefined || PianoMediaQuery.isFunction( object );

                if ( args )
                {
                    if ( isObj )
                    {
                        for ( name in object )
                        {
                            if ( callback.apply( object[ name ], args ) === false )
                            {
                                break;
                            }
                        }
                    }
                    else
                    {
                        for ( ; i < length; )
                        {
                            if ( callback.apply( object[ i++ ], args ) === false )
                            {
                                break;
                            }
                        }
                    }

                // A special, fast, case for the most common use of each
                }
                else
                {
                    if ( isObj )
                    {
                        for ( name in object )
                        {
                            if ( callback.call( object[ name ], name, object[ name ] ) === false )
                            {
                                break;
                            }
                        }
                    }
                    else
                    {
                        for ( ; i < length; )
                        {
                            if ( callback.call( object[ i ], i, object[ i++ ] ) === false )
                            {
                                break;
                            }
                        }
                    }
                }

                return object;
            }
        });

        //Helpers
        PianoMediaQuery.extend({
            type: function( obj )
            {
                return obj == null ?
                String( obj ) :
                class2type[ toString.call(obj) ] || "object";
            },

            isWindow: function( obj )
            {
                return obj && typeof obj === "object" && "setInterval" in obj;
            }
        });

        PianoMediaQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
            class2type[ "[object " + name + "]" ] = name.toLowerCase();
        });

        rootPianoMediaQuery = PianoMediaQuery(document);

        return PianoMediaQuery;

    })();

    // Expose PianoMediaQuery to the global object
    window.PianoMediaQuery = PianoMediaQuery;
})(window);
var PianoMedia = {

    version: 3,
    mode: 1,
    service_id: "_",
    article_id: "_",
    method_encrypt: false,
    method_verify: false,
    referer : "",
    is_post : null,
    post_args : null,
    allow_refresh: true,
    open_capping: 0,
    client_id: "_",
    gaq_linker: false,
    url: null,
    language: null,
    piano_root_placed: false,
    main_domain: null,
    box_auto_popup: null,

    registeredCallbacks : {},

    resetCallbacks : function () {
        this.registeredCallbacks = {
            /* function (isUserLogged, userData, hasAccess, boxData) {} */
            onBarLoaded : [],
            /* function (UID) {} */
            onUIDDetected :[]
        };
    },

    triggerCallback : function (callback, params) {
        if (this.registeredCallbacks[callback] instanceof Array)
        {
            var cbs = this.registeredCallbacks[callback];
            while (cbs.length > 0) {
                var cb = cbs.shift();
                setTimeout((function() {
                    var cbf = cb;
                    return function() {
                        cbf.apply(null, params)
                    }
                })(), 0);
            }
        }
    },

    getStyle: function(oElm, strCssRule){
        var strValue = "";
        if(document.defaultView && document.defaultView.getComputedStyle){
            strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
        }
        else if(oElm.currentStyle){
            strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1){
                return p1.toUpperCase();
            });
            strValue = oElm.currentStyle[strCssRule];
        }
        return strValue;
   },

    init: function(options)
    {
        this.resetCallbacks();

        var cse = true;
        

        PianoMedia.uid.init(cse);

        this.mode = options['mode'];
        this.client_id = options['client_id'] || "_";
        this.service_id = options['service_id'] || "_";
        this.article_id = options['article_id'] || "_";

        if (typeof options['method_encrypt'] != 'undefined')
        {
            this.method_encrypt = options['method_encrypt'];
        }

        if (typeof options['method_verify'] != 'undefined')
        {
            this.method_verify = options['method_verify'];
        }

        if (typeof options['language'] != 'undefined')
        {
            this.language = options['language'];
        }

        if (typeof options['referer'] != 'undefined')
        {
            this.referer = options['referer'];
        }

        if (typeof options['is_post'] != 'undefined')
        {
            this.is_post = options['is_post'];
        }

        if (typeof options['post_args'] != 'undefined')
        {
            this.post_args = options['post_args'];
        }

        if (typeof options['allow_refresh'] != 'undefined')
        {
            this.allow_refresh = options['allow_refresh'];
        }

        if (typeof options['open_capping'] != 'undefined')
        {
            this.open_capping = options['open_capping'];
        }

        if (typeof options['gaq_linker'] != 'undefined')
        {
            this.gaq_linker = options['gaq_linker'];
        }

        if (typeof options['url'] != 'undefined')
        {
            this.url = options['url'];
        }

        if (typeof options['piano_root_placed'] != 'undefined')
        {
            this.piano_root_placed = options['piano_root_placed'];
        }

        if (typeof options['main_domain'] != 'undefined')
        {
            this.main_domain = options['main_domain'];
        }

        if (typeof options['box_auto_popup'] != 'undefined')
        {
            this.box_auto_popup = options['box_auto_popup'];
        }

        if (options['callbacks'] instanceof Array)
        {
            var cbs = options['callbacks'];
            for (var i = 0; i < cbs.length; i++)
            {
                var cb = cbs[i];
                if (cb instanceof Array && cb.length == 2)
                {
                    var c = cb[0];
                    var ccb = cb[1];
                    if (this.registeredCallbacks[c] instanceof Array) {
                        this.registeredCallbacks[c].push(ccb);
                    }
                }
            }
        }

        this.paymentStatus = false;
        

        this.reload_customer = (typeof(options['reload_customer']) !== 'undefined') ? options['reload_customer'] : '0';
        this.renderer.init();
    },

    getClientId: function()
    {
        return this.client_id;
    },

    getServiceId: function()
    {
        return this.service_id;
    },

    getArticleId: function()
    {
        return this.article_id;
    },

    getLocation: function()
    {
        return encodeURIComponent(PianoMedia.url || window.location.href);
    },

    getReloadCustomer: function()
    {
        return this.reload_customer;
    },

    getLanguage: function()
    {
        return this.language;
    },

    clickPayment: function()
    {
        PianoMedia.box.info.open();
    },

    clickPaymentPreselected: function(price_elm_id, payment_option_elm_id)
    {
        // obsolete
    },

    clickPaymentPromo: function(promo)
    {
        // obsolete
    },

    getPaymentStatus: function()
    {
        return this.paymentStatus;
    },

    /**
     * @param src source of JS without protocol
     * @param element DOM element which will be appending loaded script (optional)
     */
    loadJs: function(src, element)
    {
        

        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = PianoMedia.protocol + src;

        if (typeof element != 'undefined') {
            element.appendChild(s);
        } else {
            var p = document.getElementsByTagName('script')[0];
            p.parentNode.insertBefore(s, p);
        }
    },

    /**
     * Return true if it's mobile or if bar is in mobile mode
     * @return {Boolean}
     */
    isMobile: function()
    {
        

        return this.isIpad() || this.isIphone() || this.isAndroid() || this.isMobileMode() || this.isWindowsPhone() || this.isSymbian();
    },

    /**
     *
     * @return {Boolean}
     */
    isMobileMode: function()
    {
        return (this.mode == 'bar_mobile');
    },

    isMobileBarDisplayed: function()
    {
        return (PianoMedia.getStyle(document.getElementById('pnmdMobileBar'), 'display') == 'block');
    },

    isWindowsPhone: function()
    {
        return navigator.platform.toLowerCase().indexOf("phone") != -1;
    },

    isSymbian: function()
    {
        return navigator.platform.toLowerCase().indexOf("symbian") != -1;
    },

    /**
     * Return true if it's Android
     * @return {Boolean}
     */
    isAndroid: function()
    {
        return navigator.userAgent.toLowerCase().indexOf("android") != -1;
    },

    /**
     * Return true if it's iPad
     * @return {Boolean}
     */
    isIpad: function()
    {
        return navigator.platform.indexOf("iPad") != -1;
    },

    /**
     * Return true if it's iPhone or iPod
     * @return {Boolean}
     */
    isIphone: function()
    {
        return (navigator.platform.indexOf("iPhone") != -1) || (navigator.platform.indexOf("iPod") != -1);
    },

    /**
     * Reload page if it's allowed
     */
    refreshMedia: function()
    {
        if (this.method_verify == true && this.allow_refresh == true)
        {
            window.location.reload();
        }
    }
};
PianoMedia.protocol = 'https://'; 
PianoMedia.language = 'en'; 
PianoMedia.bar_url_no_lang = 'bar.piano-media.com';
PianoMedia.bar_url = 'bar.piano-media.com/lite';
PianoMedia.piano_url = 'www.piano-media.com';
PianoMedia.harvester_url = 'harvester.piano-media.com';
PianoMedia.mp_url = 'mp.piano-media.com';
PianoMedia.custom_label = 'newsweek';
PianoMedia.custom_url = '/custom/newsweek';
PianoMedia.t = function(constant_name)
{
    if (typeof(PianoMedia.translateConstants[PianoMedia.language][constant_name]) == 'undefined')
    {
        return '';
    }

    return PianoMedia.encrypt.decodeBase64(PianoMedia.translateConstants[PianoMedia.language][constant_name]);
};
PianoMedia.cookieHandler = {

    getCookie: function(name)
    {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');

        for (var i=0; i < ca.length; i++)
        {
            var c = ca[i];
            while (c.charAt(0) == ' ')
            {
                c = c.substring(1, c.length);
            }

            if (c.indexOf(nameEQ) == 0)
            {
                return c.substring(nameEQ.length, c.length);
            }
        }

        return null;
    },

    setSimpleCookie: function(name, value)
    {
        document.cookie = name + "=" + value + ";path=/";
    },

    setCookie: function(name, value, days)
    {
        var expires = "";

        if (days && days != 0)
        {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        }

        document.cookie = name + "=" + value + expires + "; path=/; domain=" + this.getMainDomain(window.location.hostname) + ";";
    },

    setCookieToDate: function(name, value, date){
        var expires = "; expires=" + date.toGMTString();
        document.cookie = name + "=" + value + expires + "; path=/; domain=" + this.getMainDomain(window.location.hostname) + ";";
    },

    getMainDomain: function(domain)
    {
        if (PianoMedia.main_domain !== null) {
            return PianoMedia.main_domain;
        }

        var a = domain.split('.');
        var main_domain = '';

        if (a.length > 1)
        {
            var second_level = a[a.length - 2];
            var country_code = a[a.length - 1];

            main_domain = '.' + second_level + '.' + country_code;

            var top_levels = {
                "pl": ['com', 'biz', 'net', 'art', 'edu', 'org', 'gov', 'info', 'mil'],
                "si": [],
                "sk": [],
                "uk": ["co"]
            };

            if (typeof top_levels[country_code] != 'undefined')
            {
                for (var key in top_levels[country_code])
                {
                    if(second_level === top_levels[country_code][key])
                    {
                        main_domain = '.' + a[a.length - 3] + main_domain;
                    }
                }
            }
        }

        return main_domain;
    },

    deleteCookie: function(name)
    {
        this.setCookie(name, "", -1);
    },

    deleteSimpleCookie: function(name)
    {
        this.setSimpleCookie(name, "");
    },

    getVisitKeyCookie: function()
    {
        return this.getCookie('pianovisitkey') || "";
    }
};
PianoMedia.encrypt = {
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    showArticle: function(article_id, content)
    {
        var article = document.getElementById('pianoArticle' + article_id);
        if (article)
        {
            article.innerHTML = this.decodeBase64(content);

            var scripts = article.getElementsByTagName('script');
            var limit = scripts.length;

            for (var i = 0; i < limit; i++)
            {
                if (scripts[i].src.length > 0) {
                    PianoMedia.loadJs(scripts[i].src.replace(/https?:\/\//, ''), scripts[i].parentNode);
                } else if (scripts[i].innerHTML.length > 0) {
                    var innerScript = scripts[i].innerHTML.replace(/;\s*$/, '');
                    eval(innerScript);
                }
            }
        }
    },

    decodeBase64: function(input)
    {
        if (typeof window['atob'] == 'function')
        {
            return  this.utf8_decode(atob(input));
        }

        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length)
        {
            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64)
            {
                output = output + String.fromCharCode(chr2);
            }

            if (enc4 != 64)
            {
                output = output + String.fromCharCode(chr3);
            }
        }

        return this.utf8_decode(output);
    },

    utf8_decode : function(utftext)
    {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while ( i < utftext.length )
        {

            c = utftext.charCodeAt(i);

            if (c < 128)
            {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224))
            {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else
            {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }

        return string;
    }
};
PianoMedia.translateConstants = [];
PianoMedia.translateConstants['en'] = {
    "bar.unlogged.info": "R2V0IEZ1bGwgRGlnaXRhbCBBY2Nlc3MgV2hlbiBZb3UgU2lnbiBVcCBmb3IgSG9tZSBEZWxpdmVyeS4g",
    "bar.details": "TW9yZSBJbmZv",
    "bar.register": "UmVnaXN0ZXI=",
    "bar.login": "U2lnbiBJbg==",
    "bar.dropdown.subscribe": "c3Vic2NyaWJl",
    "bar.logout": "TE9HT1VU",
    "bar.close": "Q2xvc2U=",
    "bar.info_text": "YmFyLmluZm9fdGV4dA==",
    "bar.loginbox.register": "UmVnaXN0cmF0aW9u",
    "bar.article_count": "YmFyLmFydGljbGVfY291bnQ=",
    "bar.notice_box.text1": "YmFyLm5vdGljZV9ib3gudGV4dDE=",
    "bar.notice_box.text2-4": "YmFyLm5vdGljZV9ib3gudGV4dDItNA==",
    "bar.notice_box.text5": "YmFyLm5vdGljZV9ib3gudGV4dDU=",
    "bar.notice_box.buy_button": "YmFyLm5vdGljZV9ib3guYnV5X2J1dHRvbg==",
    "bar.notice_box.text1.newsweek": "YmFyLm5vdGljZV9ib3gudGV4dDEubmV3c3dlZWs=",
    "bar.notice_box.text2-4.newsweek": "WW91IG9ubHkgaGF2ZSB0d28gPHN0cm9uZz5mcmVlIGFydGljbGVzPC9zdHJvbmc+IHJlbWFpbmluZyB0aGlzIG1vbnRoLg==",
    "bar.notice_box.text5.newsweek": "YmFyLm5vdGljZV9ib3gudGV4dDUubmV3c3dlZWs="
}

PianoMedia.translateConstants['si'] = {
    "bar.unlogged.info": "YmFyLnVubG9nZ2VkLmluZm8=",
    "bar.details": "YmFyLmRldGFpbHM=",
    "bar.register": "YmFyLnJlZ2lzdGVy",
    "bar.login": "YmFyLmxvZ2lu",
    "bar.dropdown.subscribe": "YmFyLmRyb3Bkb3duLnN1YnNjcmliZQ==",
    "bar.logout": "YmFyLmxvZ291dA==",
    "bar.close": "YmFyLmNsb3Nl",
    "bar.info_text": "YmFyLmluZm9fdGV4dA==",
    "bar.loginbox.register": "YmFyLmxvZ2luYm94LnJlZ2lzdGVy",
    "bar.article_count": "YmFyLmFydGljbGVfY291bnQ=",
    "bar.notice_box.text1": "YmFyLm5vdGljZV9ib3gudGV4dDE=",
    "bar.notice_box.text2-4": "YmFyLm5vdGljZV9ib3gudGV4dDItNA==",
    "bar.notice_box.text5": "YmFyLm5vdGljZV9ib3gudGV4dDU=",
    "bar.notice_box.buy_button": "YmFyLm5vdGljZV9ib3guYnV5X2J1dHRvbg==",
    "bar.notice_box.text1.newsweek": "YmFyLm5vdGljZV9ib3gudGV4dDEubmV3c3dlZWs=",
    "bar.notice_box.text2-4.newsweek": "YmFyLm5vdGljZV9ib3gudGV4dDItNC5uZXdzd2Vlaw==",
    "bar.notice_box.text5.newsweek": "YmFyLm5vdGljZV9ib3gudGV4dDUubmV3c3dlZWs="
}

PianoMedia.template = {
    sources: { },
    dataProvider: { newArticlesCount: 0, remainingArticlesCount: 0},
    contentProvider: { },

    injectResponse: function(responseType) {
        var usedTemplate = this.getUsableTemplateType(responseType);
        var usedInjectElement = this.getUsableInjectElement(responseType);

        var response = PianoMedia.template.sources()[usedTemplate];

        for (var key in PianoMedia.template.contentProvider) {
            for (var string in PianoMedia.template.contentProvider[key]) {
                if (PianoMedia.template.contentProvider[key][string].constructor === Object)
                {
                    var translation = PianoMedia.t(PianoMedia.template.contentProvider[key][string][PianoMedia.template.dataProvider[key]]);
                    var search = new RegExp('<#=' + key + '\\?' + string + '>', 'g');
                }
                else
                {
                    var translation = PianoMedia.t(PianoMedia.template.contentProvider[key][PianoMedia.template.dataProvider[key]]);
                    var search = new RegExp('<#=' + key + '>', 'g');
                }
                response = response.replace(search, translation);
            }
        }

        for (var string in PianoMedia.template.dataProvider) {
            translation = PianoMedia.template.dataProvider[string];
            search = new RegExp('<=' + string + '>', 'g');
            response = response.replace(search, translation);
        }

        document.getElementById('pnmdTemplate_' + usedInjectElement).innerHTML = response;
        this.injectMobileResponse(responseType);
    },

    injectMobileResponse: function(responseType) {
        var usedTemplate = this.getUsableMobileTemplateType(responseType + '_mobile');
        if (usedTemplate === null)
        {
            return;
        }

        var response = PianoMedia.template.sources()[usedTemplate];

        for (var key in PianoMedia.template.contentProvider) {
            for (var string in PianoMedia.template.contentProvider[key]) {
                if (PianoMedia.template.contentProvider[key][string].constructor === Object)
                {
                    var translation = PianoMedia.t(PianoMedia.template.contentProvider[key][string][PianoMedia.template.dataProvider[key]]);
                    var search = new RegExp('<#=' + key + '\\?' + string + '>', 'g');
                }
                else
                {
                    var translation = PianoMedia.t(PianoMedia.template.contentProvider[key][PianoMedia.template.dataProvider[key]]);
                    var search = new RegExp('<#=' + key + '>', 'g');
                }
                response = response.replace(search, translation);
            }
        }

        for (var string in PianoMedia.template.dataProvider) {
            translation = PianoMedia.template.dataProvider[string];
            search = new RegExp('<=' + string + '>', 'g');
            response = response.replace(search, translation);
        }

        document.getElementById('pnmdMobileCustomerInfo').innerHTML = response;
    },

    getUsableTemplateType: function(responseType) {
        if (typeof this.sources()[responseType] !== 'undefined' && this.sources()[responseType] != null) {
            return responseType;
        } else {
            var parent = responseType.split('_').slice(0,-1).join('_');
            return this.getUsableTemplateType(parent);
        }
    },

    getUsableMobileTemplateType: function(responseType) {
        if (typeof this.sources()[responseType] !== 'undefined' && this.sources()[responseType] != null) {
            return responseType;
        } else {
            var parent = responseType.split('_').slice(0,-2).join('_') + '_mobile';
            return (parent !== '_mobile') ? this.getUsableMobileTemplateType(parent) : null;
        }
    },

    getUsableInjectElement: function(responseType) {
        var element = document.getElementById('pnmdTemplate_' + responseType);
        if (typeof element !== 'undefined' && element != null) {
            return responseType;
        } else {
            var parent = responseType.split('_').slice(0,-1).join('_');
            return this.getUsableInjectElement(parent);
        }
    }
};

PianoMedia.template.sources = function() {
    return sources = {
        'logged_active': 'Welcome <a id="PianoMediaBarEmailHref" href="http://www.newsweek.com/my-account" target="_blank"><=email></a>! You have <span style="color:#cd0000; font-weight:bold;"><strong><=remainingDaysRaw></strong></span> days remaining on your subscription. <a href="javascript:void(0);" onclick="PianoMedia.box.payment.toggle();" style="font-weight: bold;">Renew?</a><div id="pianoMediaLogout" class="pianoMediaBlackButton"><a id="pianoMediaLogoutHref" href="<=logoutHref>">Log out</a></div>' ,
        'logged_active_mobile': '<p><div id="PianoMediaBarEmailHref"><a href="http://www.newsweek.com/my-account" target="_blank"><=email></a></div><div class="pnmdMobileContentInfo" id="pnmdMobileContentAccess">Access to paid content: <span>Active</span></div><div class="pnmdMobileContentInfo" id="pnmdMobileContentRenew">Remaining: <span><=remainingDays></span></div></p><input type="hidden" id="pnmdLogoutLink" value="<=logoutHref>" />' ,
        'logged_inactive': 'Welcome <a id="PianoMediaBarEmailHref" href="http://www.newsweek.com/my-account" target="_blank"><=email></a>! Your subscription is <span style="color:#cd0000"><strong>inactive</strong></span>. <a href="javascript:void(0);" onclick="PianoMedia.box.payment.toggle();">Update now!</a><div id="pianoMediaLogout" class="pianoMediaBlackButton"><a id="pianoMediaLogoutHref" href="<=logoutHref>">Log out</a></div>' ,
        'logged_inactive_mobile': '<p><div id="PianoMediaBarEmailHref"><a href="http://www.newsweek.com/my-account" target="_blank"><=email></a></div><div class="pnmdMobileContentInfo" id="pnmdMobileContentAccess">Access to paid content: <span>Inactive</span></div><div class="pnmdMobileContentInfo" id="pnmdMobileContentRenew"><a href="javascript:PianoMedia.box.payment.open();return false;" onclick="PianoMedia.mobile.toggleMenu();"><span>Click here to renew</span></a></div></p><input type="hidden" id="pnmdLogoutLink" value="<=logoutHref>" />' ,
        'meteredreminder': '<div id="pianoMediaBoxNoticeContent"><span id="pianoMediaBoxNoticeArrow" class="detail-arrow"></span><div id="pianoMediaBoxNoticeText">You only have two <strong>free articles</strong> remaining this month.</div><a href="javascript:PianoMedia.box.mpNotice.close();PianoMedia.box.payment.open();"><div class="redButton">Subscribe now!</div></a><a id="pianoMediaBoxNoticeClose" class="red-cross" onclick="PianoMedia.box.mpNotice.close();"></a></div>' ,
        'unlogged': '<div><span id="pianoMediaInfoText" class="pianoMediaInfoText">' + PianoMedia.t("bar.unlogged.info") + '</span><span id="pianoMediaDetailsLink" onclick="PianoMedia.box.payment.toggle()">' + PianoMedia.t("bar.details") + '</span><div id="pianoMediaRegister" class="pianoMediaBlackButton"><a id="pianoMediaRegisterHref" href="javascript:PianoMedia.box.payment.toggle()">' + PianoMedia.t("bar.register") + '</a></div><div id="pianoMediaLogin" class="pianoMediaWhiteButton"><a id="pianoMediaLoginHref" href="javascript:PianoMedia.box.login.toggle()">' + PianoMedia.t("bar.login") + '</a></div><div style="clear:left"></div></div>' 
    }
}


PianoMedia.renderer = {
    articleCount: 0,

    init: function()
    {
        var html = '<div id="pianoMediaBar"> <div id="pianoMediaBarContent"> <div id="pianoMediaBoxNotice"> <span id="pnmdTemplate_meteredreminder"><!-- meteredreminder --></span> </div> <div id="pianoMediaBarLeft"></div> <div id="pianoMediaProfile"></div> <div id="pianoMediaBarRight"> <div id="pianoMediaBarRightLogged"> <span id="pnmdTemplate_logged_active"><!-- logged_active --></span> <span id="pnmdTemplate_logged_inactive"><!-- logged_inactive --></span> </div> <div id="pianoMediaBarRightUnlogged"> <span id="pnmdTemplate_unlogged"><!-- unlogged --></span> </div> </div> </div> <div id="pnmdMobileBar"> <a href="javascript://" id="pnmdMobileBtnRegister" class="pnmdMobileBtn pnmdMobileBtnBlack" onclick="PianoMedia.mobile.openRegister();"></a> <a href="javascript://" id="pnmdMobileBtnMenu" class="pnmdMobileBtn" onclick="PianoMedia.mobile.toggleMenu()"></a> <a href="javascript://" id="pnmdMobileBtnLogin" style="display:none" class="pnmdMobileBtn pnmdMobileBtnRight" onclick="PianoMedia.box.login.toggle()"><!-- ' + PianoMedia.t("bar.login") + ' --></a> <a href="javascript://" id="pnmdMobileBtnClosePayment" class="pnmdMobileBtn pnmdMobileBtnLeft" onclick="PianoMedia.mobile.close()">' + PianoMedia.t("bar.close") + '</a> <a href="javascript://" id="pnmdMobileBtnCloseLogin" class="pnmdMobileBtn pnmdMobileBtnRight" onclick="PianoMedia.mobile.closeLogin()"></a> <a href="javascript://" id="pnmdMobileBtnLogout" style="display:none" class="pnmdMobileBtn pnmdMobileBtnRight" target="_parent">Sign Out</a> </div> <div id="pnmdMobileBarContent" class="pnmdMobileBarContentClosed"> <iframe id="pnmdMobileIframeLogin" frameborder="0" border="0" allowtransparency="true" vspace="0" hspace="0" src=""></iframe> <div id="pnmdMobileIframeLoginControls"> <a id="pnmdMobileIframeLoginClose" href="javascript:PianoMedia.mobile.closeLogin();">&#x2715;</a> </div> <div id="pnmdMobileCustomerInfo"></div> <iframe id="pnmdMobileIframePayment" frameborder="0" border="0" allowtransparency="true" vspace="0" hspace="0" src=""></iframe> </div> </div> <div id="pianoMediaBoxModal"></div> <div id="pianoMediaBoxInfoCover"> <div id="pianoMediaBoxInfo"> <a id="pianoMediaBoxInfoOneDayPromoClose" style="cursor: pointer; width: 202px; height: 52px; position: absolute; top: 407px; left: 681px; display: none;" onclick="PianoMedia.box.oneDayPromo.close();"></a> <a id="pianoMediaBoxInfoYearliesPromoClose" style="cursor: pointer; width: 202px; height: 52px; position: absolute; top: 413px; left: 515px; display: none;" onclick="PianoMedia.box.info.close()"></a> <span id="pianoMediaBoxInfoCloseLink" onclick="PianoMedia.box.info.close()"><span id="pianoMediaBoxInfoCloseLinkImg"></span><span id="pianoMediaBoxInfoCloseLinkText">&#x2715;</span></span> <iframe id="pianoMediaBoxInfoIframe" frameborder="0" border="0" allowtransparency="true" vspace="0" hspace="0" src=""></iframe> </div> </div> <div id="pianoMediaBoxLogin"> <iframe id="pianoMediaBoxLoginIframe" frameborder="0" border="0" allowtransparency="true" vspace="0" hspace="0" src=""></iframe> <div id="pianoMediaBoxLoginControls"> <a id="pianoMediaBoxLoginControlsRegister" href="javascript: PianoMedia.box.info.open()">' + PianoMedia.t("bar.loginbox.register") + '</a> <a id="pianoMediaBoxLoginControlsClose" style="margin-left: 40px;" href="javascript: PianoMedia.box.login.close()">&#x2715;</a> </div> </div> <div id="pianoMediaBoxLoginMobile"> <iframe id="pianoMediaBoxLoginIframeMobile" frameborder="0" border="0" allowtransparency="true" vspace="0" hspace="0" src=""></iframe> <div id="pianoMediaBoxLoginMobileControls"> <a id="pianoMediaBoxLoginMobileControlRegister" href="javascript: PianoMedia.box.info.open()">' + PianoMedia.t("bar.loginbox.register") + '</a> <a id="pianoMediaBoxLoginMobileControlClose" style="margin-left: 40px;" href="javascript: PianoMedia.box.login.close()">' + PianoMedia.t("bar.close") + '</a> </div> </div> <style type="text/css">#piano-root { position: relative; z-index: 9999; overflow: visible !important; } #piano-root .detail-arrow { background-image: url("data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAABkAAAAOCAYAAADaOrdAAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAALVJREFUeNqs0cEJg0AQheHfQUcFPdhCWkhqSq5px5SQFuwlLQS8eFhwcjEiIYed1XcZGJj9eGw2jiOOdMB7M6MiTmAA7su8xh5mkU06YFDVs5kxTRNmRlEUN+BxRJMVKMsSVaWua+Z5JoTQxzQSDwAgIqgqTdNEQ+IB1iMnJF4gBZIUwAtJKuCBZA8QC8leIAbKgRPwBJKBLVRVFSGE76oHuhx4AZdlaRyT7O+ftG3LUfl96zMA8zJepgDcFzUAAAAASUVORK5CYII="); position: absolute; width: 25px; height: 14px; } #piano-root .red-cross { background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAAINJREFUeNp8z8ENwjAQRNEXtA2kBqQcfKUGaqGE1EJaoARogRZSQtwCl0VKkM1cLK/+eP2HrUwzKhb93PGIhJ45XDogvCJfvXYKX/AGkZdW4QDCsJVpv3LMQsW6B+H087+KNy55HhIdmXPLIXoyLenogE3pwNwAW4V12Mo05vBfRtTPAIW2JRGHB71/AAAAAElFTkSuQmCC") no-repeat; position: absolute; width: 11px; height: 11px; } #pianoMediaBar { z-index: 9995; top: 0px; left: 0px; height: 0; width: 100%; border : 0px; margin: 0px; display: block; color: #000; background: #FFF; position: relative; font-size: 10px; } #pianoMediaUserFrameCover { border: 1px solid green; width: 100%; margin-right: -83px; float: left; height: 25px; display: none; } #pianoMediaBarContent { max-width: 1180px; width: 100%; margin: auto; position: relative; } #pianoMediaUserFrameCover div { margin-right: 83px; } #pianoMediaUserFrame { width: 100%; } #pianoMediaBoxNotice { background: url("data:image/png;base64,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") #FFF no-repeat 13px center; width: 360px; height: 95px; border: 1px solid #e5e5e5; box-shadow: 4px 4px 7px #c2c2c2; position: absolute; z-index: 999999; top: 40px; right: 0px; display: none; font-size: 14px; line-height: 17px; } #pianoMediaBoxNoticeArrow { top: -12px; right: 90px; } #pianoMediaBoxNoticeClose { right: 6px; top: 7px; } #pianoMediaBoxNoticeContent { width: 200px; float: right; margin-right: 30px; margin-top: 12px; } #pianoMediaBoxNotice .redButton { padding: 5px 4px 3px 4px; color: white; width: 200px; height: 20px; background: #ee2a26; font-family: "Georgia"; font-size: 14px; text-align: center; font-weight: bold; margin-top: 7px; } #pianoMediaBoxNotice .redButton a, #pianoMediaBoxNotice .redButton a:hover { text-decoration: none; color: white; } #pianoMediaBarRight #pianoMediaLogin, #pianoMediaBarRight #pianoMediaRegister, #pianoMediaBarRight #pianoMediaLogout { padding: 0 10px; margin: 0; color: #000000; font-weight: bold; font-family: Georgia; font-style: italic; font-size: 14px; cursor: pointer; text-align: center; position: absolute; top: 0px; right: 0px; } #pianoMediaBarRight #pianoMediaRegister, #pnmdMobileBtnRegister { padding-left: 25px; background: #000 url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAATCAYAAACQjC21AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAD4SURBVHjarJSxSgNBFEXPrhBYCAiB2FgtCFZCIG2qgN/gBwj+gf9hZ+MPWFoIYmWbWrAUYp+UCQTCsTGwLDuzM8QLUyyXe9h59zGFSkQz4AaYAgPgE3gDnoMJNXRuDesplCsif/gN1AFvD5wB67ZRRq5bR7wT4LLLCAFP6VeVA9wmAHc5wB3wE4Htga8cIMBjxHvtKqRvbQbqomNllmodysWAqJX60YKNY5myZ/DbVpvD4FUTZngATBvfI2ByDHD+t8RNXUcTjQLu1Bd1Zbo26rt6rw4PpVSBNnO1VM/7XpVcPZStoR+rqzLxIUjVuFDnwMU/Ade/AwDzbMYjzOx1+wAAAABJRU5ErkJggg==") no-repeat scroll 15px 7px; right: 80px; color: #FFF; background-size: 15px; } #pnmdMobileBtnRegister { padding-left: 43px; background-size: 20px; } #pnmdMobileBtnCloseLogin { font-size: 22px; background: #FFF; color: #000; font-style: normal; font-weight: bold; } div#pianoMediaLogout { right: 7%; } a#pianoMediaLoginHref, a#pianoMediaRegisterHref { font-weight: normal; text-align: center; text-decoration: none; padding: 0 10px; } #pianoMediaLogoutHref { font-weight: normal; text-align: center; padding: 0 10px; text-transform: uppercase; } #pianoMediaBarRight .pianoMediaWhiteButton { color: #000; background: #FFF; border-bottom: 1px solid #D6D6D6; height: 28px; } #pianoMediaBarRight .pianoMediaWhiteButton a { color: #000; text-decoration: none; } #pianoMediaBarRight .pianoMediaBlackButton { background: #000; color: #FFF; } #pianoMediaBarRight .pianoMediaBlackButton a { color: #FFF; text-decoration: none; } #pianoMediaBarLeft { width: 50%; float: left; display: none; } #pianoMediaBarRight { max-width: 1170px; width: 100%; font-family: Georgia, Arial, Helvetica, sans-serif; line-height: 28px; } #pianoMediaBarRightUnlogged { font-size: 14px; text-align: center; position: relative; } #pianoMediaBarRightUnlogged div { margin: auto; } #pianoMediaBarRightLogged { font-style: italic; font-size: 14px; text-align: center; position: relative; } #pianoMediaBarRightLogged a { text-decoration: underline; color: #ee2a26; } #pianoMediaBar #pianoMediaDetailsLink { margin: 0 3px 0 0; cursor: pointer; width: 95px; height: 26px; text-align: left; color: #ED2A26; font-weight: bold; font-size: 14px; font-style: italic; display: inline-block; } #pianoMediaBar .pianoMediaInfoText { margin: 0 5px 0 0; text-decoration: none; height: 26px; width: 430px; font-size: 14px; text-align: right; } #pianoMediaBoxLogin { z-index: 999999; height: 470px; width: 420px; overflow: hidden; position: fixed; right: 0; text-align: center; background-color: transparent; max-width: 950px; margin-bottom: -600px; display: none; } #pianoMediaBoxLogin iframe { overflow: hidden; margin: auto 0px; border: 0px solid rgb(192, 192, 192); height: 470px; width: 100%; max-width: 950px; } #pianoMediaBoxLogin div { text-align: left; margin: 0px 10px; height: 16px; line-height: 12px; overflow: hidden; } #pianoMediaBoxLogin div a { text-align: left; text-decoration: underline; line-height: 12px; margin: 0px; color: rgb(80, 80, 80); font-size: 10px; font-family: arial; } #pianoMediaBoxLoginControls { display: inline; } #pnmdMobileBarContent #pnmdMobileIframeLoginControls a#pnmdMobileIframeLoginClose { display: none !important; color: black; font-weight: bold; position: absolute; text-decoration: none; text-transform: none; font-size: 20px !important; } #pianoMediaBoxLogin #pianoMediaBoxLoginControls a#pianoMediaBoxLoginControlsClose { color: #000; position: absolute; text-decoration: none; text-transform: none; font-size: 22px !important; } #pianoMediaBoxLogin #pianoMediaBoxLoginControls a#pianoMediaBoxLoginControlsClose { top: 15px; right: 10px; font-size: 0.8em; } #pnmdMobileBarContent #pnmdMobileIframeLoginControls a#pnmdMobileIframeLoginClose { font-weight: bold; right: 30px; top: 11px; } #pianoMediaBoxLogin #pianoMediaBoxLoginControls a#pianoMediaBoxLoginControlsClose span, #pnmdMobileBarContent #pnmdMobileIframeLoginControls a#pnmdMobileIframeLoginClose span { display: none; font-size: 1.6em; position: relative; top: 2px; } #pianoMediaBoxLoginMobile { z-index: 999999; width: 100%; height: 100%; display: none; overflow: hidden; position: absolute; top: 28px; left: 0px; background-color: #fff; } #pianoMediaBoxLoginMobile iframe { overflow: hidden; margin: 0px; border: 0px solid rgb(192, 192, 192); height: 100%; width: 100%; } #pianoMediaBoxInfoCover { z-index: 9981; position: absolute; width:100%; height:inherit; left: 0px; display: none; top: 50vh; transform: translate(0, -50%); } #pianoMediaBoxInfo { position: relative; background-color: grey; z-index: 9998; width: 100%; height: 550px; max-width: 950px; margin: auto; top: 0px; } #pianoMediaBoxInfo span#pianoMediaBoxInfoCloseLink { display: block; border-width: 0px; cursor: pointer; top: 28px; right: 15px; position: absolute; text-align: center; color: #000; padding: 2px 8px; font-size: 22px; } #pnmdMobileIframeLoginClose { margin-left: 40px; z-index: 9980; } #pianoMediaBoxInfo div#LoginLinkOverlay { cursor: pointer; top: 135px; left: 240px; width: 400px; height: 30px; position: absolute; z-index: 9996; background-image: url("https://bar.piano-media.com/lite/images/spacer.gif"); } #pianoMediaBoxInfo div#PaymentLinkOverlay { cursor: pointer; top: 105px; left: 45px; width: 180px; height: 75px; position: absolute; z-index: 9996; } #pianoMediaBoxInfo div#PaymentLinkOverlay2 { cursor: pointer; top: 205px; left: 10px; width: 900px; height: 300px; position: absolute; z-index: 9996; } #pianoMediaBoxInfo iframe { border-width: 0px; overflow: hidden; height: 606px; width: 100%; max-width: 950px; box-shadow: 0 0 4px rgba(0, 0, 0, 0.5); } #pianoMediaBoxModal { z-index: 9980; background-color: black; position: fixed; width:100%; height:0; left: 0px; top: 0px; display: none; -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=70)"; filter: alpha(opacity=70); -moz-opacity: 0.7; -khtml-opacity: 0.7; opacity: 0.7; } #pnmdMobileBar, #pnmdMobileBarContent, #pnmdMobileIframeLogin, #pnmdMobileCustomerInfo, #pnmdMobileIframePayment { display: none; } .pnmdMobileBtn, .pnmdMobileBtnBlack { padding: 0 20px; font-family: Georgia, Arial, sans-serif; font-size: 18px; font-style: italic; text-align: center; text-decoration: none; background: #000; color: #FFF; } .pnmdMobileBtnRight { float: right; } .pnmdMobileBtnLeft { float: left; } #pnmdMobileBarContent { overflow: hidden; height: 0; position:relative; } #pnmdMobileBtnLogin, #pnmdMobileBtnRegister, #pnmdMobileBtnMenu, #pnmdMobileBtnCloseLogin, #pnmdMobileBtnLogout, #pnmdMobileBtnClosePayment, #pnmdMobile{ display: none; } #pnmdMobileIframeLogin { width: 100%; height: 370px; overflow: hidden; } #pnmdMobileIframePayment { position:relative; overflow: hidden; margin: 0px; border-style: solid; border-color: rgb(192, 192, 192); border-width: 0px; height: 100%; width: 100%; display: none; } #pnmdMobileBtnMenu { background: #FFF url("data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAC8AAAAVCAYAAADWxrdnAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAABkSURBVHja7NQhCoBQEEXRo8EkuHuX8Zs7ElyDFi0/GU0OvAvTXxgOzFix4y5we987Qysy+n1twIlJva4Rm5ptsPQfOoq8y9H3LlL6VpyP83E+zqc4H+fjfJz/gfMPAAAA//8DAMYpnEWUgyXYAAAAAElFTkSuQmCC ") no-repeat scroll center center; /* m-btn-menu.png */ width: 10px; height: 100%; float: left; } #pnmdMobileBarContent { overflow: visible; height: auto; } #pnmdMobileBarContent.pnmdMobileBarContentOpened { display: block; } #pnmdMobileBarContent.pnmdMobileBarContentClosed { display: none; border: 0; height: 0; overflow: hidden; } #pnmdMobileBarContent.pnmdMobileBarPaymentOpened { display: block; height: auto; } #pnmdMobileBarContent.pnmdMobileBarPaymentClosed { display: none; border: 0; height: 0; overflow: hidden; } #pnmdMobileCustomerInfo { border-top: 10px solid #ee2a26; font-style: italic; padding: 20px; font-size: 20px; font-family: Georgia, Tahoma, sans-serif; } #pnmdMobileCustomerInfo p { margin: 0; } #pnmdMobileCustomerInfo a { color: #ee2a26; } #pnmdMobileCustomerInfo .pnmdMobileContentInfo { font-weight: bold; } #pnmdMobileCustomerInfo span { font-weight: bold; color: #ee2a26; } #pnmdMobileCustomerInfo div { margin: 6px 0; } #pnmdMobileBar { display: none; height: 0px; line-height: 0px; padding: 0 10px; background: #FFF; // height: 35px; // line-height: 35px; // border-bottom: 2px solid #d6d6d6; } @media ( max-width: 990px), (max-device-width: 990px) { #pianoMediaBar { background: #FFF; /* min-height: 35px; */ height: auto; width: auto; position: relative; left: 0; right: 0; } #pianoMediaBoxNotice { top: 50px; right: 5px; max-width: 360px; width: 100%; } #pianoMediaBoxNoticeArrow { right: 10px; } #pnmdMobileBar { display: block; } #pianoMediaInfoText, #pianoMediaBoxLogin { display: none; } #pianoMediaDetailsLink { display: none; } #pianoMediaBarContent { margin-right: 0; } #pianoMediaBarRight { display: none; } #pianoMediaLogin { right: 0; display: none !important; } } /* forced mobile bar */ .piano-mobile #pianoMediaBar { /* display: none; */ background: #FFF; height: auto; width: auto; position: relative; left: 0; right: 0; } .piano-mobile #pnmdMobileBar { display: block; } .piano-mobile #pianoMediaInfoText { display: none; } .piano-mobile #pianoMediaDetailsLink { display: none; } .piano-mobile #pianoMediaBarContent { margin-right: 0; } .piano-mobile #pianoMediaBarRight { display: none; } .piano-mobile #pianoMediaLogin { right: 0; display: none !important; } /* Retina */ @media (-webkit-min-device-pixel-ratio: 1.5), ( min--moz-device-pixel-ratio: 1.5), ( -moz-min-device-pixel-ratio: 1.5), ( -o-min-device-pixel-ratio: 1.5/1), ( min-device-pixel-ratio: 1.5), ( min-resolution: 192dpi), ( min-resolution: 1.5dppx) { .piano-mobile #pianoMediaBar { /* display: none; */ background: #FFF; } #pnmdMobileBtnMenu { background: #FFF; } } @media (-webkit-min-device-pixel-ratio: 1.5) and (max-width: 990px), ( min--moz-device-pixel-ratio: 1.5) and (max-width: 990px), ( -moz-min-device-pixel-ratio: 1.5) and (max-width: 990px), ( -o-min-device-pixel-ratio: 1.5/1) and (max-width: 990px), ( min-device-pixel-ratio: 1.5) and (max-width: 990px), ( min-resolution: 192dpi) and (max-width: 990px), ( min-resolution: 1.5dppx) and (max-width: 990px) { #pianoMediaBar { /* display: none; */ background: #FFF; } } .prolongMobile { background: url("https://bar.piano-media.com/lite/images/predlzit-mobile.png"); width: 201px; height: 30px; display: block; text-transform: uppercase; margin: 0px auto; color: #fff; text-align: center; text-decoration: none; font-weight: bold; }</style>';
        this.pianoroot = document.getElementById('piano-root');

        if (this.pianoroot == null || typeof(this.pianoroot) == 'undefined')
        {
            this.pianoroot = document.createElement('div');
            this.pianoroot.setAttribute("id", "piano-root");
        }

        this.pianoroot.innerHTML = html;

        var has_parent = true;
        var parent = document.getElementById('pravda-sk-body');

        if (parent == null)
        {
            parent = document.body;

            if (parent == null)
            {
                has_parent = false;

                window.onload = function()
                {
                    parent = window.document.body;
                    if (parent.firstChild) {
                        parent.insertBefore(PianoMedia.renderer.pianoroot, parent.firstChild);
                    }
                    else {
                        parent.appendChild(PianoMedia.renderer.pianoroot);
                    }
                    PianoMedia.renderer.initMode();
                    PianoMedia.auth.init();
                }
            }
        }

        if (has_parent == true)
        {
            if (!PianoMedia.piano_root_placed)
            {
                if (parent.firstChild) {
                    parent.insertBefore(this.pianoroot, parent.firstChild);
                }
                else {
                    parent.appendChild(this.pianoroot);
                }
            }

            this.initMode();
            PianoMedia.auth.init();
        }

        try {
            if (typeof(pianoArticles) == 'undefined')
            {
                pianoArticles = '';
            }
        } catch (e) {
            pianoArticles = '';
        }
        if (pianoArticles == '')
        {
            var onLoadFunctions = [];
            if (window.onload != null && typeof(window.onload) == 'function')
            {
                onLoadFunctions.push(window.onload);
            }

            onLoadFunctions.push(function(){
                if (pianoArticlesDefault != pianoArticles) {
                    PianoMedia.auth.reloadArticle();
                }
            });

            window.onload = function()
            {
                for(var i = 0; i < onLoadFunctions.length; i++)
                {
                    onLoadFunctions[i]();
                }
            }
        }
    },

    initMode: function()
    {
        var getRootStyle = function ()
        {
            return document.getElementById('piano-root').style;
        };

        if (PianoMedia.mode == 'bar_hidden')
        {
            var root_style = getRootStyle();
            root_style.display = 'none';
        }

        if (PianoMedia.mode == 'bar_semi_hidden')
        {
            document.getElementById('pianoMediaBarContent').style.display = 'none';
            document.getElementById('pianoMediaBar').style.height = 'auto';
            document.getElementById('pianoMediaBar').style.minHeight = '0px';
            document.getElementById('pnmdMobileBar').style.display = 'none';
        }

        if (PianoMedia.mode == 'bar_mobile' || PianoMedia.isMobile())
        {
            PianoMedia.mobile.init();
        }

        if (PianoMedia.mode == 'init_cookie')
        {
            var root_style = getRootStyle();
            root_style.position = 'absolute';
            root_style.left = '-9999px';
            root_style.visibility = 'hidden';
        }
    },

    setArticleCount:function (count)
    {
        this.articleCount = count;
    },

    showLoggedUser: function()
    {
        document.getElementById('pianoMediaBarRightLogged').style.display = 'block';
        document.getElementById('pianoMediaBoxModal').style.display = 'none';
        document.getElementById('pianoMediaBoxInfoCover').style.display = 'none';

        PianoMedia.mobile.showLoggedUser();

        
    },

    showUnLoggedUser: function()
    {
        

        document.getElementById('pianoMediaBarRight').style.width = '100%';
        document.getElementById('pianoMediaBarRightUnlogged').style.display = 'block';
        document.getElementById('pianoMediaLogin').style.display = 'block';
        document.getElementById('piano-root').style.display = 'block';

        PianoMedia.mobile.showUnloggedUser();

        if (PianoMedia.mode == 'bar_lock')
        {
            document.getElementById('pianoMediaDetailsLink').setAttribute('onclick', '');
            PianoMedia.box.info.open();
            PianoMedia.box.info.disableClose();
        }

        if (PianoMedia.mode == 'bar_open')
        {
            if (PianoMedia.open_capping != 0)
            {
                var cookie_open_capping =  PianoMedia.cookieHandler.getCookie('PianoMedia.cookie.open_capping');
                var d = new Date();

                if (cookie_open_capping == null)
                {
                    PianoMedia.cookieHandler.setCookieToDate('PianoMedia.cookie.open_capping', 1, new Date(d.getFullYear(), d.getMonth(), d.getDate()+1, 0, 0, 0 , 0));
                    PianoMedia.box.info.open();
                }
                else
                {
                    if (cookie_open_capping < PianoMedia.open_capping)
                    {
                        PianoMedia.cookieHandler.setCookieToDate('PianoMedia.cookie.open_capping', ++cookie_open_capping, new Date(d.getFullYear(), d.getMonth(), d.getDate()+1, 0, 0, 0 , 0));
                        PianoMedia.box.info.open();
                    }
                }
            }
            else
            {
                PianoMedia.box.info.open();
            }
        }

        
    },

    gup: function(name)
    {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(window.location.href);

        if (results == null)
        {
            return "";
        }
        else
        {
            return results[1];
        }
    },

    getElement: function(element_id)
    {
        if (typeof this.elements[element_id] != undefined)
        {
            this.elements[element_id] = document.createElement(element_id);
            this.elements[element_id].id = element_id;
        }

        return this.elements[element_id];
    }
};
PianoMedia.boxAbstract = {

    showModal: true,

    open: function(url)
    {
        var originalUrl = null;

        if (typeof url != "undefined") {
            originalUrl = this.url;
            var self = this;
            this.url = function (cb) {
                self.getParams(url, function(finalUrl) {
                    cb(finalUrl);
                });
            }
        }

        if (typeof document.getElementById('pianoMediaBoxInfoCover') != 'undefined' && document.getElementById('pianoMediaBoxInfoCover') != null)
        {
            document.getElementById('pianoMediaBoxInfoCover').style.display = 'none';
        }
        if (typeof document.getElementById('pianoMediaBoxLogin') != 'undefined' && document.getElementById('pianoMediaBoxLogin') != null)
        {
            document.getElementById('pianoMediaBoxLogin').style.display = 'none';
        }

        this.preOpen();

        if (PianoMedia.isMobile() || PianoMedia.isMobileBarDisplayed())
        {
            this.mobile(url);
        } else {
            this.displayModal();
        }

        this.postOpen();

        if (originalUrl) {
            this.url = originalUrl;
        }
    },

    displayModal: function()
    {
        if (document.getElementById(this.element_id) == null) return;
        if (this.showModal == true)
        {
            PianoMedia.box.modal.open();
        }

        document.getElementById(this.element_id).style.display = 'block';
    },

    loadIframe: function()
    {
        var self = this;
        this.url(function (url) {
            document.getElementById(self.iframe_id).src = url;
        });
    },

    getParams: function(srcUrl, cb, query_string, options) {
        if (typeof query_string == 'undefined')
        {
            query_string = '';
        }

        if (typeof options == 'undefined') {
            options = {};
        }

        var finalOptions = {};

        PianoMediaQuery.extend(finalOptions, this.options, options);

        if (typeof finalOptions['promotion_tag'] !== 'undefined')
        {
            query_string += '&promotion_tag=' + finalOptions['promotion_tag']
        }
        if (typeof finalOptions['access'] !== 'undefined')
        {
            query_string += '&access=' + finalOptions['access']
        }
        if (typeof finalOptions['version'] !== 'undefined')
        {
            query_string += '&version=' + finalOptions['version']
        }

        _nsq.push(["getUID", function(UID) {
            var finalUrl = srcUrl + '?service_id=' + PianoMedia.getServiceId() + '&loc=' + PianoMedia.getLocation() + "&uid=" + UID + query_string;

            if (PianoMedia.gaq_linker && typeof _gaq !== 'undefined') {
                var loaded = false;
                _gaq = _gaq || [];
                _gaq.push(function() {
                    if (!loaded) {
                        loaded = true;
                        var pageTracker = _gat._getTrackerByName();
                        cb(pageTracker._getLinkerUrl(finalUrl));
                    }
                });
                setTimeout(function() {
                    if (!loaded) {
                        loaded = true;
                        cb(finalUrl);
                    }
                }, 500);
            } else {
                cb(finalUrl);
            }
        }, 500]);
    },

    getCustomUrl: function(options)
    {
        if (typeof options != 'undefined' && typeof options['custom_url'] != 'undefined' && options['custom_url'].trim().length > 0)
        {
            return '/custom/' + options['custom_url'];
        }
        else
        {
            return PianoMedia.custom_url;
        }
    },

    close: function()
    {
        if (typeof document.getElementById(this.element_id) !== 'undefined' && document.getElementById(this.element_id) !== null && document.getElementById(this.element_id).style.display !== 'none')
        {
            document.getElementById(this.element_id).style.display = 'none';
            PianoMedia.box.modal.close();
        }

        if (PianoMedia.isMobile() || PianoMedia.isMobileBarDisplayed())
        {
            document.getElementById('pnmdMobileBarContent').className = "pnmdMobileBarContentClosed";
            PianoMedia.box.modal.close();
        }
    },

    toggle: function(options, url)
    {
        if (typeof options == 'undefined') {
            options = {};
        }

        this.options = options;

        var display = document.getElementById(this.element_id).style.display;
        // FIXME: we need to check mobile element if mobile mode is active

        if ('block' == display)
        {
            this.close();
        }
        else
        {
            this.open(url);
        }
    },

    createOverlays: function()
    {
        if (document.getElementById('LoginLinkOverlay') === null) {
            LoginLinkOverlay = document.createElement('div');
            LoginLinkOverlay.setAttribute('id', 'LoginLinkOverlay');
            document.getElementById('pianoMediaBoxInfo').appendChild(LoginLinkOverlay);
            LoginLinkOverlay = document.getElementById('LoginLinkOverlay');
            PianoMediaQuery(LoginLinkOverlay).bindEvent("click", function(){PianoMedia.box.login.toggle()});
        }

        if (document.getElementById('PaymentLinkOverlay') === null) {
            PaymentLinkOverlay = document.createElement('div');
            PaymentLinkOverlay.setAttribute('id', 'PaymentLinkOverlay');
            document.getElementById('pianoMediaBoxInfo').appendChild(PaymentLinkOverlay);
            PaymentLinkOverlay = document.getElementById('PaymentLinkOverlay');
            PianoMediaQuery(PaymentLinkOverlay).bindEvent('click',function(){PianoMedia.clickPayment()});
        }
    },

    destroyOverlays: function()
    {
        if (document.getElementById('LoginLinkOverlay') !== null)
        {
            document.getElementById('pianoMediaBoxInfo').removeChild(document.getElementById('LoginLinkOverlay'));
        }

        if (document.getElementById('PaymentLinkOverlay') !== null)
        {
            document.getElementById('pianoMediaBoxInfo').removeChild(document.getElementById('PaymentLinkOverlay'));
        }
    },

    calculateBoxPosition: function(boxElementId)
    {
        var doc = document.documentElement, body = document.body;
        scroll_position  = (doc && doc.scrollTop  || body && body.scrollTop  || 0);
        document.getElementById(boxElementId).style.top = scroll_position + 'px';

        document.getElementById(boxElementId).style.top = '0px';
    }
};

PianoMedia.box = {

    login: {
        options: {},
        element_id: 'pianoMediaBoxLogin',
        iframe_id: 'pianoMediaBoxLoginIframe',

        url: function(cb)
        {
            var url = PianoMedia.protocol + PianoMedia.bar_url + '/authent/login/' + this.getCustomUrl(this.options) + '/';
            this.getParams(url, function(finalUrl) {
                cb(finalUrl);
            });
        },

        preOpen: function()
        {
            window.scrollTo(0, 0);
            this.loadIframe();
            this.destroyOverlays();
        },

        postOpen: function()
        {
            
            
        },

        mobile: function(url)
        {
            PianoMedia.mobile.openLogin(url);
        }
    },

    detail: {
        options: {},
        element_id: 'pianoMediaProfile',

        preOpen: function() {
            PianoMedia.box.info.close();
        },
        postOpen: function() { return true; },

        closeDetail: function() {
            if (typeof document.getElementById(this.element_id) !== 'undefined' && document.getElementById(this.element_id) !== null && document.getElementById(this.element_id).style.display == 'block')
            {
                PianoMedia.box.modal.close();
                document.getElementById(this.element_id).style.display = 'none';
            }
        },

        mobile: function(url) {
            PianoMedia.mobile.toggleDetail(url);
        }
    },

    info: {
        options: {},
        element_id: 'pianoMediaBoxInfoCover',
        iframe_id: 'pianoMediaBoxInfoIframe',

        url: function(cb)
        {
            var url = PianoMedia.protocol + PianoMedia.bar_url + '/info/index/' + this.getCustomUrl(this.options) + '/';
            url = PianoMedia.protocol + PianoMedia.bar_url + '/register/index/' + this.getCustomUrl(this.options) + '/';

            if (PianoMedia.getPaymentStatus()) {
                url = PianoMedia.protocol + PianoMedia.bar_url + '/payment/index/' + this.getCustomUrl(this.options) + '/';
            }

            this.getParams(url, function(finalUrl) {
                cb(finalUrl);
            });
        },

        preOpen: function()
        {
            this.calculateBoxPosition('pianoMediaBoxInfo');

            if (PianoMedia.getPaymentStatus())
            {
                this.destroyOverlays();
            }
            else
            {
               
            }

            this.loadIframe();
            PianoMedia.box.login.close();
            PianoMedia.box.detail.close();
        },

        postOpen: function()
        {
            return true;
        },

        mobile: function(url)
        {
            
            PianoMedia.mobile.openRegister(url);
            
        },

        disableClose: function() {
            PianoMedia.box.info.close = function()
            {
                window.location = PianoMedia.protocol + PianoMedia.bar_url + '/info/exit/?service_id=' + PianoMedia.getServiceId();
            }
        }
    },

    ddbox: {
        options: {},
        element_id: 'pianoMediaBoxInfoCover',
        iframe_id: 'pianoMediaBoxInfoIframe',
        action: '',
        query_string: '',
        mobile_ready: false,

        loadDdbox: function() {
            if (typeof this.options.action !== 'undefined')
            {
                this.action = this.options.action;
            }
            if (typeof this.options.access !== 'undefined')
            {
                this.query_string = "&access=" + this.options.access;
            }
            if (typeof this.options.mobile_ready !== 'undefined')
            {
                this.mobile_ready = this.options.mobile_ready;
            }
        },

        url: function(cb)
        {
            this.loadDdbox();
            var url = PianoMedia.protocol + PianoMedia.bar_url + '/ddbox/' + this.action;

            this.getParams(url, function(finalUrl) {
                cb(finalUrl);
            });
        },

        preOpen: function()
        {
            this.calculateBoxPosition('pianoMediaBoxInfo');

            this.loadIframe();
            PianoMedia.box.login.close();
            PianoMedia.box.detail.close();
        },

        postOpen: function()
        {
            return true;
        },

        mobile: function(url)
        {
            this.loadDdbox();
            if (this.mobile_ready)
            {
                this.action += 'mobile';
            }

            PianoMedia.mobile.openDdbox(url, this.action, this.query_string);
        }
    },

    package: {
        options: {},
        element_id: 'pianoMediaBoxInfoCover',
        iframe_id: 'pianoMediaBoxInfoIframe',
        query_string: '',

        url: function(cb)
        {
            var url = PianoMedia.protocol + PianoMedia.bar_url + '/payment/package/' + this.getCustomUrl(this.options) + '/';
            this.getParams(url, function(finalUrl) {
                cb(finalUrl);
            }, this.query_string);
        },

        loadPackage: function()
        {
            var geo_tag = '';
            // fallback for old implementation (package_promo: true/false)
            if (this.options.package_promo == true || this.options.package_promo == 'true')
            {
                this.options.package_promo = 100;
            }
            if (this.options.package_promo == false || this.options.package_promo == 'false')
            {
                this.options.package_promo = 0;
            }
            // fallback for old implementation (package_promo: true/false)

            var promoRegex = /^\d+$/;
            if (!promoRegex.test(this.options.package_promo))
            {
                this.options.package_promo = 0;
            }

            var codeRegex = /^[A-Z]{2}$/;
            if (codeRegex.test(this.options.geo_tag))
            {
                geo_tag = '&geo_tag=' + this.options.geo_tag;
            }

            this.options.package_prolong = this.options.package_prolong ? 1 : 0;
            this.options.package_gift = this.options.package_gift ? 1 : 0;
            this.query_string = "&package_id=" + this.options.package_id + "&package_promo=" + this.options.package_promo + "&package_prolong=" + this.options.package_prolong + "&package_gift=" + this.options.package_gift + geo_tag;
        },

        preOpen: function()
        {
            this.calculateBoxPosition('pianoMediaBoxInfo');

            this.loadPackage();
            this.loadIframe();

            PianoMedia.box.login.close();
        },

        postOpen: function()
        {
            return true;
        },

        mobile: function(url)
        {
            this.loadPackage();
            PianoMedia.mobile.openPackage(url, this.query_string, this.options);
        }
    },

    payment: {
        options: {},
        element_id : 'pianoMediaBoxInfoCover',
        iframe_id: 'pianoMediaBoxInfoIframe',
        preselectedPrice: '',

        url: function(cb, options)
        {
            var self = this;

            var action = 'index';
            if (PianoMedia.isMobile() || PianoMedia.isMobileBarDisplayed())
            {
                action = 'mobile';
            }

            var url = PianoMedia.protocol + PianoMedia.bar_url + '/payment/' + action +'/' + this.getCustomUrl(this.options) + '/';

            this.getParams(url, function(finalUrl) {
                cb(finalUrl + "&preselected_price=" + self.getPreselectedPrice());
            }, '', options);
        },
        
        preOpen: function()
        {
            this.calculateBoxPosition('pianoMediaBoxInfo');

            

            this.loadIframe();
            PianoMedia.box.login.close();
            PianoMedia.box.detail.close();
        },

        postOpen: function()
        {
            return true;
        },

        mobile: function(url)
        {
            var query_string = "&preselected_price=" + this.getPreselectedPrice();
            PianoMedia.mobile.openPayment(url, query_string, this.options);
        },

        setPreselectedPrice: function(preselectedPrice)
        {
            this.preselectedPrice = preselectedPrice;
        },

        getPreselectedPrice: function()
        {
            return this.preselectedPrice;
        }
    },

    register: {
        options: {},
        element_id : 'pianoMediaBoxInfoCover',
        iframe_id: 'pianoMediaBoxInfoIframe',

        url: function(cb)
        {
            var url = PianoMedia.protocol + PianoMedia.bar_url + '/register/index' + this.getCustomUrl(this.options) + '/';

            

            this.getParams(url, function(finalUrl) {
                cb(finalUrl);
            });
        },
        preOpen : function()
        {
            this.loadIframe();
            PianoMedia.box.login.close();
        },
        postOpen: function()
        {
            return true;
        },
        mobile: function(url)
        {
            PianoMedia.mobile.openRegister(url);
        }
    },

    mpNotice: {
        options: {},
        element_id : 'pianoMediaBoxNotice',

        preOpen: function()
        {
            

            

            this.showModal = false;
            

            var constantSuffix = (PianoMedia.custom_label.length > 0) ? ('.' + PianoMedia.custom_label) : '';

            if (PianoMedia.template.dataProvider.remainingArticlesCount == 1)
            {
                var text =  PianoMedia.t('bar.notice_box.text1' + constantSuffix);
            }
            else if (PianoMedia.template.dataProvider.remainingArticlesCount > 1 && PianoMedia.template.dataProvider.remainingArticlesCount < 5)
            {
                var text =  PianoMedia.t('bar.notice_box.text2-4' + constantSuffix);
            }
            else if (PianoMedia.template.dataProvider.remainingArticlesCount >= 5 || PianoMedia.template.dataProvider.remainingArticlesCount <= 0)
            {
                var text =  PianoMedia.t('bar.notice_box.text5' + constantSuffix);
            }

            // TODO: ensure that pnmdMobileBoxNotice is in all templates to remove this condition
            if (document.getElementById('pnmdMobileBoxNotice') !== null && (PianoMedia.isMobile() || PianoMedia.isMobileBarDisplayed()))
            {
                this.displayModal();
                this.element_id = 'pnmdMobileBoxNotice';
                document.getElementById('pnmdMobileBoxNoticeText').innerHTML = text.replace('XXX', PianoMedia.template.dataProvider.remainingArticlesCount);
            }

            document.getElementById('pianoMediaBoxNoticeText').innerHTML = text.replace('XXX', PianoMedia.template.dataProvider.remainingArticlesCount);
            document.getElementById('pnmdTemplate_meteredreminder').innerHTML = document.getElementById('pnmdTemplate_meteredreminder').innerHTML.replace('{REFERER}', document.URL);
        },

        postOpen: function()
        {
            return true;
        },

        mobile: function(url)
        {
            this.displayModal();
        }
    },

    metered: {
        options: {},
        element_id : 'pianoMediaBoxInfoCover',
        iframe_id: 'pianoMediaBoxInfoIframe',

        url: function(cb)
        {
            var self = this;

            _nsq.push(["getUID", function(UID) {
                cb(PianoMedia.protocol + PianoMedia.bar_url + '/info/metered' + this.getCustomUrl(this.options) + '/?service_id=' + PianoMedia.getServiceId() + '&loc=' + PianoMedia.getLocation() + "&uid=" + UID);
            }, 500]);
        },

        preOpen : function()
        {
            this.calculateBoxPosition('pianoMediaBoxInfo');

            this.loadIframe();
            PianoMedia.box.login.close();
        },
        mobile: function(url)
        {
            PianoMedia.mobile.openMetered(url);
        },

        postOpen: function()
        {
            return true;
        }
    },

    modal: {
        options: {},
        open: function()
        {
            document.getElementById('pianoMediaBoxModal').style.display = 'block';
        },

        close: function()
        {
            document.getElementById('pianoMediaBoxModal').style.display = 'none';
        },

        mobile: function(url)
        {

        }
    },

    activation: {
        options: {},
        element_id: 'pianoMediaBoxInfoCover',
        iframe_id: 'pianoMediaBoxInfoIframe',

        url: function(cb)
        {
            var url = PianoMedia.protocol + PianoMedia.bar_url + '/activation/index' + PianoMedia.custom_url + '/';

            this.getParams(url, function(finalUrl) {
                cb(finalUrl);
            });
        },

        preOpen: function()
        {
            this.calculateBoxPosition('pianoMediaBoxInfo');

            this.loadIframe();
            PianoMedia.box.login.close();
            PianoMedia.box.detail.close();
        },

        postOpen: function()
        {
            return true;
        },

        mobile: function(url)
        {
            PianoMedia.mobile.openActivation(url);
        }
    }
};

PianoMediaQuery.extend(PianoMedia.box.login, PianoMedia.boxAbstract);
PianoMediaQuery.extend(PianoMedia.box.info, PianoMedia.boxAbstract);
PianoMediaQuery.extend(PianoMedia.box.ddbox, PianoMedia.boxAbstract);
PianoMediaQuery.extend(PianoMedia.box.package, PianoMedia.boxAbstract);
PianoMediaQuery.extend(PianoMedia.box.mpNotice, PianoMedia.boxAbstract);
PianoMediaQuery.extend(PianoMedia.box.metered, PianoMedia.boxAbstract);
PianoMediaQuery.extend(PianoMedia.box.payment, PianoMedia.boxAbstract);
PianoMediaQuery.extend(PianoMedia.box.register, PianoMedia.boxAbstract);
PianoMediaQuery.extend(PianoMedia.box.detail, PianoMedia.boxAbstract);
PianoMediaQuery.extend(PianoMedia.box.activation, PianoMedia.boxAbstract);

PianoMedia.auth = {

    user: undefined,

    init: function()
    {
        try {
            if (typeof(pianoArticles) == 'undefined')
            {
                pianoArticles = '';
            }
        } catch (e) {
            pianoArticles = '';
        }

        try {
            if (typeof(pianoUserVerify) == 'undefined')
            {
                pianoUserVerify = '';
            }
        } catch (e) {
            pianoUserVerify = '';
        }

        try {
            if (typeof(pianoArticlesDefault) == 'undefined')
            {
                pianoArticlesDefault = pianoArticles;
            }
        } catch (e) {
            pianoArticlesDefault = pianoArticles;
        }

        PianoMedia.uid.run();

        var timeout = PianoMedia.isMobile() ? 20000 : 10000;

        

        _nsq.push(["getUID", function(UID, status, UUID, p_sid, p_aid) {
            PianoMedia.triggerCallback("onUIDDetected", [UID]);
            if (p_sid && p_sid != "_")
            {
                PianoMedia.service_id = p_sid;
            }
            if (p_aid && p_aid != "_")
            {
                PianoMedia.article_id = p_aid;
            }

            var url = PianoMedia.bar_url_no_lang;

            if (PianoMedia.mode == 'init_cookie')
            {
                url += '/auth/init_cookie.php?bv=' + PianoMedia.version;
                url += '&uid=' + UID;
                url += '&uuid=' + UUID;
                url += '&client_id=' + PianoMedia.getClientId();
            }
            else
            {
                var referer_param = "piano_referer_bar";
                var referer = PianoMedia.cookieHandler.getCookie(referer_param);
                if (referer)
                {
                    PianoMedia.cookieHandler.deleteSimpleCookie(referer_param);
                }
                else
                {
                    referer = PianoMedia.referer || document.referrer || "";
                }

                var method_verify = PianoMedia.method_verify | 0;
                
                var boxAutoPopup = PianoMedia.box_auto_popup == null ? "" : PianoMedia.box_auto_popup | 0;
                
                url += '/auth/index.php?bv=' + PianoMedia.version;
                url += '&uid=' + UID;
                url += '&uuid=' + UUID;
                url += '&art=' + pianoArticlesDefault;
                url += '&method_verify=' + method_verify;
                url += '&vrf=' + pianoUserVerify;
                url += '&piano_visit_key=' + PianoMedia.cookieHandler.getVisitKeyCookie();
                url += '&reload_customer=' + PianoMedia.getReloadCustomer();
                url += '&loc=' + PianoMedia.getLocation();
                url += '&client_id=' + PianoMedia.getClientId();
                url += '&service_id=' + PianoMedia.getServiceId();
                url += '&article_id=' + PianoMedia.getArticleId();
                url += '&ref=' + encodeURIComponent(referer);
                url += '&box_auto_popup=' + boxAutoPopup;
            }

            PianoMedia.loadJs(url);
        }, timeout]);
    },

    reloadArticle: function()
    {
        _nsq.push(["getUID", function(UID) {
            var url = PianoMedia.bar_url_no_lang + '/auth/get_article.php?bv=' + PianoMedia.version;
            url += '&uid=' + UID;
            url += '&art=' + pianoArticles;
            url += '&vrf=' + pianoUserVerify;
            url += '&piano_visit_key=' + PianoMedia.cookieHandler.getVisitKeyCookie();
            url += '&loc=' + PianoMedia.getLocation();
            url += '&service_id=' + PianoMedia.getServiceId();

            PianoMedia.loadJs(url);
        }, 10000]);
    },

    setUnloggedUser: function (pianovisitkey, proposed_expiration, has_access, box_data)
    {
        this.user = undefined;

        if (PianoMedia.mode != 'bar_hidden' && PianoMedia.mode != 'init_cookie')
        {
            PianoMedia.renderer.showUnLoggedUser();
        }

        var piano_unique_key = PianoMedia.cookieHandler.getCookie('piano_unique_key');

        PianoMedia.cookieHandler.deleteCookie('pianovisitkey');
        PianoMedia.cookieHandler.deleteCookie('piano_unique_key');

        var expiration = this.getCookieExpiration(proposed_expiration);

        if (typeof(pianovisitkey) !== 'undefined' && pianovisitkey != null)
        {
            PianoMedia.cookieHandler.setCookie('pianovisitkey', pianovisitkey, expiration);
        }

        this.checkFirstLoad(pianovisitkey);

        if (piano_unique_key !== null)
        {
            PianoMedia.refreshMedia();
        }

        PianoMedia.triggerCallback("onBarLoaded", [false, null, has_access, box_data]);
    },

    setLoggedUser: function(response, proposed_expiration, has_access, box_data)
    {
        var piano_unique_key = PianoMedia.cookieHandler.getCookie('piano_unique_key');
        this.user = response.user;

        if (PianoMedia.mode != 'bar_hidden' && PianoMedia.mode != 'init_cookie')
        {
            PianoMedia.renderer.showLoggedUser();
        }

        var expiration = this.getCookieExpiration(proposed_expiration);

        PianoMedia.cookieHandler.setCookie('pianovisitkey', response.user, expiration);
        PianoMedia.cookieHandler.setCookie('piano_unique_key', response.user_unique_id, expiration);

        this.checkFirstLoad(response.user);

        if (piano_unique_key != response.user_unique_id)
        {
            PianoMedia.refreshMedia();
        }

        var userData = {
            email: PianoMedia.template.dataProvider.email,
            remainingDays: PianoMedia.template.dataProvider.remainingDaysRaw
        };

        PianoMedia.triggerCallback("onBarLoaded", [true, userData, has_access, box_data]);
    },

    getCookieExpiration: function(expiration)
    {
        return (typeof expiration === 'undefined' || expiration === null || expiration < 0) ? 7300 : expiration;
    },

    checkFirstLoad: function(piano_visit_key)
    {
        if (PianoMedia.mode == 'init_cookie')
        {
            var referer_param = 'piano_referer';
            var referer_bar_param = 'piano_referer_bar';
            var referer_bar = PianoMedia.cookieHandler.getCookie(referer_bar_param);
            var referer = referer_bar || PianoMedia.referer;
            var pianovisitkey_param = 'pianovisitkey';
            var stored_key = PianoMedia.cookieHandler.getCookie(pianovisitkey_param);
            var cookie_stored = false;
            var is_post = PianoMedia.is_post;
            if (typeof stored_key != undefined && stored_key != '' && stored_key != null)
            {
                cookie_stored = true;
                if (is_post !== true)
                {
                    PianoMedia.cookieHandler.setSimpleCookie(referer_param, referer);
                    PianoMedia.cookieHandler.setSimpleCookie(referer_bar_param, referer);
                    window.location.reload();
                    return;
                }
            }
            if (!cookie_stored || is_post === true)
            {
                var f = document.createElement("form");
                var s = f.submit;
                f.setAttribute('method', "post");
                f.setAttribute('action', window.location);
                
                var insertArg = function (name, value) {
                    var i = document.createElement("input");
                    i.setAttribute('type', "hidden");
                    i.setAttribute('name', name);
                    i.setAttribute('value', value);
                    f.appendChild(i);
                };
                if (!cookie_stored) {
                    insertArg(pianovisitkey_param, piano_visit_key);
                    insertArg(referer_param, referer);
                }
                var post_args = PianoMedia.post_args;
                if (post_args) {
                    for (var i = 0; i < post_args.length; i++) {
                        var arg = post_args[i];
                        var name = arg[0];
                        var values = arg[1];
                        for (var j = 0; j < values.length; j++) {
                            insertArg(name, values[j]);
                        }
                    }
                }

                document.getElementsByTagName('body')[0].appendChild(f);

                try {
                    s.call(f);
                }
                catch (e) {
                    s();
                }
            }
        }
    },

    logOut: function() {
        var logOutUrl = PianoMedia.protocol + PianoMedia.bar_url + '/authent' + '/logout' + '/?&service_id=' + PianoMedia.getServiceId() + '&loc=' + PianoMedia.getLocation();
        window.location = logOutUrl;
    }
};
PianoMedia.timer = {

    totalTime: 0,
    initialized: false,
    active: false,
    started: false,
    pianoTimer: null,
    readerId: null,

    secondsTime: function()
    {
        if (this.active)
        {
            PianoMedia.timer.totalTime++;
            PianoMedia.timer.scheduledSend();
            //window.document.title = 'measuring: ' + PianoMedia.timer.totalTime;
        }
        else
        {
            //window.document.title = 'stop at: ' + PianoMedia.timer.totalTime;
        }

        this.pianoTimer = setTimeout('PianoMedia.timer.secondsTime()', 1000);
    },

    activate: function()
    {
        if ( this.active == false)
        {
            if (!this.started)
            {
                this.started = true;
                this.pianoTimer = setTimeout('PianoMedia.timer.secondsTime()', 1000);
            }

            this.active = true;
        }
    },


    start: function()
    {
        if (!this.started)
        {
            this.started = true;
            this.pianoTimer = setTimeout('PianoMedia.timer.secondsTime()', 1000);
            this.activate();
        }
    },

    stop: function()
    {
        this.active = false;
    },

    scheduledSend: function()
    {
        var logInterval = Math.round(0.4*(Math.sqrt(this.totalTime))) * 5;

        if (0 == this.totalTime % logInterval)
        {
            this.sendData();
        }
    },

    sendData: function() {
        if (this.totalTime == 0)
        {
            return;
        }

        var s = document.createElement('script');
        s.async = true;
        s.src = '//' + PianoMedia.harvester_url + '?&service_id=' + PianoMedia.getServiceId() + '&d=' + this.readerId.harvester + "&w=" + this.totalTime;
        document.body.appendChild(s);
        document.body.removeChild(s);
    },

    init: function(readerId)
    {
        this.readerId = readerId;

        if (this.initialized) {
            this.sendData();
            this.totalTime = 0;
        } else {
            this.initialized = true;
            var callback_start = function()
            {
                PianoMedia.timer.start();
            };

            var callback_activate = function()
            {
                PianoMedia.timer.activate();
            };

            var callback_stop = function()
            {
                PianoMedia.timer.stop();
            };

            var callback_send = function()
            {
                PianoMedia.timer.sendData();
            };

            PianoMediaQuery(window).bindEvent("click", callback_activate);
            PianoMediaQuery(window).bindEvent("scroll", callback_activate);
            PianoMediaQuery(window).bindEvent("unload", callback_send);
            PianoMediaQuery(document).bindEvent("unload", callback_send);

            var elements = [document, window, "embed", "object"];
            var activate_events = ["focus", "focusin", "DOMActivate", "DOMFocusIn", "activate"];
            var stop_events = ["blur", "focusout", "DOMDeActivate", "DOMFocusOut","deactivate"];

            for (x in elements)
            {
                PianoMediaQuery(elements[x]).bindEvent('mousemove', callback_start);

                for (y in activate_events)
                {
                    PianoMediaQuery(elements[x]).bindEvent(activate_events[y], callback_activate);
                }

                for (z in stop_events)
                {
                    PianoMediaQuery(elements[x]).bindEvent(stop_events[z], callback_stop);
                }
            }
        }
    }
}
var pianoUserBar = {'openPianoBoxInpage' : {}};

pianoUserBar.openPianoBoxInpage = function()
{
    PianoMedia.box.payment.open();
}
PianoMedia.mobile = {
    barMobile:       undefined,
    barContent:      undefined,
    btnCloseLogin:   undefined,
    btnLogin:        undefined,
    btnLogout:       undefined,
    btnMenu:         undefined,
    btnRegister:     undefined,
    btnClosePayment: undefined,

    devicePixelRatio: 1,
    scrollToY: 44,

    init: function()
    {
        if (this.pianoroot == null || typeof(this.pianoroot) == 'undefined')
        {
            this.pianoroot = document.getElementById('piano-root');
        }

        if (this.pianoroot.className.indexOf('piano-mobile') == -1)
        {
            this.pianoroot.className = 'piano-mobile';
        }

        if (typeof(window.devicePixelRatio) != 'undefined')
        {
            this.devicePixelRatio = window.devicePixelRatio;
        }

        if ("onorientationchange" in window)
        {
            window.addEventListener("orientationchange", function() {
                PianoMedia.mobile.init();
            }, false);
        }

        this.initElements();

        if (PianoMedia.mode != 'bar_semi_hidden' && document.documentElement.scrollTop === 0 && window.pageYOffset < this.scrollToY)
        {
            setTimeout("window.scrollTo(0, PianoMedia.mobile.scrollToY);", 100);
        }
    },

    initElements: function()
    {
        if (this.barMobile == undefined)
        {
            this.barMobile = document.getElementById('pnmdMobileBar');
        }

        if (this.barContent == undefined)
        {
            this.barContent = document.getElementById('pnmdMobileBarContent');
        }

        if (this.btnCloseLogin == undefined)
        {
            this.btnCloseLogin = document.getElementById('pnmdMobileBtnCloseLogin');
        }

        if (this.btnLogin == undefined)
        {
            this.btnLogin = document.getElementById('pnmdMobileBtnLogin');
        }

        if (this.btnLogout == undefined)
        {
            this.btnLogout = document.getElementById('pnmdMobileBtnLogout');
        }

        if (this.btnMenu == undefined)
        {
            this.btnMenu = document.getElementById('pnmdMobileBtnMenu');
        }

        if (this.btnRegister == undefined)
        {
            this.btnRegister = document.getElementById('pnmdMobileBtnRegister');
        }

        if (this.btnClosePayment == undefined)
        {
            this.btnClosePayment = document.getElementById('pnmdMobileBtnClosePayment')
        }
    },

    url: function(cb, path, query_string, options)
    {
        if (typeof query_string == 'undefined')
        {
            query_string = '';
        }

        var url = PianoMedia.protocol + PianoMedia.bar_url + path + PianoMedia.boxAbstract.getCustomUrl(options) + '/';

        PianoMedia.boxAbstract.getParams(url, function(finalUrl) {
            cb(finalUrl);
        }, query_string, options);
    },

    showLoggedUser: function()
    {
        if (!PianoMedia.isMobile())
        {
            this.initElements();
        }

        if (document.getElementById('pnmdLogoutLink') != null)
        {
            this.btnLogout.href = document.getElementById('pnmdLogoutLink').value;
        }
        else if (document.getElementById('pnmdIPCorp') != null)
        {
            this.btnLogout.innerHTML = document.getElementById('pnmdIPCorp').value;
        }

        this.btnCloseLogin.style.display = 'none';
        this.btnLogin.style.display      = 'none';
        this.btnLogout.style.display     = 'inline-block';
        this.btnMenu.style.display       = 'inline-block';
        this.btnRegister.style.display   = 'none';
    },

    showUnloggedUser: function()
    {
        this.initElements();

        this.btnLogin.style.display      = 'inline-block';
        this.btnRegister.style.display   = 'inline-block';
    },

    openLogin: function(url)
    {
        this.btnLogin.style.display = 'none';

        PianoMedia.mobile.close();
        this.barContent.className = 'pnmdMobileBarContentOpened';

        if (typeof(PianoMedia.auth.user) != 'undefined')
        {
            this.btnRegister.style.display = 'none';
        }
        else
        {
            this.btnRegister.style.display = 'inline-block';
            this.btnCloseLogin.style.display = 'inline-block';
            this.btnClosePayment.style.display = 'none';
        }

        var iframe = document.getElementById('pnmdMobileIframeLogin');
        iframe.style.display = 'block';

        if (typeof url != "undefined")
        {
            iframe.src = url;
        }
        else
        {
            this.url(function (url) {
                iframe.src = url;
            }, '/authent/mobilelogin');
        }
    },

    closeLogin: function()
    {

        if (typeof(PianoMedia.auth.user) != 'undefined')
        {
            this.btnLogin.style.display = 'none';
            this.btnRegister.style.display = 'none';
        }
        else
        {
            this.btnLogin.style.display = 'inline-block';
            this.btnRegister.style.display = 'inline-block';
            this.btnCloseLogin.style.display = 'none';
            this.btnClosePayment.style.display = 'none';
        }

        this.barContent.className = 'pnmdMobileBarContentClosed';

        var iframe = document.getElementById('pnmdMobileIframeLogin');
        iframe.style.display = 'none';
        iframe.src = '';
    },

    toggleLogin: function()
    {
        (document.getElementById('pnmdMobileIframeLogin').style.display == 'block') ? this.closeLogin() : this.openLogin();
    },

    openUrl: function(url, url_part, query_string, options)
    {
        if (typeof url != "undefined")
        {
            this.open(url);
        }
        else {
            var self = this;
            this.url(function (url) {
                self.open(url);
            }, url_part, query_string, options);
        }
    },

    open: function(url)
    {
        PianoMedia.mobile.closeLogin();

        if (typeof(PianoMedia.auth.user) != 'undefined')
        {
            this.btnLogin.style.display = 'none';
            this.btnMenu.style.display = 'inline-block';
        }
        else
        {
            this.btnRegister.style.display = 'none';
            this.btnClosePayment.style.display = 'inline-block';
            
        }

        this.barContent.className = 'pnmdMobileBarPaymentOpened';

        document.getElementById('pnmdMobileIframePayment').style.height = (this.getViewportHeight() - document.getElementById('pnmdMobileBar').offsetHeight) + 'px';
        document.getElementById('pnmdMobileCustomerInfo').style.display = 'none';
        document.getElementById('pnmdMobileIframePayment').style.display = 'block';

        var iframe = document.getElementById('pnmdMobileIframePayment');
        iframe.style.display = 'block';

        iframe.src = url;
    },

    getViewportHeight: function() {
        if (typeof window.innerWidth != 'undefined') {
            return window.innerHeight;
        } else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientHeight != 'undefined' && document.documentElement.clientHeight != 0) {
            return document.documentElement.clientHeight;
        } else {
            return document.getElementsByTagName('body')[0].clientHeight;
        }
    },

    openPayment: function(url, query_string, options)
    {
        this.openUrl(url, "/payment/mobile", query_string, options);
    },

    openInfo: function(url, query_string, options)
    {
        PianoMedia.box.modal.open();
        this.openUrl(url, "/info/mobile", query_string, options);
    },

    closePayment: function()
    {
        this.close();
    },

    closeInfo: function()
    {
        this.close();
    },

    openPackage: function(url, query_string, options)
    {
        this.openUrl(url, "/payment/packagemobile", query_string, options);
    },

    openDdbox: function(url, action, query_string)
    {
        this.openUrl(url, "/ddbox/" + action, query_string);
    },

    close: function()
    {
        this.btnRegister.style.display = 'inline-block';
        this.btnClosePayment.style.display = 'none';
        
        PianoMedia.box.modal.close();

        var iframe = document.getElementById('pnmdMobileIframePayment');
        iframe.style.display = 'none';
        iframe.src = '';

        document.getElementById('pnmdMobileBarContent').className = "pnmdMobileBarContentClosed";
    },

    openRegister: function(url)
    {
        this.openUrl(url, "/register/mobile");
    },

    openMetered: function(url)
    {
        this.openUrl(url, "/info/meteredmobile");
    },

    openActivation: function(url)
    {
        this.openUrl(url, "/activation/mobile");
    },

    toggleDetail: function(url)
    {
        if (typeof(this.barMobile) === 'undefined')
        {
            this.initElements();
        }

        document.getElementById('pnmdMobileIframePayment').style.display = 'none';

        if (this.barContent.className == 'pnmdMobileBarContentClosed')
        {
            document.getElementById('pnmdMobileCustomerInfo').style.display = 'block';
            this.barContent.className = 'pnmdMobileBarContentOpened';
            this.barMobile.className = 'pnmdMobileBarOpened';

            if (document.getElementById('pnmdMobileBoxNotice') !== null)
            {
                document.getElementById('pnmdMobileBoxNotice').style.display = 'none';
            }
        }
        else
        {
            this.closeLogin();
            this.barContent.className = 'pnmdMobileBarContentClosed';
            this.barMobile.className = '';
            document.getElementById('pnmdMobileCustomerInfo').style.display = 'none';
        }
    }
};

PianoMedia.uid = {
    init : function(cse) {
        window._nsq = [["cookiesStorage", cse], ["setAccount", "MQ==", "MQ=="]];
    },
    run : function() {
        (function() {
            var ns_functions = (function() {
                var protocol = "http" + ((document.location.protocol == "https:") ? "s" : "") + ":";
                var domain_url = PianoMedia.mp_url;
                var library_url = protocol + "//" + domain_url;
                var tracker_url = library_url;
                var user_agent = navigator.userAgent.toLowerCase();
                var is_linux = (user_agent.indexOf('linux') > -1);
                var is_opera = (user_agent.indexOf('opera') > -1);
                var is_chrome = (user_agent.indexOf('chrome') > -1);
                var is_safari = (!is_chrome && user_agent.indexOf('safari') > -1);
                var is_gecko = (!is_opera && !is_safari && !is_chrome && user_agent.indexOf('gecko') > -1);
                var is_konqueror = (is_gecko && user_agent.indexOf('konqueror') > -1);
                var is_ie = (!is_opera && user_agent.indexOf('msie') > -1);
                var cse = true;
                return {
                    protocol : protocol,
                    domain_url : domain_url,
                    tracker_url : tracker_url,
                    library_url : library_url,
                    is_linux : is_linux,
                    is_opera : is_opera,
                    is_safari : is_safari,
                    is_gecko : is_gecko,
                    is_chrome : is_chrome,
                    is_konqueror : is_konqueror,
                    is_ie : is_ie,
                    cse : cse,
                    browser_prefix : function() {
                        var prefix;
                        if (is_ie) {
                            prefix = "ie";
                        }
                        else if (is_konqueror) {
                            prefix = "kr";
                        }
                        else if (is_gecko) {
                            prefix = "ge";
                        }
                        else if (is_safari) {
                            prefix = "sa";
                        }
                        else if (is_opera) {
                            prefix = "op";
                        }
                        else if (is_chrome) {
                            prefix = "ch";
                        }
                        else {
                            prefix = ns_functions.MD5(user_agent);
                        }
                        return prefix;
                    },
                    get_body : function() {
                        return document.body || document.documentElement || document.getElementsByTagName("BODY")[0];
                    },
                    get_root : function() {
                        return document.getElementById("piano-root") || this.get_body();
                    },
                    add_to_root : function(element) {
                        var root = this.get_root();
                        if (root.firstChild) {
                            root.insertBefore(element, root.firstChild);
                        }
                        else {
                            root.appendChild(element);
                        }
                    },
                    session : function() {
                        var name = "ns_session";
                        return {
                            get : function(default_value) {
                                return ns_functions.cookies.get(name, default_value);
                            },
                            set : function(value) {
                                var expires = new Date();
                                expires.setTime(expires.getTime() + (1000 * 60 * 30));
                                expires = expires.toGMTString();
                                var path = "/";
                                ns_functions.cookies.set(name, value, expires, path);
                            }
                        };
                    }(),
                    iframe : function() {
                        
                        var load = function(params, callback) {
                            
                            var iframe_origin = ns_functions.library_url.split("/").slice(0, 3).join("/");
                            var iframe_path = ns_functions.library_url + "/js/bp.html";
                            
                            var window_hostname = ns_functions.protocol + "//" + window.location.hostname +
                                ((window.location.port != "") ? ":" + window.location.port : "");
                            
                            var timestamp_id = (new Date()).getTime();
                            
                            var iframe_params = params;
                            iframe_params.unshift(ns_functions.domain_url, timestamp_id, window_hostname);
                            
                            var iframe_params_packed = ns_functions.encode(ns_functions.packer.pack(iframe_params));
                            
                            var location = iframe_path + "#" + iframe_params_packed;
                            
                            //create iframe
                            var el_iframe = ns_functions.dom.create_element({
                                tag : "IFRAME",
                                style : {
                                    position: "absolute",
                                    left: "-10000px",
                                    top: "-10000px",
                                    zIndex : "-1000"
                                },
                                src : location
                            });
                            
                            if (window.parent.postMessage) {
                                var handle_message = function(e) {
                                    var message_id = timestamp_id;
                                    
                                    if (e.origin) {
                                        
                                        if (e.origin == iframe_origin) {
        
                                            var incoming_message = ns_functions.packer.unpack(e.data);
                                            
                                            if (incoming_message[0] == timestamp_id) {
                                                
                                                ns_functions.events.remove_event(window, "message", handle_message);
                                                
                                                setTimeout(function() {
                                                    ns_functions.get_root().removeChild(el_iframe);
                                                }, 5000);
                                                
                                                callback.apply(null, ns_functions.packer.unpack(incoming_message[1]));
                                            }
                                        }
                                    }
                                };
                                
                                ns_functions.events.add_event(window, "message", handle_message);
                            }
                            else {
                                var iframe_redir_and_check_name = function() {
                                    
                                    try {
                                        
                                        var ifr_content = el_iframe.contentWindow || el_iframe.contentDocument || el_iframe.document;
                                        
                                        var iframe_name = ifr_content.name;
                                        ns_functions.get_root().removeChild(el_iframe);
                                        
                                        var incoming_message = ns_functions.packer.unpack(iframe_name);
                                        
                                        if (incoming_message[0] == timestamp_id) {
                                            callback.apply(null, ns_functions.packer.unpack(incoming_message[1]));
                                        }
                                        
                                    }
                                    catch (e) {
                                        ifr_content.location = "about:blank";
                                        setTimeout(iframe_redir_and_check_name, 10);
                                    }
                                };
                                
                                var onload_counter = 0;
                                
                                var iframe_onload_handler = function() {
                                    onload_counter++;
                                    if (onload_counter == 2) {
                                        iframe_redir_and_check_name();
                                    }
                                };
                                
                                ns_functions.events.add_event(el_iframe, "load", iframe_onload_handler);
                            }
                            
                            ns_functions.add_to_root(el_iframe);
                        };
                        
                        return {
                            load : load,
                            load_g : function(key, defvalue, callback) {
                                load(["g", key, defvalue], callback);
                            },
                            load_s : function(key, value, cse, callback) {
                                load(["s", key, value, cse ? "1" : "0"], callback);
                            }
                        
                        }
                    }(),
                    hid : function() {
                        var hid = null;
                        var status = null;
                        var UUID = null;
                        var p_sid = null;
                        var p_aid = null;
                        var get_callbacks = [];
                        return {
                            set : function(h, s, u, ps, pa) {
                                hid = h;
                                status = s;
                                UUID = u;
                                p_sid = ps;
                                p_aid = pa;
                                ns_functions.storage.set("ns_hid", hid);
                                while (get_callbacks.length > 0) {
                                    get_callbacks.shift()(hid, status, UUID, p_sid, p_aid);
                                }
                            },
                            get : function(callback) {
                                if (hid == null) {
                                    get_callbacks.push(callback);
                                }
                                else {
                                    callback(hid, status, UUID, p_sid, p_aid);
                                }
                            }
                        };
                    }(),
                    swf : function() {
                        var object_id = "ns_swf";
                        var inserted = false;
                        var loaded = false;
                        var f_hash = null;
                        var f_count = null;
                        var c_hash = null;
                        var get_source = function(object_id, movie) {
                            return '<obj' + 'ect id="' + object_id + '" width="1" height="1" ' +
                                'data="' + movie + '"' +
                                'type="application/x-shockwave-flash">' +
                                '<par' + 'am name="movie" value="' + movie + '" />' +
                                '<par' + 'am name="allowScriptAccess" value="always" />' +
                                '<par' + 'am name="flashvars" value="" />' +
                                '</obj' + 'ect>';
                        };
                        return {
                            get_object_id : function() {
                                return object_id;
                            },
                            get_object : function() {
                                return (loaded) ? window[object_id] || document[object_id] || document.getElementById(object_id) : null;
                            },
                            insert_object : function() {
                                if (!inserted) {
                                    var parent_div = ns_functions.dom.create_element({
                                        tag : "DIV",
                                        id : object_id + "_p",
                                        style : {
                                            position: "absolute",
                                            left: "-10000px",
                                            top: "-10000px",
                                            zIndex : "-1000"
                                        }
                                    });
                                    var div = ns_functions.dom.create_element({
                                        tag : "DIV"
                                    });
                                    parent_div.appendChild(div);
                                    ns_functions.add_to_root(parent_div);
                                    
                                    div.innerHTML = get_source(object_id, library_url + "/bucket/novosense.swf");
                                    inserted = true;
                                }
                            },
                            is_inserted : function() {
                                return inserted;
                            },
                            set_loaded : function(fh, fc, ch) {
                                f_hash = fh;
                                f_count = fc;
                                c_hash = ch;
                                loaded = true;
                            },
                            get_fh : function() {
                                return f_hash;
                            },
                            get_fc : function() {
                                return f_count;
                            },
                            get_ch : function() {
                                return c_hash;
                            }
                        };
                    }(),
                    encode : function() {
                        var esc = null;
                        try {
                            esc = encodeURIComponent;
                        } catch(e) {
                            esc = escape;
                        }
                        return esc;
                    }(),
                    decode : function() {
                        var esc = null;
                        try {
                            esc = function(value) {
                                try {
                                    return decodeURIComponent(value);
                                }
                                catch (e) {
                                    try {
                                        return decodeURIComponent(unescape(value));
                                    }
                                    catch (e) {
                                        return unescape(value);
                                    }
                                }
                            };
                        } catch(e) {
                            esc = unescape;
                        }
                        return esc;
                    }(),
                    packer : function() {
                        var delimiter = "&";
                        var process = function(value, fn) {
                            var tmp = [];
                            for (var i = 0; i < value.length; i++) {
                                tmp.push(fn(value[i]));
                            }
                            return tmp;
                        };
                        return {
                            pack : function(value) {
                                return process(value, function(v) {
                                    return ns_functions.encode(v + "");
                                }).join(delimiter);
                            },
                            unpack : function(packed) {
                                return process(packed.split(delimiter), function(v) {
                                    return ns_functions.decode(v);
                                });
                            }
                        };
                    }(),
                    create_remote_script : function(src) {
                        var new_script=ns_functions.dom.create_element({tag:"script"});
                        new_script.type="text/javascript";
                        new_script.language="javascript";
                        new_script.src=src;
                        return new_script;
                    },
                    user : {}
                };
            })();
            
            ns_functions.dom = {
                create_element:function(element) {
                    var elm=document.createElement(element.tag.toUpperCase());
                    for(var i in element) {
                        if(i!="tag"&&typeof(element[i]!="function")) {
                            switch(typeof(element[i])) {
                            case"object":
                                for(var j in element[i])
                                    elm[i][j]=element[i][j]
                                break;
                            default:
                                elm[i]=element[i];
                            break;
                            }
                        }
                    }
                    return elm;
                }
            };
            
            
            ns_functions.MD5 = function(string) {
                
                function RotateLeft(lValue, iShiftBits) {
                    return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
                }
        
                function AddUnsigned(lX,lY) {
                    var lX4,lY4,lX8,lY8,lResult;
                    lX8 = (lX & 0x80000000);
                    lY8 = (lY & 0x80000000);
                    lX4 = (lX & 0x40000000);
                    lY4 = (lY & 0x40000000);
                    lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
                    if (lX4 & lY4) {
                        return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
                    }
                    if (lX4 | lY4) {
                        if (lResult & 0x40000000) {
                            return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                        } else {
                            return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                        }
                    } else {
                        return (lResult ^ lX8 ^ lY8);
                    }
                }
        
                function F(x,y,z) { return (x & y) | ((~x) & z); }
                function G(x,y,z) { return (x & z) | (y & (~z)); }
                function H(x,y,z) { return (x ^ y ^ z); }
                function I(x,y,z) { return (y ^ (x | (~z))); }
        
                function FF(a,b,c,d,x,s,ac) {
                    a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
                    return AddUnsigned(RotateLeft(a, s), b);
                };
        
                function GG(a,b,c,d,x,s,ac) {
                    a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
                    return AddUnsigned(RotateLeft(a, s), b);
                };
        
                function HH(a,b,c,d,x,s,ac) {
                    a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
                    return AddUnsigned(RotateLeft(a, s), b);
                };
        
                function II(a,b,c,d,x,s,ac) {
                    a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
                    return AddUnsigned(RotateLeft(a, s), b);
                };
        
                function ConvertToWordArray(string) {
                    var lWordCount;
                    var lMessageLength = string.length;
                    var lNumberOfWords_temp1=lMessageLength + 8;
                    var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
                    var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
                    var lWordArray=Array(lNumberOfWords-1);
                    var lBytePosition = 0;
                    var lByteCount = 0;
                    while ( lByteCount < lMessageLength ) {
                        lWordCount = (lByteCount-(lByteCount % 4))/4;
                        lBytePosition = (lByteCount % 4)*8;
                        lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
                        lByteCount++;
                    }
                    lWordCount = (lByteCount-(lByteCount % 4))/4;
                    lBytePosition = (lByteCount % 4)*8;
                    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
                    lWordArray[lNumberOfWords-2] = lMessageLength<<3;
                    lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
                    return lWordArray;
                };
        
                function WordToHex(lValue) {
                    var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
                    for (lCount = 0;lCount<=3;lCount++) {
                        lByte = (lValue>>>(lCount*8)) & 255;
                        WordToHexValue_temp = "0" + lByte.toString(16);
                        WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
                    }
                    return WordToHexValue;
                };
        
                function Utf8Encode(string) {
                    string = string.replace(/\r\n/g,"\n");
                    var utftext = "";
        
                    for (var n = 0; n < string.length; n++) {
        
                        var c = string.charCodeAt(n);
        
                        if (c < 128) {
                            utftext += String.fromCharCode(c);
                        }
                        else if((c > 127) && (c < 2048)) {
                            utftext += String.fromCharCode((c >> 6) | 192);
                            utftext += String.fromCharCode((c & 63) | 128);
                        }
                        else {
                            utftext += String.fromCharCode((c >> 12) | 224);
                            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                            utftext += String.fromCharCode((c & 63) | 128);
                        }
        
                    }
        
                    return utftext;
                };
        
                var x=Array();
                var k,AA,BB,CC,DD,a,b,c,d;
                var S11=7, S12=12, S13=17, S14=22;
                var S21=5, S22=9 , S23=14, S24=20;
                var S31=4, S32=11, S33=16, S34=23;
                var S41=6, S42=10, S43=15, S44=21;
        
                string = Utf8Encode(string);
        
                x = ConvertToWordArray(string);
        
                a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
        
                for (k=0;k<x.length;k+=16) {
                    AA=a; BB=b; CC=c; DD=d;
                    a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
                    d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
                    c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
                    b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
                    a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
                    d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
                    c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
                    b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
                    a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
                    d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
                    c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
                    b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
                    a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
                    d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
                    c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
                    b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
                    a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
                    d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
                    c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
                    b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
                    a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
                    d=GG(d,a,b,c,x[k+10],S22,0x2441453);
                    c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
                    b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
                    a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
                    d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
                    c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
                    b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
                    a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
                    d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
                    c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
                    b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
                    a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
                    d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
                    c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
                    b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
                    a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
                    d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
                    c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
                    b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
                    a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
                    d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
                    c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
                    b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
                    a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
                    d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
                    c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
                    b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
                    a=II(a,b,c,d,x[k+0], S41,0xF4292244);
                    d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
                    c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
                    b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
                    a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
                    d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
                    c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
                    b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
                    a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
                    d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
                    c=II(c,d,a,b,x[k+6], S43,0xA3014314);
                    b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
                    a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
                    d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
                    c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
                    b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
                    a=AddUnsigned(a,AA);
                    b=AddUnsigned(b,BB);
                    c=AddUnsigned(c,CC);
                    d=AddUnsigned(d,DD);
                }
        
                var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);
        
                return temp.toLowerCase();
            };
            
            ns_functions.storage = {
                get : function(name, defvalue) {
                    throw "Not implemented";
                },
                set : function(name, value) {
                    ns_functions.flash.set(name, value, false);
                    ns_functions.iframe.load_s(name, value, ns_functions.cse, function(message) {});
                }
            };
            
            ns_functions.cookies = {
                get:function(name,defvalue){
                    var result=null;
                    var cookies=document.cookie;
                    cookies=cookies.split(';');
                    for(var i=0;i<cookies.length;i++){
                        var cookie=cookies[i];
                        while(cookie.charAt(0)==" ")
                            cookie=cookie.substring(1,cookie.length);
                        var s=cookie.indexOf(name+"=");
                        if(s!=-1){
                            s+=name.length+1;
                            result=unescape(cookie.substring(s,cookie.length));
                        }
                    }
                    if(!result)
                        result=defvalue;
                    return result;
                },
                set:function(name,value,expires,path,domain,secure){
                    var cookie=name+"="+escape(value);
                    if(expires)
                        cookie+=";expires="+expires;
                    if(path)
                        cookie+=";path="+path;
                    if(domain)
                        cookie+=";domain="+domain;
                    if(secure)
                        cookie+=";secure="+secure;
                    document.cookie=cookie;
                },
                is_enabled:function(){
                    var now=new Date();
                    var value=now.getTime();
                    var name="ns_cookies_test";
                    this.set(name,value);
                    var enabled = (this.get(name,null)==value);
                    this.set(name,value,(new Date()).toGMTString());
                    return enabled;
                }
            };
            
            ns_functions.flash = {
                get_prefix:function(crossbrowser) {
                    return ns_functions.MD5(ns_functions.domain_url + "_"
                        + ((crossbrowser) ? "cross" : ns_functions.browser_prefix()));
                },
                get:function(key, defvalue, crossbrowser){
                    var flash_object = ns_functions.swf.get_object();
                    if (flash_object) {
                        var prefix = this.get_prefix(crossbrowser);
                        return flash_object.get(prefix + "_" + key, defvalue);
                    }
                    else {
                        return defvalue;
                    }
                },
                set:function(key, value, crossbrowser) {
                    var flash_object = ns_functions.swf.get_object();
                    if (flash_object) {
                        var prefix = this.get_prefix(crossbrowser);
                        flash_object.set(prefix + "_" + key, value);
                    }
                },
                get_fonts:function(defvalue){
                    var flash_object = ns_functions.swf.get_object();
                    if (flash_object) {
                        return flash_object.get_fonts();
                    }
                    else {
                        return defvalue;
                    }
                },
                get_capabilities:function(defvalue){
                    var flash_object = ns_functions.swf.get_object();
                    if (flash_object) {
                        return flash_object.get_capabilities();
                    }
                    else {
                        return defvalue;
                    }
                }
            };
            
            ns_functions.events = {
                add:function(){
                    if(window.addEventListener)
                        return function(o,e,fn,c) {
                            o.addEventListener(e,fn,(c));
                        }
                    else if(window.attachEvent)
                        return function(o,e,fn) {
                            o.attachEvent("on"+e,fn);
                        }
                    else
                        return function(o,e,fn){
                            var old_fn=o["on"+e];
                            if(old_fn ==null)
                                o["on"+e]=fn;
                            else
                                o["on"+e]=function(e) {
                                    old_fn(e);
                                    fn(e);
                                }
                        }
                }(),
                add_event:function(o,e,fn,c){
                    if(typeof(o) == "string")
                        var elm=document.getElementById(o);
                    else
                        var elm=o;
                    this.add(elm,e,fn,c);
                },
                remove : function() {
                    if (window.removeEventListener)
                        return function(o, e, fn, c) {
                            o.removeEventListener(e, fn, c);
                        }
                    else if (window.detachEvent)
                        return function(o, e, fn) {
                            o.detachEvent("on" + e, fn);
                        }
                    else
                        return function(o, e, fn) {
                            o['on' + e] = null;
                        }
                }(),
                remove_event : function(o, e, fn, c) {
                    if(typeof(o) == "string")
                        var elm=document.getElementById(o);
                    else
                        var elm=o;
                    this.remove(elm,e,fn,c);
                },
                stop_propagation:function(e) {
                    if(e.stopPropagation)
                        e.stopPropagation();
                    else
                        e.cancelBubble = true;
                },
                prevent_default:function(e) {
                    if(e.preventDefault)
                        e.preventDefault();
                    else
                        e.returnValue = false;
                },
                stop_event:function(e) {
                    this.stop_propagation(e);
                    this.prevent_default(e);
                },
                get_target:function(e) {
                    return e.target||e.srcElement;
                },
                get_current_target:function(e) {
                    return e.currentTarget;
                },
                get_page_coor:function(e){
                    var x = e.pageX;
                    var y = e.pageY;
                    if(!x && x !== 0)
                        x = e.clientX;
                    if(!y && y !== 0)
                        y = e.clientY;
                    if(ns_functions.is_ie) {
                        if(document.documentElement) {
                            x += document.documentElement.scrollLeft;
                            y += document.documentElement.scrollTop;
                        }
                        else if(document.body){
                            x += documentElement.scrollLeft;
                            y += documentElement.scrollTop;
                        }
                    }
                    return {
                        x:x,
                        y:y
                    }
                }
            };
        
        (function(){var BufferClass=typeof Buffer=="function"?Buffer:Array;var _buf=new BufferClass(16);var toString=[];var toStringLower=[];var toNumber={};for(var i=0;i<256;i++){toString[i]=(i+256).toString(16).substr(1);toStringLower[i]=toString[i].toLowerCase();toNumber[toString[i]]=i}var re=new RegExp(/^[a-f0-9]{8}-[a-f0-9]{4}-[4]{1}[a-f0-9]{3}-[89ab]{1}[a-f0-9]{3}-[a-f0-9]{12}$/i);var re_hex=new RegExp(/^[a-f0-9]{8}[a-f0-9]{4}[4]{1}[a-f0-9]{3}[89ab]{1}[a-f0-9]{3}[a-f0-9]{12}$/i);function parse(s){var buf=
            new BufferClass(16);var i=0,ton=toNumber;s.toLowerCase().replace(/[0-9a-f][0-9a-f]/g,function(octet){buf[i++]=toNumber[octet]});return buf}function unparse(buf){var tos=toString,b=buf;return tos[b[0]]+tos[b[1]]+tos[b[2]]+tos[b[3]]+"-"+tos[b[4]]+tos[b[5]]+"-"+tos[b[6]]+tos[b[7]]+"-"+tos[b[8]]+tos[b[9]]+"-"+tos[b[10]]+tos[b[11]]+tos[b[12]]+tos[b[13]]+tos[b[14]]+tos[b[15]]}function hex(buf){var tosl=toStringLower,b=buf;var result=[];for(var i=0;i<16;i++)result.push(tosl[b[i]]);return result.join("")}
            var b32=4294967296,ff=255;function uuid(fmt,buf,offset){var b=fmt!="binary"?_buf:buf?buf:new BufferClass(16);var i=buf&&offset||0;var r=Math.random()*b32;b[i++]=r&ff;b[i++]=r>>>8&ff;b[i++]=r>>>16&ff;b[i++]=r>>>24&ff;r=Math.random()*b32;b[i++]=r&ff;b[i++]=r>>>8&ff;b[i++]=r>>>16&15|64;b[i++]=r>>>24&ff;r=Math.random()*b32;b[i++]=r&63|128;b[i++]=r>>>8&ff;b[i++]=r>>>16&ff;b[i++]=r>>>24&ff;r=Math.random()*b32;b[i++]=r&ff;b[i++]=r>>>8&ff;b[i++]=r>>>16&ff;b[i++]=r>>>24&ff;return fmt===undefined?unparse(b):
            fmt=="hex"?hex(b):b}var validate=function(value){return value.match(re)?true:false};var validate_hex=function(value){return value.match(re_hex)?true:false};uuid.parse=parse;uuid.unparse=unparse;uuid.hex=hex;uuid.BufferClass=BufferClass;uuid.validate=validate;uuid.validate_hex=validate_hex;ns_functions.uuid=uuid})();
            
            ns_functions.events.add(window, "message", function(e) {
                if (e.data) {
                    if (e.data == "DT") {
                        track = false;
                    }
                }
            });
            
            ns_functions.callback_timeout = (function() {
                return {
                    patch : function(callback, expire_timeout, expire_args) {
                        var expire_timeout = expire_timeout || 15000;
                        var expire_args = expire_args || [];
                        var expire;
                        var expired = false;
                        expire = setTimeout(function() {
                            expired = true;
                            callback.apply(null, expire_args);
                        }, expire_timeout);
                        return function() {
                            if (!expired) {
                                clearTimeout(expire);
                                callback.apply(null, arguments);
                            }
                        };
                    }
                };
            })();
            
            var ns_detection = function() {
                
                var callbacks = [];
                var loaded = false;
                var running = false;
                var running_start = null;
                var brs = navigator.userAgent.toLowerCase();
                // Default
                var none = "_";
                var isAvailable = 1;
                var bi_flash = none;
                var bi_silver = none;
                var bi_wmp = none;
                var bi_nm = none;
                var bi_ob = none;
                var bi_du = none;
                var bi_rpl = none;
                var bi_aa = none;
                var bi_qt = none;
                var bi_javaPlugin = none;
                var bi_lang = none;
                var bi_mt = none;
                var bi_plugins = none;
                var bi_dnet = none;
                var bi_dajc = none;
                var bi_da = none;
                var bi_ds = none;
                
                var now = none;
                var bi_dmns = "";
                var bi_dmn = none;
                // Params
                var params = "";
                var params_obj = {};
                var iframe_obj = null;
                var iframe_loaded = null;
                
                ns_functions.iframe.load_g("ns_hid", none, function(hc, hl, hu, hi, hw, hp) {
                    iframe_loaded = (new Date()).getTime();
                    iframe_obj = {
                        c : hc,
                        l : hl,
                        u : hu,
                        i : hi,
                        w : hw,
                        p : hp
                    }
                });
                
                // DOM function - adds scripts elements to the page
                var ns_add_element = function(content) {
                    var element = document.createElement("script");
                    element.language = "vbscript";
                    element.type= "text/vbscript";
                    element.text = content;
                    document.getElementsByTagName("head")[0].appendChild(element);
                };
                var ns_is_plugin = function(mime_name, desc, ext) {
                    if(navigator.mimeTypes && mime_name != '' ? (navigator.mimeTypes[mime_name] && navigator.mimeTypes[mime_name].enabledPlugin != false) : true) {
                        if(navigator.plugins) {
                            var plugin_count = navigator.plugins.length;
                            if(mime_name != "" && navigator.mimeTypes[mime_name] == null)
                                return 0;
                            if(plugin_count > 0) {
                                for(var i = 0; i < plugin_count; i++) {
                                    if((navigator.plugins[i].description.indexOf(desc) != -1) || (navigator.plugins[i].name.indexOf(desc) != -1))
                                        return 1;
                                }
                            }
                        }
                    }
                    return 0;
                };
                var ns_plugin_description = function(desc, t) {
                    var plugin_name = "";
                    if(navigator.plugins) {
                        var plugin_count = navigator.plugins.length;
                        if(plugin_count > 0) {
                            for(var i = 0; i < plugin_count; i++) {
                                if((navigator.plugins[i].description.indexOf(desc) != -1) || (navigator.plugins[i].name.indexOf(desc) != -1)) {
                                    var regexp = '';
                                    if(t == 1){
                                        regexp = /([0-9][^\s]*)/;
                                    } else if (t == 2){
                                        regexp = /([0-9][^\s]*[_][0-9][^\s])/;
                                    } else {
                                        regexp = /([0-9].*)/;
                                    }
                                    var tmp = regexp.exec(navigator.plugins[i].description);
                                    if(tmp)
                                        plugin_name = tmp[0];
                                    else {
                                        tmp = regexp.exec(navigator.plugins[i].name);
                                        if(tmp)
                                            plugin_name = tmp[0];
                                    }
                                    if(plugin_name != '')
                                        break;
                                }
                            }
                        }
                    }
                    return ns_functions.encode(plugin_name);
                };
                var get_ie_component_version = function(clsID) {
                    var version = none;
                    if (document.body) {
                        try {
                            version = document.body.getComponentVersion("{" + clsID + "}", "ComponentID");
                        } catch (e) {}
                    }
                    return version;
                }
                var detect_dmn = function(){
                    return ( bi_dmns != "" && bi_dmns.indexOf( document.domain ) == -1 ) ? 0 : 1;
                }
                var detect_mt = function() {
                    var mimes = [];
                    if (navigator.mimeTypes && navigator.mimeTypes.length > 0) {
                        for (var i = 0; i < navigator.mimeTypes.length; i++) {
        
                            mimes.push(navigator.mimeTypes[i].type || "");
        
                        }
                    }
                    return mimes;
                };
        
                var detect_plugins = function() {
                    var plugins = [];
                    if (navigator.plugins && navigator.plugins.length > 0) {
                        for (var i = 0; i < navigator.plugins.length; i++) {
                            plugins.push(navigator.plugins[i].name || "");
                        }
                    }
                    return plugins;
                }
                
                var detect_dot_net = function() {
                    
                    var get_version = function(version_string) {
                        var numeric_string = version_string.substring(9);
                        return numeric_string;
                    }
                    
                    var user_agent_string = navigator.userAgent.match(/.NET CLR [0-9.]+/g);
                    if (user_agent_string != null) {
                        user_agent_string = user_agent_string.sort();
                        var result_array = [];
                        for (var i = 0; i < user_agent_string.length; i++) {
                            
                            result_array.push(get_version(user_agent_string[i]));
                            
                        }
                        return result_array.join("|");
                    }
                    return null;
                }
                
                var support_vml = function() {
                    var a = ns_functions.dom.create_element({
                        tag : "DIV",
                        style : {
                            display : "none"
                        }
                    });
                    ns_functions.add_to_root(a);
                    a.innerHTML = '<v:shape id="vml_flag1" adj="1" />';
                    var b = a.firstChild;
                    b.style.behavior = "url(#default#VML)";
                    var supported = b ? typeof b.adj == "object" : true;
                    a.parentNode.removeChild(a);
                    return supported;
                }
                
                var support_svg = function() {
                    return !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', "svg").createSVGRect;
                }
                
                var support_webgl = function() {
                    return window.WebGLRenderingContext ? 1 : 0;
                }
                
                var add_param = function(nm, vl){
                    params += ( "&" + nm + "=" + ns_functions.encode(vl));
                    params_obj[nm] = vl;
                }
        
                now = new Date();
                // MSIE DETECTION
                if (ns_functions.is_ie) {
                    //Adds behavior
                    if (document.body) {
                        try {
                            document.body.addBehavior("#default#clientCaps");
                        } catch (e) {}
                    }
                    //Flash
                    var flVB = "";
                    var fl = none;
                    for(var i=12; i > 0; i--){
                        try {
                            var flash = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + i);
                            fl = i;
                            break;
                        } catch(e) { }
                    }
                    if (fl == none) {
                        ns_add_element('on error resume next\n set fl = CreateObject("ShockwaveFlash.ShockwaveFlash")\n if IsObject(f) then flVB = hex(f.FlashVersion()) end if');
                        if (flVB.length > 0){
                            fl = flVB.substring(0,1);
                        }
                    }
                    bi_flash = fl;
                    //Windows Media Player
                    bi_wmp = get_ie_component_version("6BF52A52-394A-11d3-B153-00C04F79FAA6");
                    if(bi_wmp == none){
                        bi_wmp = get_ie_component_version("22D6F312-B0F6-11D0-94AB-0080C74C7E95");
                    }
                    //Net Meeting
                    bi_nm = get_ie_component_version("44BBA842-CC51-11CF-AAFA-00AA00B6015B");
                    //Offline Browsing
                    bi_ob = get_ie_component_version("3AF36230-A269-11D1-B5BF-0000F8051515");
                    //Desktop Update
                    bi_du = get_ie_component_version("89820200-ECBD-11CF-8B85-00AA005B4340");
                    
                    //DirectAnimation Java Classes
                    bi_dajc = get_ie_component_version("4F216970-C90C-11D1-B5C7-0000F8051515");
                    //DirectAnimation
                    bi_da = get_ie_component_version("283807B5-2C60-11D0-A31D-00AA00B92C03");
                    //DirectShow
                    bi_ds = get_ie_component_version("44BBA848-CC51-11CF-AAFA-00AA00B6015C");
                    
                    // Real Player
                    try {
                        var testObject = new ActiveXObject("rmocx.RealPlayer G2 Control.1");
                        bi_rpl = testObject.GetVersionInfo();
                    } catch(e) {}
                    try {
                        var testObject = new ActiveXObject("RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)");
                        bi_rpl = testObject.GetVersionInfo();
                    } catch(e) {}
                    try {
                        var testObject = new ActiveXObject("RealVideo.RealVideo(tm) ActiveX Control (32-bit)");
                        bi_rpl = testObject.GetVersionInfo();
                    } catch(e) {}
                    if(bi_rpl == none){
                        ns_add_element('on error resume next\n i_realplayer = IsObject(CreateObject("RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)"))\n set tmp = CreateObject("rmocx.RealPlayer G2 Control")\n if (IsObject(tmp)) then\n bi_rpl = tmp.GetVersionInfo\n end if');
                    }
                    // Adobe Acrobat
                    if (window.ActiveXObject){
                        for (var x=2; x<10; x++){
                            try{
                                var oAcro=eval("new ActiveXObject('PDF.PdfCtrl."+x+"');");
                                if (oAcro){
                                    bi_aa=x+'.0';
                                }
                                oAcro=null;
                            }catch(e) {}
                        }
                        try{
                            var oAcro4=new ActiveXObject('PDF.PdfCtrl.1');
                            if (oAcro4){
                                bi_aa='4.0';
                            }
                            oAcro4=null;
                        }catch(e) {}
                        try{
                            var oAcro7=new ActiveXObject('AcroPDF.PDF.1');
                            if (oAcro7){
                                bi_aa='7.0';
                            }
                            oAcro7=null;
                        }catch(e) {}
                    }
                    bi_lang = navigator.browserLanguage;
                    
                    bi_dnet = detect_dot_net() || none;
                    
                } else {
                    //OTHER BROWSERS DETECTION
                    //Flash
                    if(ns_is_plugin('','Shockwave Flash','')==1) {
                        bi_flash = ns_plugin_description('Shockwave Flash',1);
                    }
                    // Silverlight
                    if(ns_is_plugin('','Silverlight Plug-In','')==1) {
                        bi_silver = ns_plugin_description('Silverlight Plug-In',1);
                    }
                    // Real Player
                    if(ns_is_plugin('','RealPlayer Version Plugin','')==1) {
                        bi_rpl = ns_plugin_description('RealPlayer Version Plugin',1);
                    } else if(ns_is_plugin('','RealOne','')==1) {
                        bi_rpl = ns_plugin_description('RealOne',1);
                    }
                    // Adobe Acrobat
                    if(ns_is_plugin('','Adobe Acrobat','')==1) {
                        bi_aa = ns_plugin_description('Adobe Acrobat',1);
                    }
                    //Quick Time
                    if(ns_is_plugin('','QuickTime','')==1) {
                        bi_qt = ns_plugin_description('QuickTime',1);
                    }
                    // Java
                    if(ns_is_plugin('','Java','') == 1) {
                        bi_javaPlugin = ns_plugin_description('Java',2);
                    }
                    bi_lang = navigator.language;
                }

                bi_mt = ns_functions.MD5(detect_mt().join("|"));
                bi_plugins = ns_functions.MD5(detect_plugins().join("|"));
                bi_dmn = detect_dmn();
        
                if (bi_flash != none) {
                    ns_functions.swf.insert_object();
                }
        
                var run_all = function() {
                    add_param("sx", screen.width);
                    add_param("sy", screen.height);
                    add_param("cd", screen.colorDepth);
                    add_param("tmz", now.getTimezoneOffset());
                    add_param("flv", bi_flash);
                    add_param("sll", bi_silver);
                    add_param("wmp", bi_wmp);
                    add_param("nm", bi_nm);
                    add_param("obp", bi_ob);
                    add_param("wduNT", bi_du);
                    add_param("rp", bi_rpl);
                    add_param("aa", bi_aa);
                    add_param("qt", bi_qt);
                    add_param("jv", bi_javaPlugin);
                    add_param("bl", bi_lang);
                    add_param("pc", navigator.plugins.length);
                    add_param("dmn", bi_dmn);
                    add_param("adckie", ns_functions.cookies.is_enabled() ? 1 : 0);
                    add_param("cse", ns_functions.cse ? 1 : 0);

                    add_param("mt", bi_mt);
                    add_param("plg", bi_plugins);
                    add_param("geo", typeof(navigator.geolocation) == "undefined" ? 0 : 1);
                    add_param("vml", support_vml() ? 1 : 0);
                    add_param("svg", support_svg() ? 1 : 0);
                    add_param("dnet", bi_dnet);
                    add_param("dajc", bi_dajc);
                    add_param("da", bi_da);
                    add_param("ds", bi_ds);
                    add_param("webgl", support_webgl());
                    add_param("plm", navigator.platform || none);
                    add_param("cpu", navigator.cpuClass || none);
                    add_param("taie", typeof(navigator.taintEnabled) != "undefined" ? navigator.taintEnabled() ? 1 : 0 : none);
                    add_param("jave", typeof(navigator.javaEnabled) != "undefined" ? navigator.javaEnabled() ? 1 : 0 : none);
                    add_param("mtp", typeof(navigator.msMaxTouchPoints) != "undefined" ? navigator.msMaxTouchPoints : none);
                    add_param("mpe", typeof(navigator.msPointerEnabled) != "undefined" ? navigator.msPointerEnabled ? 1 : 0 : none);
        
                    add_param("ffh", ns_functions.swf.get_fh() || none);
                    add_param("ffc", ns_functions.swf.get_fc() || none);
                    add_param("fch", ns_functions.swf.get_ch() || none);
                    
                    add_param("sch", none);
                    
                    add_param("hid_f", ns_functions.flash.get("ns_hid", none, false));
                    add_param("hid_s", none);
        
                    add_param("hid_l", iframe_obj ? iframe_obj.l || none : none);
                    add_param("hid_u", iframe_obj ? iframe_obj.u || none : none);
                    add_param("hid_i", iframe_obj ? iframe_obj.i || none : none);
                    add_param("hid_w", iframe_obj ? iframe_obj.w || none : none);
                    add_param("hid_p", iframe_obj ? iframe_obj.p || none : none);
                    
                    add_param("hid_cs", iframe_obj ? iframe_obj.c : none);
                    
                    add_param("ssn", ns_functions.session.get("_"));
                    
                    add_param("ref", document.referrer);
                    add_param("url", ns_functions.decode(PianoMedia.getLocation()));
                    
                    loaded = true;
                    
                    while (callbacks.length > 0) {
                        callbacks.shift()(params, params_obj);
                    }
                };
                var run = function() {
                    var now = (new Date()).getTime();
                    if (
                        !(now > (running_start + 11000))
                        && (
                            (ns_functions.swf.is_inserted() && !(ns_functions.swf.get_object())
                                && !(now > ((!iframe_obj) ? (running_start + 10000) : (iframe_loaded + 500))))
                            || !iframe_obj
                        )
                    ) {
                        setTimeout(run, 50);
                    }
                    else {
                        run_all();
                    }
                };
                return {
                    is_loaded : function() {
                        return loaded;
                    },
                    run : function(callback) {
                        if (!loaded) {
                            callbacks.push(callback);
                            if (!running) {
                                running = true;
                                running_start = (new Date()).getTime();
                                run();
                            }
                        }
                        else {
                            callback(params, params_obj);
                        }
                    },
                    get_params : function() {
                        return params;
                    },
                    detect_mt : detect_mt,
                    detect_plugins : detect_plugins
                }
            }();
            
            var insert_tracker = function(path_params, params, image, without_detection) {
                var params = params || [];
                var image = image || false;
                var without_detection = without_detection || false;
                for (var i = 0; i < path_params.length; i++) {
                    path_params[i] = ns_functions.encode(path_params[i]);
                }
                path_params = path_params.join("/");
                var params_tmp = ["a=1", "dc=" + ns_functions.uuid("hex")];
                for (var i = 0; i < params.length; i++) {
                    params_tmp.push(ns_functions.encode(params[i][0]) + "=" +
                            ns_functions.encode(params[i][1]));
                }
                params = params_tmp.join("&");
                var src = ns_functions.tracker_url + "/" + path_params + "/?" + params;
                var insert = function() {
                    if (image) {
                        var img = new Image();
                        img.src = src;
                        setTimeout(function() {
                            img = null;
                        }, 5000);
                    }
                    else {
                        var script = ns_functions.create_remote_script(src);
                        ns_functions.add_to_root(script);
                    }
                };
                ns_detection.run(function(detection_params) {
                    if (!without_detection) {
                        src = src + detection_params;
                    }
                    insert();
                });
            };
            
            var has_account = false;
            var CID = null;
            var WID = null;
            
            var cbtp = ns_functions.callback_timeout.patch;
            
            var commands = {
                cookiesStorage : function(cse) {
                    ns_functions.cse = cse;
                },
                setAccount : function(cid, wid) {
                    if (!has_account) {
                        CID = cid;
                        WID = wid;
                        has_account = true;
                        insert_tracker(["uid", CID, WID], [["p_cid", PianoMedia.getClientId()],
                            ["p_sid", PianoMedia.getServiceId()]]);
                    }
                },
                getUID : function(callback, timeout) {
                    if (has_account) {
                        ns_functions.hid.get(cbtp(callback, timeout, ["_", -1, "_"]));
                    }
                },
                _swfSetLoaded : function(fh, fc, ch) {
                    ns_functions.swf.set_loaded(fh, fc, ch);
                },
                _setHid : function(hid, status, UUID, p_sid, p_aid) {
                    ns_functions.hid.set(hid, status, UUID, p_sid, p_aid);
                },
                _setSession : function(session) {
                    ns_functions.session.set(session);
                },
                _trackCtp : function(params) {
                    insert_tracker(["ctp", CID, WID], params, true, true);
                }
            };
            
            var run_command = function(command_params) {
                if (command_params instanceof Array) {
                    if (command_params.length > 0) {
                        var command = command_params[0];
                        var params = command_params.slice(1);
                        if (typeof(commands[command]) == "function") {
                            commands[command].apply(null, params);
                        }
                    }
                }
            };
            
            while (_nsq.length > 0) {
                run_command(_nsq.shift());
            }
            
            _nsq = {
                push : function(command_params) {
                    run_command(command_params);
                }
            };
            
        })();
    },
    getUID : function(callback, timeout)
    {
        _nsq.push(["getUID", function(UID) {
            callback((UID === "_") ? null : UID);
        }, timeout]);
    }
};
PianoMedia.init(pianoVariables);