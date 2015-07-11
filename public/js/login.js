App.controller('loginController', function ($scope, $http) {
	
	// this function sends the email and password to the server and if they are okey, 
	// the server returns an acces_token
	// if the login is false, the server returns an error message
	$scope.login = function () {
		$http.post("http://giv-mgl.uni-muenster.de:8080/login", {email: $scope.email, password: $scope.password})
				.success(function (data) {
					if (data.success){
					window.sessionStorage.setItem("token", data.token);
					window.sessionStorage.setItem("userID", null);
					window.location.href = "#gameselection";
				}
				else{
					console.log(data.message);
					$scope.message = data.message;
					$scope.error = true;
				};
				});
	};
});
