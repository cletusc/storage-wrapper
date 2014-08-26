require('../shims');

var StorageWrapper = require('../../');
var test = require('tape');

test('cache integrity', function (t) {
	// Setup.
	var store1 = new StorageWrapper({
		namespace: 'different'
	});
	var store2 = new StorageWrapper();

	// Test.
	t.plan(6);

	// Set them.
	store1.set('test1', 'old foo');
	store1.set('test2', 'old bar');
	store2.set('test1', 'different old foo');

	// Make them stale.
	localStorage.setItem(store1.getStorageKey('test1'), 'new foo');
	localStorage.setItem(store1.getStorageKey('test2'), 'new bar');
	localStorage.setItem(store2.getStorageKey('test1'), 'different new foo');

	// Stale cache.
	t.equal(store1.get('test1'), 'old foo', 'stale value');

	// Freshen it.
	store1.freshen('test1');
	t.equal(store1.get('test1'), 'new foo', 'fresh value after freshen');
	t.equal(store1.get('test2'), 'old bar', 'stale value still on different key');
	t.equal(store2.get('test1'), 'different old foo', 'stale value still on different namespace of same key');

	// Freshen all keys in the namespace.
	store1.freshen();
	t.equal(store1.get('test2'), 'new bar', 'fresh value on all keys');
	t.equal(store2.get('test1'), 'different old foo', 'stale value still on different namespace');

	// Cleanup.
	store1.removeAll();
	store2.removeAll();
});
