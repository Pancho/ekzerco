var Ekzerco = (function () {
	var r = {
		initAddActivity: function () {
			var form = $('<form action="" id="new-record" method="get">' +
					'<fieldset>' +
						'<legend>New activity</legend>' +
						'<ol>' +
							'<li>' +
								'<label for="exercise">Exercise</label>' +
								'<select name="exercise" id="exercise" required="required"><option value=""> -- Select exercise -- </option></select>' +
							'</li>' +
							'<li>' +
								'<label for="amount" id="amount-name">Amount</label>' +
								'<input type="number" name="amount" id="amount" required="required" placeholder="Insert a number" />' +
							'</li>' +
						'</ol>' +
						'<div class="control">' +
							'<input type="submit" class="button" name="add" id="add" value="Add" />' +
						'</div>' +
					'</fieldset>' +
				'</form>'),
				disabled = false;

			DB.getExercises(function (exercises) {
				$.each(exercises, function (i, exercise) {
					form.find('select').append('<option value="' + exercise.name + '" data-unit="' + exercise.unit + '" data-unitplural="' + exercise.unitPlural + '">' + Utils.capitalize(exercise.name) + '</option>');
					if (i === 0) {
						form.find('#amount-name').text(Utils.capitalize(exercise.unit));
					}
				});
			});

			form.find('select').on('change', function () {
				$('#amount-name').text(Utils.capitalize($(this).find('option:selected').data('unit')));
			});

			form.on('submit', function (ev) {
				var selectedExercise = $('#exercise option:selected'),
					record = {
						exercise: selectedExercise.attr('value'),
						unit: selectedExercise.data('unit'),
						unitPlural: selectedExercise.data('unitplural'),
						amount: parseInt($('#amount').val(), 10),
						date: new Date()
					}, notification = $('<p class="notification">Exercise added</p>');
				ev.preventDefault();

				if (disabled) {
					return;
				}

				disabled = true;
				DB.addRecords(record);

				form.after(notification);

				// Don't allow saving a new record for 2 seconds.
				setTimeout(function () {
					disabled = false;
					notification.fadeOut();
				}, 2000);
			});

			$('body').append(form);
		},
		initStartUsing: function () {
			var startedUsing = localStorage.getItem('startedUsing');

			if (!startedUsing) {
				localStorage.setItem('startedUsing', new Date());
			}
		}
	}, u = {
		initialize: function () {
			r.initStartUsing();
			DB.onReady(r.initAddActivity);
		}
	};

	return u;
}());

$(Ekzerco.initialize);