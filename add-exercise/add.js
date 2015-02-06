var EkzercoAdd = (function () {
	var r = {
		initManageExercises: function () {
			var html = $('<form action="" id="add-exercise" method="get">' +
					'<fieldset>' +
							'<legend>Add New Exercise</legend>' +
							'<ol>' +
								'<li>' +
									'<label for="name">Exercise Name</label>' +
									'<input type="text" name="name" id="name" required="required" placeholder="Exercise Name" value="" />' +
								'</li>' +
								'<li>' +
									'<label for="unit">Exercise Unit Name</label>' +
									'<input type="text" name="unit" id="unit" required="required" placeholder="Exercise Unit Name" value="" />' +
								'</li>' +
								'<li>' +
									'<label for="unitplural">Exercise Unit Name Plural</label>' +
									'<input type="text" name="unitplural" id="unitplural" required="required" placeholder="Exercise Unit Name Plural" value="" />' +
								'</li>' +
							'</ol>' +
							'<div class="control">' +
								'<input type="submit" class="button" name="add" id="add" value="Add" />' +
							'</div>' +
						'</fieldset>' +
					'</form>' +
					'<ol id="records"></ol>'),
				disabled = false;

			$('body').append(html);

			html.on('keyup', '#unit', function (ev) {
				$('#unitplural').val($(this).val() + 's');
			});

			$('#add-exercise').on('submit', function (ev) {
				var notification = $('<p class="notification">Exercise added</p>');
				ev.preventDefault();

				if (disabled) {
					return;
				}

				disabled = true;

				DB.selectExercisesByName($('#name').val(), function (data) {
					if (!data[0] || data[0].name !== $('#name').val()) {
						DB.addExercises({
							name: $('#name').val(),
							unit: $('#unit').val(),
							unitPlural: $('#unitplural').val()
						}, function (event) {
							$('#records').append('<li data-pk="' + event.target.result + '"><a class="remove" href="" title="Remove this entry">X</a>' + $('#name').val() + '</li>');
						});
						$('form').after(notification);
					}

					setTimeout(function () {
						disabled = false;
						notification.fadeOut();
					}, 2000);
				});
			});

			DB.getExercises(function (exercises) {
				$.each(exercises, function (i, exercise) {
					$('#records').append('<li data-pk="' + exercise.pk + '"><a class="remove" href="" title="Remove this entry">X</a>' + exercise.name + '</li>');
				});
			});

			$('#records').on('click', '.remove', function (ev) {
				var listItem = $(this).closest('li');
				ev.preventDefault();

				DB.deleteExercises(parseInt(listItem.data('pk'), 10), function () {
					listItem.remove();
				});
			});
		}
	}, u = {
		initialize: function () {
			DB.onReady(r.initManageExercises);
		}
	};

	return u;
}());

$(EkzercoAdd.initialize);