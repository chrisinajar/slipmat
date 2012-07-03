/*
 * Slipmat functions
 */

(function(slipmat) {

// module list registry functions
var registerNull = function() {
	throw new Error('Cannot call registerPlugin manually');
}
slipmat.registerPlugin = registerNull;
slipmat.loadPluginMetadata = function(name, callback) {
	if (!slipmat.modules[name])
		throw new Error(name + ' not found in the module list');

	if (!callback)
		callback = function(){};

	if (slipmat.modules[name].loaded)
		return;

	slipmat.registerPlugin = function(options) {
		slipmat.modules[name] = options;
		slipmat.modules[name].loaded = true;

		slipmat.registerPlugin = registerNull;

		callback();
	};

	var module = slipmat.modules[name];
	switch (module.type) {
		case 'github':
			$.getScript('https://raw.github.com/' + module.src + '/master/slipmat.js');
	}
}

// iterate through autoload list
var autoLoad = [];
if (localStorage.slipmat_modules) {
	autoLoad = JSON.parse(localStorage.slipmat_modules);
	if ((!autoLoad instanceof Array))
		throw new Error('Autoload list is not an array D:');
}
})(window.slipmat);

