App.controller("gameInfoController", function ($scope, $http) {


	$scope.token = window.sessionStorage.getItem("token");
	$scope.gameID = window.sessionStorage.getItem("gameID");

	this.tab = 1;
	/**
	 * selects the tab with the number setTab
	 * @param {int} setTab
	 */
	this.selectTab = function (setTab) {
		this.tab = setTab;
	};
	/**
	 * checks if the tab with the number checktab is selected
	 * @param {int} checkTab
	 * @returns {Boolean}
	 */
	this.isSelected = function (checkTab) {
		return this.tab === checkTab;
	};

	/**
	 * loads all data from this game and stores it into $scope.game
	 */
	this.loadgame = function () {
		$http.get("http://giv-mgl.uni-muenster.de:8080/games/" + $scope.gameID + "/?access_token=" + $scope.token).success(function (data) {
			console.log(data);
			if (data.success)
			{
				$scope.game = data.game;
				console.log($scope.game);
				this.averageRating = $scope.game[0].metadata.rating.toFixed(2);
				console.log(this.averageRating);
				// star rating for displaying the average of the rating
				$("#averageRating").rateYo({
					rating: this.averageRating,
					precision: 2,
					readOnly: true
				});
				window.sessionStorage.setItem("userID", data.game[0].metadata.owner);
			}
			;
		});
	};

	/**
	 * loads all Comments from this game and stores them into $scope.comments
	 */
	this.loadComments = function () {
		this.tab = 2;
		$http.post("http://giv-mgl.uni-muenster.de:8080/comment", {
			access_token: $scope.token,
			operation: "get",
			game_id: $scope.gameID
		}).success(function (data) {
			console.log(data);
			if (data.success)
			{
				$scope.comments = data.comments;
				console.log($scope.comments);
				initialiseComments($scope.comments);
			}
			;
		});
	};

	/**
	 * gets an array of objects and displays the comments in gameinfo.html into a div
	 * @param {object} data
	 */
	var initialiseComments = function (data) {
		$('#comments').html('');
		console.log($('#comments'));
		$.each(data, function (i, item) {
			var farbe;
			if(i % 2)
			farbe = 'style="background-color: #fefefe"';
			else{
			farbe = 'style="background-color: #e0e0e0"';
			}
			$panel = $('<div '+farbe+'></div>');
			$head = $('<div class="row" '+farbe+'><div>');
			$author = $('<div class="authordiv"><div class="small-12 columns right" '+farbe+'></div></div>').html(data[i].user.profile.name);
			$rating = $('<div class="small-12 columns left" '+farbe+'></div>').html('<div id="' + data[i]._id + '"></div>');
			$body = $('<div class="row" '+farbe+'><div>');
			$text = $('<div class="commentdiv"><div  '+farbe+'></div></div>').html(data[i].text);
			$body.append($text);
			$head.append($author);
			$head.append($rating);
			$panel.append($head);
			$panel.append($body);
			$('#comments').append($panel);
		});
		$.each(data, function (i, item) {
			console.log(data[i]._id);
			$('#' + data[i]._id).rateYo({
				rating: data[i].rating,
				precision: 2,
				readOnly: true
			});
		});
	};

	//star rating for making a comment
	$("#setRating").rateYo({
		precision: 2,
		starWidth: "30px",
		onSet: function (rating) {
			$scope.rating = rating;
			console.log($scope.rating);
		}
	});

	/*
	 * send the input of the new comment to the server
	 * but first checks if a rating is set by the user
	 */
	this.submitComment = function () {
		$('#alert').html('');
		console.log($scope.rating);
		if ($scope.rating === 0) {
			$alert = $('<div data-alert class="alert-box info radius"></div>').html('Bitte geben Sie eine Bewertung ein!');
			$('#alert').append($alert);
		}
		else {
			$http.post("http://giv-mgl.uni-muenster.de:8080/comment", {
				access_token: $scope.token,
				operation: "new",
				game_id: $scope.gameID,
				text: $scope.comment,
				rating: $scope.rating,
				time: Date.now()
			}).success(function (data) {
				console.log(data);
				if (data.success)
				{
					// gibt es eine bessere Lösung?
					window.location.href = "#gameinfo";
				}
				;
			});
		}
		;
	};


	/**
	 * tells the server to put this game onto a table of the subscribed games of this user
	 * @param {boolean} play :parameter play defines if your on a desktop or an mobile device... if play is true subscribe is also the play functionality
	 * if play is false, this function only subscribes the user but he cannot play the game
	 */
	var subscribe = function (play) {
		$http.post("http://giv-mgl.uni-muenster.de:8080/games/" + $scope.gameID, {
			access_token: $scope.token,
			operation: "subscribe",
			game_id: $scope.gameID
		}).success(function (data) {
			console.log(data);
			if (play) {
				//weiterleitung zum spiel
				play();
			}
			else{
				window.location.href = "#gameinfo";
			}

		});

	};
	
	/**
	 * weiterleitung zum spiel
	 */
	var play = function(){
		window.location.href = "#game";
	};


	/**
	 * unsubscribes the user from this game
	 */
	var unsubscribe = function () {
		console.log("hallo");
		$http.post("http://giv-mgl.uni-muenster.de:8080/games/" + $scope.gameID, {
			access_token: $scope.token,
			operation: "unsubscribe",
			game_id: $scope.gameID
		}).success(function (data) {
			console.log(data);
			window.location.href = "#gameinfo";
		});

	};


	/**
	 * checks if the user already has subscribed this game
	 * and creates the buttons subscribe or unsubscribe depending on subscribe is true or false
	 */
	this.gamesubscribed = function () {
		$http.get("http://giv-mgl.uni-muenster.de:8080/user/games/subscribed/?access_token=" + $scope.token).success(function (data) {
			console.log(data);
			if (data.success)
			{
				$scope.sgames = data.games;
				var subscribed = false;
				$.each($scope.sgames, function (i) {
					if ($scope.gameID === $scope.sgames[i]._id)
					{
						//console.log("GameinfoID:" + $scope.gameID + " Abonniertgame:" + $scope.sgames[i]._id);
						subscribed = true;
					}
				});
				console.log(subscribed);
				$('#button').html('');
				if (subscribed === false)
				{
					$button = $('<div class="small-12 small-centered columns "></div>');
					$content = $('<a id="sbutton" class="button radius tiny expand">Abonnieren</a>');
					$button.append($content);
					$('#button').append($button);
					$("#sbutton").on('click', function(){
						console.log('subscribe');
						//spielen nur bei subscribe(true) möglich
						subscribe(false);
						
					});
				}
				else {
					$button = $('<div class="small-12 columns centered"></div>');
					$content1 = $('<a id="unbutton" class="button radius tiny expand">Deabonnieren</a>');
					$button.append($content1);
					$('#button').append($button);
					$("#unbutton").on('click', function(){
						console.log('unsubscribe');
						unsubscribe();
					});
					
				}
			}
			;
		});
	};

	/**
	 * loads the profile of the user with setting the user id to null
	 */
	this.profile = function () {
		window.sessionStorage.setItem("userID", null);
		window.location.href = "#profile";
	};
});


