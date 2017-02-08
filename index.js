(function() {
    // base CSS file
    require("./src/interactive.less");

    function onDocumentReady(fn) {
        // Check to see if the body is ready. If not, try again in 100ms.
        var stateCheck = setInterval( function() {
            if ( 'complete' === document.readyState ) {
                clearInterval( stateCheck );
                fn();
            }
        }, 100 );        
    }    

    // this code will execute callback() when the DOM is ready, using the above function. skipCheckForReady ignores this
    module.exports = function(id, callback, skipCheckForReady) {
        if (!id || (typeof id !== "string")) {
            console.log("Whoops -- you need to give time-interactive a string id of the element on the page in which to self-assemble or the element itself.");
            return;
        }

        // not using jQuery selectors
        if (id[0] == "#") {
            id = id.slice(1);
        }

        if (typeof callback !== 'function') {
            console.log("Warning! You did not provide a callback function as the second parameter to time-interactive.");
        }

        //once you know that everything is loaded
        var checkForReady = function() {
            if (skipCheckForReady) {
                fire_interactive();
            } else {
                onDocumentReady(fire_interactive);
            }
        };

        function fire_interactive() {          
            callback(bootstrap_interactive(id));
        }

        checkForReady();
    }


    // this assumes there is already a <div> on the page with the correct id, which Wordpress should have created (see README)
    function bootstrap_interactive(id, opts) {
        var el = document.getElementById(id);

        if (!el) {
            console.log("Whoops -- the time-interactive function couldn't find a <div> with the id you provided. You probably mistyped it in debug.js.");
            return;
        }

        // ought to already have this, but let's be sure
        if (!/\btime-interactive\b/.test(el.className)) {
            // console.log("Warning: The <div> with the id", id, "didn't have the time-interactive class, which is weird.");
            el.className += " time-interactive";
        }

        if (/\btime-interactive--rendered\b/.test(el.className)) {
            console.log("Interactive", id, "already rendered -- skipping");
            return;
        } else {
            el.className += " time-interactive--rendered";
            console.log("Loading interactive", id);
        }

        // remove screenshot
        var screenshot = el.getElementsByTagName("img");
        if (screenshot && screenshot[0]) {
            el.removeChild(screenshot[0]);
        }

        // get params
        var params = {};
        for (var c = 0; c < el.attributes.length; c += 1) {
            var attr = el.attributes[c];
            if (/^data-/.test(attr.nodeName)) {
                var key = attr.nodeName.split("data-")[1];
                params[key] = attr.nodeValue;
            }
        }

        // return the DOM object
        return {
            version: "0.3.2",
            id: id,
            el: el,
            width: function() { return el.offsetWidth; },
            height: function() { return el.offsetHeight; },
            page_width: document.body.offsetWidth,
            page_height: document.body.offsetHeight,
            params: params,
            is_touch_device: is_touch_device(),
            onresize: function(f, delay) {
                if (!document.addEventListener) {
                    console.log("onresize not supported in this browser");
                    return;
                }
                delay = typeof delay != "number" ? 250 : delay;
                var resizeTimer;

                // shouldn't overwrite anything important
                // http://stackoverflow.com/questions/22204902/does-window-addeventlistenermessage-overwrite-other-listeners
                window.addEventListener("resize", function() {
                    clearTimeout(resizeTimer);
                    resizeTimer = setTimeout(function() {
                        f(el.offsetWidth, el.offsetHeight);
                    }, delay);                    
                });
            }
        };

    }

    // http://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript
    function is_touch_device() {
        return 'ontouchstart' in window // works on most browsers 
            || navigator.maxTouchPoints; // works on IE10/11 and Surface
    };

    /* CONVENIENCE FUNCTIONS */

    // add commas to numbers over 1000
    module.exports.commafy = function(val) {
        if (typeof val !== "number") {
            return;
        }
        val = parseInt(val, 10);

        while (/(\d+)(\d{3})/.test(val.toString())) {
            val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
        }
        return val;
    }

    // generate a unique GUID
    module.exports.guid = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}());
