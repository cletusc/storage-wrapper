require('../shims');

var StorageWrapper = require('../../');
var test = require('tape');

test('getting and setting values', function (t) {
	var store = new StorageWrapper();

	// Setup.
	var valStringFoo = 'foo';
	var valNumber1 = 1;
	var valBooleanTrue = true;
	var valObjectFooBar = {foo: 'bar'};
	var valArrayComplex = [valStringFoo, valNumber1, valBooleanTrue, valObjectFooBar];
	var valRegExpLiteral = /^foo(bar|baz)$/;
	var valRegExpConstruct = new RegExp('[a-z]+', 'i');

	// Start tests.
	t.plan(29);

	// Set some stuff.
	store.set('stringFoo', valStringFoo);
	store.set('number1', valNumber1);
	store.set('booleanTrue', valBooleanTrue);
	store.set('objectFooBar', valObjectFooBar);
	store.set('arrayComplex', valArrayComplex);
	store.set('regExpLiteral', valRegExpLiteral);
	store.set('regExpConstruct', valRegExpConstruct);

	// Confirm 
	t.equal(localStorage.getItem(store.getStorageKey('stringFoo')), valStringFoo, 'set simple string');
	t.equal(localStorage.getItem(store.getStorageKey('number1')), valNumber1, 'set simple number');
	t.equal(localStorage.getItem(store.getStorageKey('booleanTrue')), valBooleanTrue, 'set simple boolean');
	t.equal(localStorage.getItem(store.getStorageKey('objectFooBar')), '~JSON:{"foo":"bar"}', 'set simple JSON object');
	t.equal(localStorage.getItem(store.getStorageKey('arrayComplex')), '~JSON:["foo",1,true,{"foo":"bar"}]', 'set complex JSON object');
	t.equal(localStorage.getItem(store.getStorageKey('regExpLiteral')), '~RegExp::^foo(bar|baz)$', 'set RegExp literal');
	t.equal(localStorage.getItem(store.getStorageKey('regExpConstruct')), '~RegExp:i:[a-z]+', 'set RegExp construct with flag');

	// Getting recently cached values.
	t.equal(store.get('stringFoo'), valStringFoo, 'get cached simple string');
	t.equal(store.get('number1'), valNumber1, 'get cached simple number');
	t.equal(store.get('booleanTrue'), valBooleanTrue, 'get cached simple boolean');
	t.deepEqual(store.get('objectFooBar'), valObjectFooBar, 'get cached simple JSON object');
	t.deepEqual(store.get('arrayComplex'), valArrayComplex, 'get cached complex JSON object');
	t.deepEqual(store.get('regExpLiteral'), valRegExpLiteral, 'get cached RegExp literal');
	t.deepEqual(store.get('regExpConstruct'), valRegExpConstruct, 'get cached RegExp construct with flag');

	// Getting fresh values.
	store.freshen();
	t.equal(store.get('stringFoo'), valStringFoo, 'get fresh simple string');
	t.equal(store.get('number1'), valNumber1, 'get fresh simple number');
	t.equal(store.get('booleanTrue'), valBooleanTrue, 'get fresh simple boolean');
	t.deepEqual(store.get('objectFooBar'), valObjectFooBar, 'get fresh simple JSON object');
	t.deepEqual(store.get('arrayComplex'), valArrayComplex, 'get fresh complex JSON object');
	t.deepEqual(store.get('regExpLiteral'), valRegExpLiteral, 'get fresh RegExp literal');
	t.deepEqual(store.get('regExpConstruct'), valRegExpConstruct, 'get fresh RegExp construct with flag');

	// Defaults
	t.equal(store.get('stringFoo', 'test'), valStringFoo, 'default with existing value');
	t.equal(store.get('invalidStringFoo', valStringFoo), valStringFoo, 'default without existing value');
	t.equal(store.get('invalidStringFoo'), null, 'value without default or existing value');

	// Data expiry.
	store.set('expireKeyNumber', 'foo', 100);
	store.set('expireKeyDate', 'foo', new Date(Date.now() + 100));
	t.equal(store.get('expireKeyNumber'), 'foo', 'get expired data, set by number: before');
	t.equal(store.get('expireKeyDate'), 'foo', 'get expired data, set by date: before');
	setTimeout(function () {
		t.equal(store.get('expireKeyNumber'), null, 'get expired data, set by number: after');
		t.equal(store.get('expireKeyDate'), null, 'get expired data, set by date: after');
	}, 200);

	t.test('teardown', function (t) {
		store.removeAll();
		t.end();
	});
});
