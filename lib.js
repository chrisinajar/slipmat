/*
 * Slipmat functions
 */

(function(slipmat) {

// module list registry functions
var registerNull = function() {
	throw new Error('Cannot call registerPlugin manually');
}
var fnull = function(){};
var loadScript = slipmat.loadScript;

$.extend(slipmat, {
	registerPlugin: registerNull,

	loadPluginMetadata: function(name, callback) {
		if (!slipmat.modules[name])
			throw new Error(name + ' not found in the module list');

		if (!callback)
			callback = fnull;

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
	},

	load: function(name, callback) {
		if (!callback)
			callback = fnull;

		flow.exec(
			function() {
				slipmat.loadPluginMetadata(name, this);
			}, function() {
				if (slipmat.modules[name].deferred) {
					slipmat.done = function() {
						callback();
						slipmat.done = fnull;
					};
					callback = fnull;
				}
				slipmat.loadScript({
					src: slipmat.modules[name].file,
					callback: callback
				});
			}
		);
	}
});

// iterate through autoload list
var autoLoad = [];
if (localStorage.slipmat_modules) {
	autoLoad = JSON.parse(localStorage.slipmat_modules);
	if ((!autoLoad instanceof Array))
		throw new Error('Autoload list is not an array D:');
}

for (i in autoLoad) {
	slipmat.load(autoLoad[i]);
}

})(window.slipmat);

