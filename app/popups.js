'use strict';

var app = angular.module("popups", [
	'ui.router', 
	'angular-google-analytics'
	]);

// app.config(function(AnalyticsProvider) {
// 	AnalyticsProvider.setAccount('UA-40699654-4');
// 	AnalyticsProvider.trackPages(true);
// });

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
	.state('continue-demo-dialog', {
		url: "/continue-demo-dialog",
		templateUrl: "popups/continue-demo-dialog.html",
		pageName: "Purchase COLT",
		controller: "ContinueDemoController"
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
	.state('alert-dialog', {
		url: "/alert-dialog",
		templateUrl: "popups/alert-dialog.html",
		pageName: "Alert",
		controller: "CloseSaveController"
	})
});

app.run(function($rootScope, Analytics) {
	$rootScope.$on('$stateChangeSuccess', function(event, toState){ 
		$rootScope.pageName = toState.pageName;
		$rootScope.pageIndex = toState.pageIndex;
		// Analytics.trackPage(toState.url + ".html");
		$rootScope.onResize();
	});

	$(document).bind("resize", function() {
		console.log("on resize", arguments);
		$rootScope.onResize();
	});
	
	$rootScope.onResize = function() {
		var win = $(".popup-window");
		if(win.size() > 0){
			if(window.popupInfo){
				window.popupInfo.onResize($(win)[0].scrollWidth, $(win)[0].scrollHeight);
			}
		}else{
			console.log("popup window not found")
		}
	}
	
	$rootScope.callToOwnerWindow = function(command, arg) {
		if(window.hasOwnProperty("popup")){
			if(window.popup.hasOwnProperty(command)){
				window.popup[command](arg);
			}else{
				console.log("'" + command + "' command not found");
			}
		}else{
			console.log("popup property not found");
		}
		// if(sessionStorage.hasOwnProperty("popup")){
		// 	if(sessionStorage.popup.hasOwnProperty(command)){
		// 		sessionStorage.popup[command](arg);
		// 	}
		// }
	}

	if(window.popup){
		$rootScope.popup = popup;
	}
});

app.controller("WelcomeController", function($scope, $rootScope, $window) {
	console.log("welcome screen");

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

	$scope.serialNumber = '';

	$scope.enterSerialNumber = function() {
		$scope.callToOwnerWindow("enterSerialNumber", $scope.serialNumber);
	}
	$scope.buy = function() {
		$scope.callToOwnerWindow("buy");
	}
	$scope.demo = function() {
		$scope.callToOwnerWindow("demo");
	}

	$scope.message = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque, illo, dolorum modi inventore amet provident ducimus adipisci ab? Eligendi, sed, nobis eius deserunt iste dolor inventore incidunt sequi quam aliquid?"
});

app.controller("ContinueDemoController", function($scope, $rootScope, $window) {
	console.log("purchase colt dialog");

	$scope.serialNumber = '';

	$scope.enterSerialNumber = function() {
		$scope.callToOwnerWindow("enterSerialNumber", $scope.serialNumber);
	}
	$scope.buy = function() {
		$scope.callToOwnerWindow("buy");
	}
	$scope.demo = function() {
		$scope.callToOwnerWindow("demo");
	}
});

app.controller("UpdateController", function($scope, $rootScope, $window) {
	console.log("update colt dialog");
});

app.controller("CloseSaveController", function($scope, $rootScope, $window) {
	console.log("close/save colt dialog");	

	$scope.dontSave = function() {
		$scope.callToOwnerWindow("dontSave");
	}
	$scope.save = function() {
		$scope.callToOwnerWindow("dontSave");
	}
	$scope.cancel = function() {
		$scope.callToOwnerWindow("cancel");
	}
});

