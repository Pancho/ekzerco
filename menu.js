var EkzercoMenu = (function () {
	var r = {
//		subfolder: '', // You might want to change this, depending on deployment
		subfolder: 'ekzerco/', // You might want to change this, depending on deployment
		initMenu: function () {
			var html = $('<ul id="menu">' +
					'<li class="activity"><a href="/' + r.subfolder + '"><span class="fa fa-plus-square"></span><span class="text">Record Activity</span></a></li>' +
					'<li class="add"><a href="/' + r.subfolder + 'add-exercise"><span class="fa fa-edit"></span><span class="text">Add Exercise</span></a></li>' +
					'<li class="overview"><a href="/' + r.subfolder + 'overview"><span class="fa fa-line-chart"></span><span class="text">Overview</span></a></li>' +
				'</ul>');

			$('body').prepend(html);

			if (window.location.href.indexOf('add-exercise') > -1) {
				$('.add').addClass('selected');
			} else if (window.location.href.indexOf('overview') > -1) {
				$('.overview').addClass('selected');
			} else {
				$('.activity').addClass('selected');
			}
		}
	}, u = {
		initialize: function () {
			r.initMenu();
		}
	};

	return u;
}());

$(EkzercoMenu.initialize);