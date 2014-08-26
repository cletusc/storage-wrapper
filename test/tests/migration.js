require('../shims');

var StorageWrapper = require('../../');
var test = require('tape');

test('migration', function (t) {
	// Setup.
	var store1 = new StorageWrapper();
	var store2 = new StorageWrapper({
		namespace: 'foo'
	});

	// Test.
	t.plan(15);

	store1.set('key1', 1);
	store1.set('key2', 1);
	store1.set('key3', 1);
	store1.set('key4', 1);
	//store1.set('key5', 1);
	//store1.set('key6', 1);
	store1.set('key7', 1);
	store1.set('key8', 1);

	//store2.set('key1', 2);
	//store2.set('key2', 2);
	store2.set('key3', 2);
	store2.set('key4', 2);
	store2.set('key5', 2);
	//store2.set('key6', 2);
	//store2.set('key7', 2);
	//store2.set('key8', 2);

	// Valid migrations.

	// Move set old key to unset new key and getting rid of old key.
	store2.migrate({
		fromNamespace: null,
		fromKey: 'key1',
		toKey: 'key1'
	});
	// Move set old key to unset new key and keep old key.
	store2.migrate({
		fromNamespace: null,
		fromKey: 'key2',
		toKey: 'key2',
		keepOldData: true
	});
	// Move set old key to set new key, overwriting new key and getting rid of old key.
	store2.migrate({
		fromNamespace: null,
		fromKey: 'key3',
		toKey: 'key3',
		overwriteNewData: true
	});
	// Move set old key to set new key, not overwriting and getting rid of the old key.
	store2.migrate({
		fromNamespace: null,
		fromKey: 'key4',
		toKey: 'key4'
	});
	// Move unset old key to set new key (don't move anything).
	store2.migrate({
		fromNamespace: null,
		fromKey: 'key5',
		toKey: 'key5'
	});
	// Move unset old key to unset new key (don't move anything).
	store2.migrate({
		fromNamespace: null,
		fromKey: 'key6',
		toKey: 'key6'
	});
	// Move set old key to unset new key, transform old.
	store2.migrate({
		fromNamespace: null,
		fromKey: 'key7',
		toKey: 'key7',
		transform: function (data) {
			return data * 10;
		}
	});

	t.equal(store1.get('key1'), null, 'set old -> unset new, remove old: old');
	t.equal(store2.get('key1'), 1, 'set old -> unset new, remove old: new');

	t.equal(store1.get('key2'), 1, 'set old -> unset new, keep old: old');
	t.equal(store2.get('key2'), 1, 'set old -> unset new, keep old: new');

	t.equal(store1.get('key3'), null, 'set old -> set new, overwrite new, remove old: old');
	t.equal(store2.get('key3'), 1, 'set old -> set new, overwrite new, remove old: new');

	t.equal(store1.get('key4'), null, 'set old -> set new, don\'t overwrite new, remove old: old');
	t.equal(store2.get('key4'), 2, 'set old -> set new, don\'t overwrite new, remove old: new');

	t.equal(store1.get('key5'), null, 'unset old -> set new (no migration): old');
	t.equal(store2.get('key5'), 2, 'unset old -> set new (no migration): new');

	t.equal(store1.get('key6'), null, 'unset old -> unset new (no migration): old');
	t.equal(store2.get('key6'), null, 'unset old -> unset new (no migration): new');

	t.equal(store1.get('key7'), null, 'unset old -> unset new, transform old, remove old: old');
	t.equal(store2.get('key7'), 10, 'unset old -> unset new, transform old, remove old: new');

	// Invalid migrations.
	t.throws(
		function () {
			store2.migrate({
				fromNamespace: null,
				fromKey: 'key8',
				toKey: 'key8',
				transform: ''
			});
		},
		new Error('Invalid transform callback.'),
		'invalid transform'
	);

	// Cleanup.
	store1.removeAll();
	store2.removeAll();
});
