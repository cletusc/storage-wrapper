/**
 * This is used to shim any required browser APIs so that tests can run locally without need for a browser.
 */

var Storage = require('dom-storage');

// Shim localStorage.
if (typeof localStorage === 'undefined') {
	global.localStorage = new Storage('../build/localStorage.json');
}

// Shim sessionStorage.
if (typeof sessionStorage === 'undefined') {
	global.sessionStorage = new Storage(null, { strict: true });
}
