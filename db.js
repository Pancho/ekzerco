var DB = (function () {
	var r = {
		db: null,
		dbRequest: null,
		version: 1,
		indexedDB: null,
		deferred: null,
		IDBKeyRange: null,
		fixtures: {
			exercises: [
				{
					name: 'Push ups',
					unit: 'repetition',
					unitPlural: 'repetitions'
				},
				{
					name: 'Squat',
					unit: 'repetition',
					unitPlural: 'repetitions'
				},
				{
					name: 'Crunches',
					unit: 'repetition',
					unitPlural: 'repetitions'
				},
				{
					name: 'Power jump',
					unit: 'repetition',
					unitPlural: 'repetitions'
				},
				{
					name: 'Burpee',
					unit: 'repetition',
					unitPlural: 'repetitions'
				},
				{
					name: 'Jump rope',
					unit: 'minutes',
					unitPlural: 'minutes'
				},
				{
					name: 'Running',
					unit: 'kilometers',
					unitPlural: 'kilometers'
				}
			]
		}
	}, u = {
		onReady: function (callback) {
			r.deferred.done(callback);
		},
		getKeyRange: function () {
			return r.IDBKeyRange;
		},
		initialize: function () {
			r.deferred = $.Deferred();

			r.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
			r.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

			r.dbRequest = r.indexedDB.open('ekzerco', r.version);

			r.dbRequest.onerror = function (event) {
				// Nothing to see here. Oh wait, nothing to see, if this doesn't work
			};

			r.dbRequest.onsuccess = function (event) {
				r.db = r.dbRequest.result;

				$.each(r.db.objectStoreNames, function (key, value) {
					var capitalized = Utils.capitalize(value);

					u['get' + capitalized] = function (callback) {
						var transaction = r.db.transaction(value),
							store = transaction.objectStore(value),
							cursorRequest = store.openCursor(),
							items = [];

					    transaction.oncomplete = function(event) {
					        callback(items, event);
					    };

					    cursorRequest.onsuccess = function(event) {
					        var cursor = event.target.result;
					        if (cursor) {
					            items.push(cursor.value);
					            cursor.continue();
					        }
					    };
					};

					$.each(r.db.transaction(value).objectStore(value).indexNames, function (i, indexName) {
						u['select' + capitalized + 'By' + Utils.capitalize(indexName)] = function (condition, callback, error, keyRange) {
							var transaction = r.db.transaction(value, 'readonly'),
								store = transaction.objectStore(value),
								index = store.index(indexName),
								request = null;

							request = index.openCursor(keyRange || r.IDBKeyRange.only(condition, true));

							request.onerror = error || function (event) {
								console.log('Error', event);
							};

							request.onsuccess = function (event) {
								var cursor = event.target.result,
									blob = {};

								if (cursor) {
									blob = cursor.value;
									blob.pk = cursor.primaryKey;
									callback(blob, event);
									cursor.continue();
								}
							};
						};
					});

					u['delete' + capitalized] = function (pk, callback) {
						var transaction = r.db.transaction(value, 'readwrite'),
							store = transaction.objectStore(value),
							request = store.delete(pk);

						request.onsuccess = callback || function (event) {};
					};

					u['add' + capitalized] = function (blob) {
						var transaction = r.db.transaction(value, 'readwrite'),
							store = transaction.objectStore(value);

						store.add(blob);
					}
				});

				r.deferred.resolve();
			};

			r.dbRequest.onupgradeneeded = function (event) {
				var db = event.target.result,
					exercises = {},
					records = {};

				if (db.objectStoreNames.contains('exercises')) {
					db.deleteObjectStore('exercises');
				}
				exercises = db.createObjectStore('exercises', {autoIncrement: true});
				exercises.createIndex('name', 'name', { unique: false });
				exercises.createIndex('unit', 'unit', { unique: false });

				if (!db.objectStoreNames.contains('records')) {
					records = db.createObjectStore('records', {autoIncrement: true});
					records.createIndex('exercise', 'exercise', { unique: false });
					records.createIndex('unit', 'unit', { unique: false });
					records.createIndex('amount', 'amount', { unique: false });
					records.createIndex('date', 'date', { unique: false });
				}

				$.each(r.fixtures.exercises, function (i, exercise) {
					exercises.add(exercise);
				});
			};

			return this;
		}
	};

	return u.initialize();
}());