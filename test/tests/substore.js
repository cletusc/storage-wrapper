require('../shims');

var StorageWrapper = require('../../');
var test = require('tape');

test('substores', function (t) {
	// Setup.
	// Create main store.
	var store = new StorageWrapper({
	    namespace: 'myapp'
	});

	// Create substore.
	var substore = store.createSubstore('things');

	// Test.
	t.plan(1);

	// Set value.
	substore.set('foo', 'bar');

	t.equal(substore.get('foo') === store.get('things:foo'), true, 'substore matches parent');

	// Cleanup.
	store.removeAll();
	substore.removeAll();
});
