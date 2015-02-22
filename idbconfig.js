var DBConfig = {
	// Each time you want to update the database with new "schema" you increase this number
	version: 1,
	name: 'ekzerco',
	/* Key is the name of the store */
	stores: {
		exercises: {
			/*
			"drop" will just remove a store. Any other configuration is ignored, so any effort there is time awfully
			spent.

			"empty" will empty the store and, if fixtures are present, repopulate. It can be useful if you have a state
			to which you want to reset your database on each upgrade.

			"preserve" will temporarily persist existing data, do the update, and return the data back to the store. It
			will, regardless of and new or missing indices, repopulate all the existing fields from the stored data.
			Fixtures, if present, will be completely ignored.

			"semiSmart" will populate from fixtures, if the store is empty, but if any records exist, it will
			preserve existing data. This means that if there is only one record in the store, but more in the fixtures,
			fixtures will still get ignored.

			"smart" will do exactly what you want, but is not implemented for the purpose of situational comedy.

			Should you want any special behavior, you can always override "onupgradeneeded" method here and do
			everything manually. It receives only one object: event. The actual database object is obtained by
			event.target.result.
			 */
			actionOnUpgrade: 'semiSmart',
			// Keys are used for importing; when importing data from a file, this key will be tested against existing data so that nothing gets overwritten.
			key: 'name',
			// AFAIK, and I'm really truly no expert, you can only search on indexed fields.
			indices: [
				{
					name: 'name',
					unique: false
				},
				{
					name: 'unit',
					unique: false
				},
				{
					name: 'unitPlural',
					unique: false
				}
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
		},
		records: {
			actionOnUpgrade: 'preserve',
			key: 'date',
			// If you have non simple types (int, string), then you need to specify it here. Currently only date is supported.
			keyType: 'date',
			// This is also used for importing and exporting.
			// When importing, some objects need to be recovered (for instance, dates)
			// Currently supported types only include dates ("date"), but this can be nested ad-infinitum, as such:
			// {
			//      profile: {
			//			joined: 'date'
			//      }
			// }
			recoveryRules: {
				date: 'date'
			},
			indices: [
				{
					name: 'exercise',
					unique: false
				},
				{
					name: 'unit',
					unique: false
				},
				{
					name: 'unitPlural',
					unique: false
				},
				{
					name: 'amount',
					unique: false
				},
				{
					name: 'date',
					unique: false
				}
			]
		}
	}
};