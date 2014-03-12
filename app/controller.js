'use strict';

app.controller("AppCtrl", function($scope, nodeApp) {
	
	$scope.logMessages = [];
	$scope.log = function(level, message, source) {
		var m = {level:level, message: message, source: source || "COLT"};
		$scope.logMessages.push(m);
		$scope.$emit("log", m);
	};

	$scope.updateFilters = function() {
			var messages = $scope.logMessages;
			$scope.filter.errorsCount = messages.filter(function(e) {return e.level=="ERROR"}).length;
			$scope.filter.warningCount = messages.filter(function(e) {return e.level=="WARNING"}).length;
			$scope.filter.infoCount = messages.filter(function(e) {return e.level=="INFO"}).length;
			$scope.filter.liveCount = messages.filter(function(e) {return e.level=="LIVE"}).length;
	};

	$scope.filter = {};
	$scope.updateFilters();

	$scope.selectLogFilter = function(filter) {
		$scope.logFilter = filter;
	}

	$scope.session = {};
	$scope.sessionInProgress = false;
	$scope.startSession = function() {
		if($scope.session.sessionInProgress){
			console.log("stop session");
			$scope.sendToJava("stopSession");
		}else{
			console.log("start session");
			$scope.sendToJava("runSession");
		}
	};

	$scope.openPopup = function(html, callback) {
		return nodeApp.openPopup(html, callback);
	};

	nodeApp.buildNode($scope);
})