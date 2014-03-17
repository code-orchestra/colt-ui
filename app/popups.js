'use strict';

var app = angular.module("popups", [
	'colt.directives', 
	'ui.router', 
	'pasvaz.bindonce',
	'angular-google-analytics'
	]);

app.config(function(AnalyticsProvider) {
	AnalyticsProvider.setAccount('UA-40699654-4');
	AnalyticsProvider.trackPages(true);
});

app.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise("/welcomescreen");
	$stateProvider
		.state('welcome-screen', {
			url: "/welcome-screen",
			templateUrl: "popups/welcome-screen.html",
			pageName: "Weblome Screen",
			controller: "WelcomeController"
		})
});

app.controller("WelcomeController", function($scope, $rootScope, $window) {
	console.log("welcome screen");

	//@todo: брать из параметров, которые даст главное окно или вычислять
	$scope.rescentProjects = [
		{name:"My Rescent Project"},
		{name:"Index"}
	];

	$scope.openLink = function(url) {
		$window.open(url);
	}

	$scope.newProject = function() {
		//@todo:
	}

	$scope.openDemoProjects = function(){

	}

	$scope.openRescentProject = function(index) {
		console.log("open rescent project: "+ index);
	}

	$scope.openProject = function() {
		console.log("open project");
	}
});