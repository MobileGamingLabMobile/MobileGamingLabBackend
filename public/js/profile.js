App.controller("profileController", function ($http, $scope) {

	$scope.token = window.sessionStorage.getItem("token");
	this.userID = window.sessionStorage.getItem("userID");

	// select abboniert or erstellt tab
	// 1 = subscribed games and 2 = own games
	this.tab = 1;
	this.isSelected = function (checkTab) {
		return this.tab === checkTab;
	};


	/**
	 * loads subscribed games from the loades user
	 */
	this.loadSgame = function () {
		if (this.userID === "null")
		{
			$http.get("http://giv-mgl.uni-muenster.de:8080/user/games/subscribed/?access_token=" + $scope.token).success(function (data) {
				console.log(data);
				if (data.success)
				{
					$scope.sgames = data.games;
					initialiseTable($scope.sgames, 'tab01');
				}
				;
			});
		}
		else {
			$http.get("http://giv-mgl.uni-muenster.de:8080/user/games/subscribed/"+this.userID+"?access_token=" + $scope.token).success(function (data) {
				console.log(data);
				if (data.success)
				{
					$scope.sgames = data.games;
					initialiseTable($scope.sgames, 'tab01');
				}
				;
			});
		}
		this.tab = 1;
	};

	/**
	 * loads owned games from the loaded user
	 */
	this.loadOgame = function () {
		if (this.userID === "null") {
			$http.get("http://giv-mgl.uni-muenster.de:8080/user/games/owned/?access_token=" + $scope.token).success(function (data) {
				console.log(data);
				if (data.success)
				{
					$scope.ogames = data.games;
					initialiseTable($scope.ogames, 'tab02');
				}
				;
			});
		}
		else {
			$http.get("http://giv-mgl.uni-muenster.de:8080/user/games/owned/"+this.userID+"?access_token=" + $scope.token).success(function (data) {
				console.log(data);
				if (data.success)
				{
					$scope.ogames = data.games;
					initialiseTable($scope.ogames, 'tab02');
				}
				;
			});
		}
		this.tab = 2;
	};

	/**
	 * loads user data from the selected profil
	 */
	this.loaduser = function () {
		console.log("userID:" + this.userID);
		if (this.userID === "null")
		{
			$scope.userID = true;
			$http.get("http://giv-mgl.uni-muenster.de:8080/profile/?access_token=" + $scope.token).success(function (data) {
				if (data.success) {
					$scope.users = data.user;
					console.log(data.user);
				}
				;
			});
		}
		else
		{
			$scope.userID = false;
			$http.get("http://giv-mgl.uni-muenster.de:8080/profile/" + this.userID + "/?access_token=" + $scope.token).success(function (data) {
				if (data.success) {
					$scope.users = data.user;
					console.log(data.user);
				}
				;
			});
		}
		console.log($scope.userID);
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
		$body.on("click", "tr", function () {
			var index = table.row(this).index();
			console.log(index);
			window.sessionStorage.setItem("gameID", allgamesdata[index].id);
			window.location.href = "#gameinfo";
		});
		$.each(allgamesdata, function (i) {
			$('#' + tabid + allgamesdata[i].id).rateYo({
				rating: allgamesdata[i].rating,
				precision: 2,
				readOnly: true
			});
		});
	};

	/**
	 * logout
	 */
	$scope.logout = function () {
		$http.post('http://giv-mgl.uni-muenster.de:8080/logout', {access_token: $scope.token}).success(function (data) {
			console.log(data);
			if (data.success) {

				window.sessionStorage.setItem("gameID", null);
				window.sessionStorage.setItem("userID", null);
				window.sessionStorage.setItem("token", null);
				window.location.href = "#logout";
			} else {
				$scope.message = data.message;
				$scope.error = true;
			}
			;
		});
	};
});
