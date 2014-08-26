require('../shims');

var StorageWrapper = require('../../');
var test = require('tape');

test('listing keys and removing values', function (t) {
	// Setup.
	var store = new StorageWrapper();

	// Test.
	t.plan(4);

	// Set them.
	store.set('key1', 1);
	store.set('key2', 1);
	store.set('key3', 1);

	t.deepEqual(
		store.listKeys(),
		[
			'key1',
			'key2',
			'key3'
		],
		'listing all keys'
	);

	store.remove('key1');
	t.equal(store.get('key1'), null, 'removing a single value');
	t.deepEqual(
		store.listKeys(),
		[
			'key2',
			'key3'
		],
		'listing all but the removed key'
	);

	store.removeAll();
	t.deepEqual(store.listKeys(), [], 'listing keys without any possible values');

	// Cleanup.
	store.removeAll();
});
