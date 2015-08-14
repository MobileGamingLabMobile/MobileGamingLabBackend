App.controller('signUpController', function ($scope, $http) {

// sends the email and password to the server
// if success is true, the user is loged in by returning an access_token
// if success is false, an error and error-message is displayed
	$scope.submit = function () {
		$http.post("http://giv-mgl.uni-muenster.de:8080/signup", {email: $scope.email, password: $scope.password})
				.success(function (data) {
					console.log(data);
					if (data.success) {
						window.sessionStorage.setItem("token", data.token);
						window.sessionStorage.setItem("userID", null);
						window.location.href = "#changeProfile";
					}
					else {
						console.log(data.message);
						$scope.message = data.message;
						$scope.error = true;
					}
					;
				});
	};

	// controlls if the suggested passwords of the users input are the same
	$scope.notsame = function () {
		return ($scope.password !== $scope.password2);
	};

});