var DBConfig = {
	version: 1,
	name: 'exzerco',
	onupgradeneeded: function (event) {
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
	}
};