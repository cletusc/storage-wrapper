require('../shims');

var StorageWrapper = require('../../');
var test = require('tape');

test('wrapper settings', function (t) {
	// Setup.
	var store = new StorageWrapper();

	// Test.
	t.plan(18);

	// Defaults.
	t.equal(store.getNamespace(), '', 'default namespace');
	t.equal(store.getStorageType(), 'local', 'default storage type');

	// Namespace separators.
	store.setNamespace('foo');
	t.equal(store.getNamespace(true), 'foo:', 'default namespace with separator');
	store.setNamespace(false);
	t.equal(store.getNamespace(true), '', 'empty namespace with separator');

	// No namespace.
	store.setNamespace(false);
	t.equal(store.getNamespace(), '', 'empty namespace: false');
	store.setNamespace('foo');
	store.setNamespace(null);
	t.equal(store.getNamespace(), '', 'empty namespace: null');
	store.setNamespace('foo');
	store.setNamespace('');
	t.equal(store.getNamespace(), '', 'empty namespace: empty string');

	// Non-valid namespaces.
	t.throws(
		function () {
			store.setNamespace(1);
		},
		new Error('Invalid namespace.'),
		'non-string namespace: number'
	);
	t.throws(
		function () {
			store.setNamespace({});
		},
		new Error('Invalid namespace.'),
		'non-string namespace: object'
	);
	t.throws(
		function () {
			store.setNamespace([]);
		},
		new Error('Invalid namespace.'),
		'non-string namespace: array'
	);
	t.throws(
		function () {
			store.setNamespace(true);
		},
		new Error('Invalid namespace.'),
		'non-string namespace: boolean(true)'
	);
	t.throws(
		function () {
			store.setNamespace('@_test-123!');
		},
		new Error('Invalid namespace.'),
		'namespace with invalid characters'
	);

	// Valid namespaces.
	t.doesNotThrow(function () {
		store.setNamespace('_test-123:');
	}, 'valid namespace');

	// Confirm change in namespace.
	t.equal(store.getNamespace(), '_test-123:', 'changed namespace');

	// Unknown storage types.
	t.throws(
		function () {
			store.setStorageType('foo');
		},
		new Error('Invalid storage type.'),
		'unknown storage type'
	);

	// Valid storage types.
	t.doesNotThrow(function () {
		store.setStorageType('session');
	}, 'valid storage types: session');
	t.doesNotThrow(function () {
		store.setStorageType('local');
	}, 'valid storage types: local');

	// Getting the storage type.
	store.setStorageType('session');
	t.equal(store.getStorageType(), 'session', 'storage type');
});
