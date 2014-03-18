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
	$urlRouterProvider.otherwise("/welcome-screen");
	$stateProvider
		.state('welcome-screen', {
			url: "/welcome-screen",
			templateUrl: "popups/welcome-screen.html",
			pageName: "Welcome Screen",
			controller: "WelcomeController"
		})
		.state('purchase-dialog', {
			url: "/purchase-dialog",
			templateUrl: "popups/purchase-dialog.html",
			pageName: "Purchase COLT",
			controller: "PurchaseController"
		})
		.state('update-dialog', {
			url: "/update-dialog",
			templateUrl: "popups/update-dialog.html",
			pageName: "Update COLT",
			controller: "UpdateController"
		})
		.state('close-save-dialog', {
			url: "/close-save-dialog",
			templateUrl: "popups/close-save-dialog.html",
			pageName: "Close COLT",
			controller: "CloseSaveController"
		})
});

app.run(function($rootScope, Analytics) {
	$rootScope.$on('$stateChangeSuccess', function(event, toState){ 
		$rootScope.pageName = toState.pageName;
		$rootScope.pageIndex = toState.pageIndex;
		Analytics.trackPage(toState.url + ".html");
	});
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

app.controller("PurchaseController", function($scope, $rootScope, $window) {
	console.log("purchase colt dialog");	
});

app.controller("UpdateController", function($scope, $rootScope, $window) {
	console.log("update colt dialog");	
});

app.controller("CloseSaveController", function($scope, $rootScope, $window) {
	console.log("close/save colt dialog");	
});

