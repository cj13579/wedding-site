/**
Copyright 2012 Sliverware Applications, Inc

This file is part of the WordPress Gift Registry Plugin.

WordPress Gift Registry Plugin is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

WordPress Gift Registry Plugin is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with WordPress Gift Registry Plugin.  If not, see <http://www.gnu.org/licenses/>.
*/

var GR = GR || {};

jQuery(document).ready(function ($) {

    // courtesy http://sveinbjorn.org/cookiecheck
    GR.cookiesEnabled = (function() {
        var cookieEnabled = (navigator.cookieEnabled) ? true : false;

        if (typeof navigator.cookieEnabled == "undefined" && !cookieEnabled) {
            document.cookie="testcookie";
            cookieEnabled = (document.cookie.indexOf("testcookie") != -1) ? true : false;
        }

        if ( !cookieEnabled ) {
            $('#gr_warn_settings').html(GR.Messages.no_cookies);
        }

        return cookieEnabled;
    })();

    GR.Alert = (function() {
        var alertDiv = $("<div id='gr_alert'></div>"),
            options = { },
            cartTimeout;

        $('body').append(alertDiv);

        /*
        opts: {
            error // set to true if alert should be displayed as error
        }
         */
        function Alert(msg, opts) {
            // merges opts with options but preserves state of each
            var o = $.extend({}, options, opts);
            
            if ( cartTimeout ) {
                clearTimeout( cartTimeout );
            }

            alertDiv.html(msg).slideDown('fast');

            if ( typeof o.error != 'undefined' && o.error ) {
                alertDiv.addClass('error');
            } else {
                alertDiv.removeClass('error');
                cartTimeout = window.setTimeout(function() {
                    alertDiv.slideUp('slow');
                }, 5000);
            }
        }

        return Alert;
    })();

    GR.FormMap = (function() {
        function assignValue(inputName, val) {
            var field = $('#' + inputName);
            if ( field[0] ) {
                if ( /text|hidden/.test(field.attr('type')) || field[0].tagName == 'SELECT' ) {
                    field.val(val);
                } else if (field.attr('type') == 'checkbox') {
                    field.prop('checked', val);
                } else if ( field[0].tagName == 'TEXTAREA' ) {
                    field[0].innerHTML = val;
                }
            }
        }

        function map(obj, pfx, excludes) {
            excludes = excludes || [ ];

            for (key in obj) {
                if (( typeof obj[key] == 'string' || typeof obj[key] == 'boolean' ) && $.inArray(key, excludes) < 0 ) {
                    assignValue(key, obj[key]);
                } else if (typeof obj[key]=='object') {
                    // if json returns "prop": null, apparently it's an object
                    if (obj[key] == null) {
                        assignValue(key, '');
                    }

                    // realistically not prepared to map sub-object properties to forms...
    //                var n1 = key;
    //                map(obj[n1], n1);
                }
            }
        }

        return { map: map };
    })();

    GR.ConstrainedSize = function(width, height, MAX_WIDTH, MAX_HEIGHT) {
        var ratio = 0;  // Used for aspect ratio

        // Check if the current width is larger than the max
        if (width > MAX_WIDTH) {
            ratio = MAX_WIDTH / width;   // get ratio for scaling image
            height = height * ratio;    // Reset height to match scaled image
            width = MAX_WIDTH;    // Reset width to match scaled image
        }

        // Check if current height is larger than max
        if (height > MAX_HEIGHT) {
            ratio = MAX_HEIGHT / height; // get ratio for scaling image
            height = MAX_HEIGHT;    // Reset height to match scaled image
            width = width * ratio;    // Reset width to match scaled image
        }

        return { 'height': height, 'width': width };
    }

    GR.parseJSON = function( json ) {
        var obj;

        try {
            obj = $.parseJSON( json );
            return obj;
        } catch (ex) {
            return {
                error: true,
                message: "Oops! An invalid response was received from the server. Please check the log or contact <a href='http://sliverwareapps.com/contact'>Sliverware Support</a>"
            }
        }
    }
});

