var DB = (function () {
	var r = {
		db: null,
		indexedDB: null,
		deferred: null,
		IDBKeyRange: null,
		capitalize: function (string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		},
		getAllRecords: function (transaction, storeName, callback) {
			var store = transaction.objectStore(storeName),
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
		},
		resetStore: function (db, storeName, indices, fixtures) {
			var store = null;

			if (db.objectStoreNames.contains(storeName)) {
				db.deleteObjectStore(storeName);
			}

			store = db.createObjectStore(storeName, {autoIncrement: true});

			$.each(indices, function (i, indexConfig) {
				store.createIndex(indexConfig.name, indexConfig.name, { unique: !!indexConfig.unique});
			});

			$.each(fixtures || [], function (i, blob) {
				store.add(blob);
			});
		}
	}, u = {
		onReady: function (callback) {
			r.deferred.done(callback);
		},
		getKeyRange: function () {
			return r.IDBKeyRange;
		},
		initialize: function () {
			var request = null;

			r.deferred = $.Deferred();

			r.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
			r.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

			request = r.indexedDB.open(DBConfig.name, DBConfig.version);

			request.onerror = function (event) {
				// Nothing to see here. Oh wait, nothing to see, if this doesn't work
			};

			request.onsuccess = function (event) {
				r.db = request.result;

				// When constructing these methods, I could use idbconfig, but should anything be misconfigured, I
				// would really not want everything to stop working.
				$.each(r.db.objectStoreNames, function (key, value) {
					u[value] = {
						add: function (blob, callback) {
							var transaction = r.db.transaction(value, 'readwrite'),
								store = transaction.objectStore(value),
								request = store.add(blob);

							callback = callback || function () {
							};

							request.onsuccess = function (event) {
								callback(event);
							}
						},
						all: function (callback) {
							var transaction = r.db.transaction(value),
								store = transaction.objectStore(value),
								cursorRequest = store.openCursor(),
								items = [];

							callback = callback || function () {};

						    transaction.oncomplete = function(event) {
						        callback(items, event);
						    };

						    cursorRequest.onsuccess = function(event) {
						        var cursor = event.target.result,
									blob = {};

						        if (cursor) {
							        blob = cursor.value;
									blob.pk = cursor.primaryKey;
						            items.push(blob);
						            cursor.continue();
						        }
						    };
						},
						remove: function (pk, callback) {
							var transaction = r.db.transaction(value, 'readwrite'),
								store = transaction.objectStore(value),
								request = store.delete(pk);

							callback = callback || function () {};

							request.onsuccess = callback || function (event) {
							};
						},
						select: (function () {
							var result = {};

							$.each(r.db.transaction(value).objectStore(value).indexNames, function (i, indexName) {
								result['by' + r.capitalize(indexName)] = function (condition, callback, error, keyRange) {
									var transaction = r.db.transaction(value, 'readonly'),
										store = transaction.objectStore(value),
										index = store.index(indexName),
										request = index.openCursor(keyRange || r.IDBKeyRange.only(condition, true)),
										result = [];

									request.onerror = error || function (event) {
										console.log('Error', event);
									};

									transaction.oncomplete = function (event) {
										callback(result, event);
									};

									request.onsuccess = function (event) {
										var cursor = event.target.result,
											blob = {};

										if (cursor) {
											blob = cursor.value;
											blob.pk = cursor.primaryKey;
											result.push(blob);
											cursor.continue();
										}
									};
								};
							});

							return result;
						}())
					};
				});

				r.deferred.resolve();
			};

			request.onupgradeneeded = function (event) {
				var db = event.target.result,
					transaction = event.target.transaction;

				$.each(DBConfig.stores, function (storeName, config) {
					if (config.actionOnUpgrade === 'drop') {
						if (db.objectStoreNames.contains(storeName)) {
							db.deleteObjectStore(storeName);
						}
					} else if (config.actionOnUpgrade === 'empty') {
						r.resetStore(db, storeName, config.indices, config.fixtures);
					} else if (config.actionOnUpgrade === 'preserve') {
						if (db.objectStoreNames.contains(storeName)) {
							r.getAllRecords(transaction, storeName, function (items) {
								r.resetStore(db, storeName, config.indices, items);
							});
						} else {
							r.resetStore(db, storeName, config.indices, config.fixtures);
						}
					} else if (config.actionOnUpgrade === 'semiSmart') {
						if (db.objectStoreNames.contains(storeName)) {
							r.getAllRecords(transaction, storeName, function (items) {
								if (items && items.length) {
									r.resetStore(db, storeName, config.indices, items);
								} else {
									r.resetStore(db, storeName, config.indices, config.fixtures);
								}
							});
						} else {
							r.resetStore(db, storeName, config.indices, config.fixtures);
						}

					} else if (config.actionOnUpgrade === 'smart') {
						console.log('Smart... LOL');
					}
				});

				console.log('"onupgradeneeded" finished');
			};

			return this;
		}
	};

	return u.initialize();
}());