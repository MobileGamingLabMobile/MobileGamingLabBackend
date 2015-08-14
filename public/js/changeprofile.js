App.controller("changeProfileController", function ($http, $scope) {

    $scope.token = window.sessionStorage.getItem("token");
    $scope.userID = window.sessionStorage.getItem("userID");

    /** sends new Login data to the server
     * success true: server returns new user data
     * success false: server returns error message
     */
    $scope.submitLogin = function () {
        $http.post('http://giv-mgl.uni-muenster.de:8080/profile', {
            operation: "login",
            access_token: $scope.token,
            email: $scope.newEmail,
            old_password: $scope.oldPassword,
            new_password: $scope.newPassword
        }).success(function (data) {
            console.log(data);
            if (data.success) {
                $scope.users = data.user;
                window.location.href = "#profile";
            }
            else {
                $scope.message = data.message;
                $scope.error = true;
            }
            ;
        });
    };

    /** sends the new profil data to the server
     * success true: server returns new user data
     * success false: server returns error message
     */
    $scope.submitProfile = function () {
        $http.post('http://giv-mgl.uni-muenster.de:8080/profile', {
            operation: "profile",
            access_token: $scope.token,
            name: $scope.newName,
            profession: $scope.newProfession,
            country: $scope.newCountry,
            city: $scope.newCity
        }).success(function (data) {
            console.log(data);
            if (data.success) {
                $scope.users = data.user;
                window.location.href = "#profile";
            }
            else {
                $scope.message = data.message;
                $scope.error = true;
            }
            ;
        });
    };

    /**
     * test if inputs of user in the password fields are the same
     * @returns {Boolean}
     */
    this.notsame = function () {
        return ($scope.newPassword !== $scope.newPassword2);
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

