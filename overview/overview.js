var EkzercoOverview = (function () {
	var r = {
		humanizeAmount: function (record) {
			if (record.amount === 1) {
				return record.unit;
			} else {
				return record.unitPlural;
			}
		},
		drawChart: function (data) {
				var chart = new google.visualization.LineChart(document.getElementById('graph'));

				data = google.visualization.arrayToDataTable(data);

				chart.draw(data, {
					height: 400,
					vAxis: {
						titleTextStyle: {
							color: '#6633cc'
						},
						minValue: 0
					}
//					,
//					sliceVisibilityThreshold:0
				});
		},
		sumAmounts: function (exercise, records) {
			var result = 0;

			$.each(records || [], function (i, record) {
				if (record.exercise === exercise) {
					result += record.amount;
				}
			});

			return result;
		},
		initDisplayDates: function () {
			var html = $('<form action="" id="record-by-date" method="get">' +
					'<fieldset>' +
						'<legend>Display Activities for Date</legend>' +
						'<ol>' +
							'<li>' +
								'<label for="date">Date</label>' +
								'<select name="date" id="date" required="required"><option value=""> -- Select date -- </option></select>' +
							'</li>' +
						'</ol>' +
					'</fieldset>' +
				'</form>' +
				'<ol id="records"></ol>');

			DB.getRecords(function (records) {
				var dates = [];
				records.sort(function (a, b) {
					return b.date - a.date;
				});

				$.each(records, function (i, record) {
					var start = Utils.toPrettyDate(Utils.getDayStart(record.date));

					if (dates.indexOf(start) === -1) {
						$('#date').append('<option value="' + record.date + '">' + start + '</option>');
						dates.push(start);
					}
				});
			});

			$('body').append(html);

			$('#date').on('change', function (ev) {
				var date = $(this).val(),
					start = Utils.getDayStart(date),
					end = Utils.getDayEnd(date);

				$('#records').empty();

				DB.selectRecordsByDate(null, function (records, event) {
					$.each(records, function (i, record) {
						$('#records').append('<li data-pk="' + record.pk + '"><a class="remove" href="" title="Remove this entry">X</a>' + record.exercise + ' (' + record.amount + ' ' + r.humanizeAmount(record) + ', ' + Utils.toHourMinute(record.date) + ')</li>');
					});
				}, null, DB.getKeyRange().bound(start, end, true, true));
			});

			$('#records').on('click', '.remove', function (ev) {
				var listItem = $(this).closest('li');
				ev.preventDefault();

				DB.deleteRecords(parseInt(listItem.data('pk'), 10), function () {
					listItem.remove();
				});
			});
		},
		getDates: function (span) {
			var result = [],
				now = new Date();

			if (span === 'weekly') {
				result = Utils.getDateRangeList(Utils.getMonday(now), now);
			} else if (span === 'monthly') {
				result = Utils.getDateRangeList(Utils.getMonthStart(now), now);
			} else if (span === 'yearly') {
				result = Utils.getDateRangeList(Utils.getYearStart(now), now);
			} else if (span === 'all') {
				result = Utils.getDateRangeList(new Date(localStorage.getItem('startedUsing')), now);
			}

			return result;
		},
		initDisplayGraphs: function () {
			var html = $('<form action="" id="exercise-graph" method="get">' +
					'<fieldset>' +
							'<legend>Display Graph for Exercise</legend>' +
							'<ol>' +
								'<li>' +
									'<label for="exercise">Exercise</label>' +
									'<select name="exercise" id="exercise" required="required"></select>' +
								'</li>' +
								'<li>' +
									'<label for="span">Time Span</label>' +
									'<select name="span" id="span" required="required">' +
										'<option value="weekly" selected="selected">Weekly</option>' +
										'<option value="monthly">Monthly</option>' +
										'<option value="yearly">Yearly</option>' +
										'<option value="all">All</option>' +
									'</select>' +
								'</li>' +
							'</ol>' +
						'</fieldset>' +
					'</form>' +
					'<div id="graph"></div>'),
				recordsList = [],
				dates = [],
				byDate = {};

			DB.getRecords(function (records) {
				var exercises = [];
				records.sort(function (a, b) {
					return a.date - b.date;
				});

				recordsList = records.splice();

				$.each(records, function (i, record) {
					var shortDate = Utils.toPrettyDate(record.date);

					if (!byDate[shortDate]) {
						byDate[shortDate] = [];
					}

					byDate[shortDate].push(record);

					if (exercises.indexOf(record.exercise) === -1) {
						$('#exercise').append('<option value="' + record.exercise + '" data-unitplural="' + record.unitPlural + '">' + record.exercise + '</option>');
						exercises.push(record.exercise);
					}
				});
			});

			$('body').append(html);

			$('#exercise').on('change', function (ev) {
				var exercise = $(this).val(),
					unitPlural = $(this).find('option:selected').data('unitplural'),
					data = [[exercise, Utils.capitalize(unitPlural)]],
					span = $('#span').val();

				$('#graph').empty();
				dates = r.getDates(span);

				$.each(dates, function (i, date) {
					var shortDate = Utils.toPrettyDate(date),
						records = byDate[shortDate];

					data.push([shortDate, r.sumAmounts(exercise, records)]);
				});

				r.drawChart(data);
			});

			$('#span').on('change', function (ev) {
				var exercise = $('#exercise').val(),
					unitPlural = $('#exercise option:selected').data('unitplural'),
					data = [[exercise, Utils.capitalize(unitPlural)]],
					span = $(this).val();

				$('#graph').empty();
				dates = r.getDates(span);

				$.each(dates, function (i, date) {
					var shortDate = Utils.toPrettyDate(date),
						records = byDate[shortDate];

					data.push([shortDate, r.sumAmounts(exercise, records)]);
				});

				r.drawChart(data);
			});
		}
	}, u = {
		initialize: function () {
			DB.onReady(r.initDisplayDates);
			DB.onReady(r.initDisplayGraphs);
		}
	};

	return u;
}());

$(function () {
	google.load('visualization', '1', {
		packages: ['corechart'],
		callback: EkzercoOverview.initialize
	});
});