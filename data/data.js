var EkzercoData = (function () {
	var r = {
		initExport: function () {
			var anchor = $('#export'),
				disabled = true;

			anchor.addClass('disabled');

			DB.export(function (data) {
				anchor.prop('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data)));
				anchor.removeClass('disabled');
				disabled = false;
			});

			anchor.on('click', function (ev) {
				if (disabled) {
					ev.preventDefault();
				}
			});
		},
		initImport: function () {
			$('#import-form').on('submit', function (ev) {
				var reader = new FileReader();

				reader.onload = function (e) {
					DB.import(JSON.parse(reader.result));
				};

				reader.readAsText($('#file').prop('files')[0], 'utf-8');

				ev.preventDefault();
			});
		}
	}, u = {
		initialize: function () {
			DB.onReady(r.initExport);
			DB.onReady(r.initImport);
		}
	};

	return u;
}());

$(EkzercoData.initialize);