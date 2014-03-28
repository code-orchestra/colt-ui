'use strict';

var app = angular.module("COLT", [
	'colt.directives', 
	'log.view.directive',
	'log.visualizer.directive', 
	'ui.router', 
	'pasvaz.bindonce',
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
})

/**
 * Repeat <tt>str</tt> several times.
 * @param {string} str The string to repeat.
 * @param {number} [times=1] How many times to repeat the string.
 * @returns {string}
 */
function functionName (argument) {
	$("hello").click();
	_.pluck();
}
