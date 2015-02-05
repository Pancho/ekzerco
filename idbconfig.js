var DBConfig = {
	// Each time you want to update the database with new "schema" you increase this number
	version: 1,
	name: 'exzerco',
	/* Key is the name of the store */
	stores: {
		exercises: {
			/*
			"empty" will empty the store and, if fixtures are present, repopulate. It can be useful if you have a state
			to which you want to reset your database on each upgrade.

			"preserve" will temporarily persist existing data, do the update, and return the data back. It will,
			regardless of and new or missing indices, repopulate all the existing fields from the stored data. Fixtures,
			if present, will be completely ignored.

			"semiSmart" will populate from fixtures, if the store is empty, but any records exist, it will
			preserve existing data. This means that if there is only one record in the store, but more in the fixtures,
			fixtures will still get ignored.

			"smart" will do exactly what you want, but is not implemented for the purpose of situational comedy.

			Should you want any special behavior, you can always override "onupgradeneeded" method here and do
			everything manually.
			 */
			actionOnUpgrade: 'preserve',
			// AFAIK, and I'm really truly no expert, you can only search on indexed fields.
			indices: [
				'name',
				'unit',
				'unitPlural'
			],
			fixtures: [
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
	}
};