App.controller("selectGameController", function ($scope, $http, $routeParams) {


	this.tab = 3;
	/**
	 * checks if the tab with the number checkTab is selected
	 * @param {int} checkTab
	 * @returns {Boolean}
	 */
	this.isSelected = function (checkTab) {
		return this.tab === checkTab;
	};

	//$scope.token = $routeParams.token;
	$scope.token = window.sessionStorage.getItem("token");

	/**
	 * loadAllgame gets a object from the server with all stored games, saved in $scope.allgames
	 */
	this.loadAllgame = function () {
		$http.get("http://giv-mgl.uni-muenster.de:8080/games/published/?access_token=" + $scope.token).success(function (data) {
			if (data.success)
			{
				$scope.allgames = data.games;
				initialiseTable($scope.allgames, 'tab03');

			}
			;
		});
		this.tab = 3;
	};

	/**
	 * constructs a table for games with two columns, first gamename, second rating
	 * the table is clickable, to get to the gameinfo
	 * @param {array} data : array of objects of games
	 * @param {string} tabid : id of the div in which the table should be initialised
	 */
	var initialiseTable = function (data, tabid) {
		//initialise table
		$table = $('<table class="display"></table>');
		$head = $('<thead></thead>');
		$body = $('<tbody></tbody>');
		$hline = $('<tr></tr>');
		$hline.append($('<th></th>').html('Spiel'));
		$hline.append($('<th></th>').html('Bewertung'));
		$head.append($hline);
		$table.append($head);

		// load needed data into an array and than into a row
		var allgamesdata = [];
		$.each(data, function (i, item) {
			allgamesdata [i] = {
				"id": data[i]._id,
				"name": data[i].metadata.name,
				"rating": data[i].metadata.rating.toFixed(2)
			};
			//load table
			$bline = $('<tr></tr>');
			$bline.append($('<td></td>').html(allgamesdata[i].name));
			$bline.append($('<td></td>').html('<div id="' + tabid + allgamesdata[i].id + '"></div>'));
			$body.append($bline);
		});

		// draw the table
		$table.append($body);
		$('#' + tabid).html('');
		$('#' + tabid).append($table);
		var table = $table.DataTable({
			"bLengthChange": false,
			"bFilter": true,
			"bInfo": false,
			"bAutoWidth": false,
			"pagingType": "simple_numbers",
			"language": {
				"infoEmpty": "Keine Spiele vorhanden",
				"zeroRecords": "Keine Spiele gefunden",
				"search": "Suche:",
				"paginate": {
					"next": ">",
					"previous": "<"
				}
			}
		});
		table.draw();

		// make the row clickable
		$body.on("click", "tr", function () {
			var index = table.row(this).index();
			window.sessionStorage.setItem("gameID", allgamesdata[index].id);
			window.location.href = "#gameinfo";
		});

		// draw the rating stars
		$.each(allgamesdata, function (i) {
			$('#' + tabid + allgamesdata[i].id).rateYo({
				rating: allgamesdata[i].rating,
				precision: 2,
				readOnly: true
			});
		});
	};


	/**
	 * loads all subscribed games from the user
	 * if success true: then initialise table
	 */
	this.loadSgame = function () {
		$http.get("http://giv-mgl.uni-muenster.de:8080/user/games/subscribed/?access_token=" + $scope.token).success(function (data) {
			console.log(data);
			if (data.success)
			{
				$scope.sgames = data.games;
				initialiseTable($scope.sgames, 'tab01');
			}
			;
		});
		this.tab = 1;
	};

	/**
	 * loads all games created by this user
	 * by success true: initialise table
	 */
	this.loadOgame = function () {
		$http.get("http://giv-mgl.uni-muenster.de:8080/user/games/owned/?access_token=" + $scope.token).success(function (data) {
			console.log(data);
			if (data.success)
			{
				$scope.ogames = data.games;
				initialiseTable($scope.ogames, 'tab02');
			}
			;
		});
		this.tab = 2;
	};

	/**
	 * loads the own profile with setting userID to null
	 */
	this.profile = function () {
		window.sessionStorage.setItem("userID", null);
		window.location.href = "#profile";
	};

});