/*
 * Slipmat
 *
 * Authors
 *	Chris "inajar" Vickery <chrisinajar@gmail.com> 2012
 *
 * Thanks to (in no particular order): K1, overra, BOFH, cannjeff, getify
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation 
 * files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, 
 * modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software 
 * is furnished to do so, subject to the following conditions:
 * 
 * The above list of authors, and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 */
(function() {

// slipmat :+1:

// Code borrowed and altered from LABjs, http://labjs.com/
// Specifically: https://gist.github.com/603980
var loadScript = (function(options) {
	var script, callback;
	if (!options)
		throw new Error("Missing options parameter");
	if (!options.src)
		throw new Error("Missing src in options");
	script = options.src;
	if (options.callback)
		callback = options.callback;

	var global = window;
	var oDOC = document;
    var head = oDOC.head || oDOC.getElementsByTagName("head");

	// Everything after this is stolen from LABjs, I never checked their license but lets just pretend it's definitely something friendly like GPL
    // loading code borrowed directly from LABjs itself
	setTimeout(function () {
		if ("item" in head) { // check if ref is still a live node list
			if (!head[0]) { // append_to node not yet ready
				setTimeout(arguments.callee, 25);
				return;
			}
			head = head[0]; // reassign from live node list ref to pure node ref -- avoids nasty IE bug where changes to DOM invalidate live node lists
		}
		var scriptElem = oDOC.createElement("script"),
			scriptdone = false;
		scriptElem.onload = scriptElem.onreadystatechange = function () {
			if ((scriptElem.readyState && scriptElem.readyState !== "complete" && scriptElem.readyState !== "loaded") || scriptdone) {
				return false;
			}
			scriptElem.onload = scriptElem.onreadystatechange = null;
			scriptdone = true;
			
			if (callback)
				callback();
		};
		// timestamp + random number to stop browser cache
		if (options.cache !== false)
			scriptElem.src = script + '?_=' + ((new Date()).getTime() + Math.random());

		head.insertBefore(scriptElem, head.firstChild);
	}, 0);

	// required: shim for FF <= 3.5 not having document.readyState
	if (oDOC.readyState == null && oDOC.addEventListener) {
		oDOC.readyState = "loading";
		oDOC.addEventListener("DOMContentLoaded", handler = function () {
			oDOC.removeEventListener("DOMContentLoaded", handler, false);
			oDOC.readyState = "complete";
		}, false);
	}
});
// end borrowed code


var baseUrl = "https://raw.github.com/chrisinajar/slipmat/master/";

if (localStorage.slipmat_devurl)
	baseUrl = localStorage.slipmat_devurl;

var slipmat = (function() {
	var slipmat = {};

	slipmat.unload = function() {
		delete window.slipmat;
	};
	slipmat.reload = function() {
		slipmat.unload();
		loadScript({
			src: baseUrl+"/slipmat.js"
		});
	};
	slipmat.loadScript = loadScript;

	var count = 2; // manual count of how many scripts we're about to load...
	var handler = function() {
		if (--count == 0)
			loadScript({
				src: baseUrl+"/lib.js"
			});
	};
	
	loadScript({
		src: 'https://raw.github.com/chrisinajar/flow-js/master/flow.js',
		callback: handler
	});
	loadScript({
		src: baseUrl+"/modulelist.js",
		callback: handler
	});
	return slipmat;
})();

window.slipmat = slipmat;

})();

