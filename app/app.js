'use strict';

var app = angular.module("COLT", [
	'colt.directives', 
	'log.view.directive',
	'log.visualizer.directive', 
	'ui.router', 
	'pasvaz.bindonce',
	'angulartics.google.analytics'
	]);

app.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise("/settings");
	$stateProvider
	.state('settings', {
		url: "/settings",
		templateUrl: "partials/settings.html",
		pageName: "Project Settings",
		pageIndex: 0
	})
	.state('build', {
		url: "/build",
		templateUrl: "partials/build.html",
		pageName: "Production Build",
		pageIndex: 1
	})
	.state('log', {
		url: "/log",
		templateUrl: "partials/log.html",
		pageName: "Log",
		pageIndex: 2
	});
});

app.config(function ($analyticsProvider) {
  // turn off automatic tracking
  $analyticsProvider.virtualPageviews(false);
});
