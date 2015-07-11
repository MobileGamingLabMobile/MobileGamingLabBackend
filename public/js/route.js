// create the module and name it App
// also include ngRoute for all our routing needs
var App = angular.module('App', ['ngRoute']);

// configure our routes
App.config(function ($routeProvider) {
	$routeProvider

			// route for the login page
			.when('/', {
				templateUrl: 'templates/login.html',
				controller: 'loginController'
			})

			.when('/gameselection', {
				templateUrl: 'templates/selectGame.html',
				controller: 'selectGameController'
			})

			.when('/gameinfo', {
				templateUrl: 'templates/gameinfo.html',
				controller: 'gameInfoController'
			})

			.when('/game', {
				templateUrl: 'templates/game.html',
				controller: 'gameController'
			})

			.when('/profile', {
				templateUrl: 'templates/profile.html',
				controller: 'profileController'
			})

			.when('/changeProfile', {
				templateUrl: 'templates/changeProfile.html',
				controller: 'changeProfileController'
			})

			// route for the contact page
			.when('/signup', {
				templateUrl: 'templates/signup.html',
				controller: 'signUpController'
			})
			.when('/impressum', {
				templateUrl: 'templates/impressum.html',
				controller: 'impressumController'
			})
			.otherwise({
				redirectTo: "/"
			});
	;
});

