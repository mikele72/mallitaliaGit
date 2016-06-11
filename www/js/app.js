var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    onDeviceReady: function() {
		app.receivedEvent('deviceready');
		tht.onDeviceReady();
        // hide splash screen
		var cs;
		clearTimeout(cs);
		cs = setTimeout(function() {
			navigator.splashscreen.hide();
        }, 3000);
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        //console.log('Received Event: ' + id);
    },
};
(function($, window, document) {
    'use strict';

    $.map(['localStorage', 'sessionStorage'], function( method ) {
        var defaults = {
            cookiePrefix : 'fallback:' + method + ':',
            cookieOptions : {
                path : '/',
                domain : document.domain,
                expires : ('localStorage' === method) ? { expires: 365 } : undefined
            }
        };

        try {
            $.support[method] = method in window && window[method] !== null;
        } catch (e) {
            $.support[method] = false;
        }

        $[method] = function(key, value) {
            var options = $.extend({}, defaults, $[method].options);

            this.getItem = function( key ) {
                var returns = function(key){
                    return JSON.parse($.support[method] ? window[method].getItem(key) : $.cookie(options.cookiePrefix + key));
                };
                if(typeof key === 'string') return returns(key);

                var arr = [],
                    i = key.length;
                while(i--) arr[i] = returns(key[i]);
                return arr;
            };

            this.setItem = function( key, value ) {
                value = JSON.stringify(value);
                return $.support[method] ? window[method].setItem(key, value) : $.cookie(options.cookiePrefix + key, value, options.cookieOptions);
            };

            this.removeItem = function( key ) {
                return $.support[method] ? window[method].removeItem(key) : $.cookie(options.cookiePrefix + key, null, $.extend(options.cookieOptions, {
                    expires: -1
                }));
            };

            this.clear = function() {
                if($.support[method]) {
                    return window[method].clear();
                } else {
                    var reg = new RegExp('^' + options.cookiePrefix, ''),
                        opts = $.extend(options.cookieOptions, {
                            expires: -1
                        });

                    if(document.cookie && document.cookie !== ''){
                        $.map(document.cookie.split(';'), function( cookie ){
                            if(reg.test(cookie = $.trim(cookie))) {
                                 $.cookie( cookie.substr(0,cookie.indexOf('=')), null, opts);
                            }
                        });
                    }
                }
            };

            if (typeof key !== "undefined") {
                return typeof value !== "undefined" ? ( value === null ? this.removeItem(key) : this.setItem(key, value) ) : this.getItem(key);
            }

            return this;
        };

        $[method].options = defaults;
    });
}(jQuery, window, document));