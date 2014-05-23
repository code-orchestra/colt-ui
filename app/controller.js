'use strict';

app.controller("AppCtrl", function($scope, nodeApp, coltDialogs, $http, $q, $state, $timeout, $analytics) {
	
	var initValues = function(point, path, properties, value) {
		for (var i = 0; i < path.length; i++) {
			var step = path[i];
			if(!point.hasOwnProperty(step)){
				point[step] = {};
			}
			point = point[step];
		};
		for (var j = 0; j < properties.length; j++) {
			var prop = properties[j];
			if(!point.hasOwnProperty(prop)){
				point[prop] = value;
			}else if(point[prop]=="false"){
				point[prop] = false;
			}else if(point[prop]=="true"){
				point[prop] = true;
			}
		};
	}

	$scope.model = {};
	$scope.logMessages = [];
	$scope.filter = {};

	$scope.log = function(level, message, source) {
		var m = {level:level, message: message, source: source || "COLT"};
		$scope.logMessages.push(m);
		$scope.$broadcast("logMessage", m);
		$scope.updateFilters();
	};

	$scope.clearLog = function(){
		$scope.logMessages = [];
		$scope.updateFilters();
	}

	window.onerror = function(msg, url, line) {
		console.log("ERROR", "COLT UI Error: " + msg, url+":"+line);
		$scope.log("ERROR", "COLT UI Error: " + msg, url+":"+line);
	}

	$scope.updateFilters = function() {
		var messages = $scope.logMessages;
		$scope.filter.errorsCount = messages.filter(function(e) {return e.level=="ERROR"}).length;
		$scope.filter.warningCount = messages.filter(function(e) {return e.level=="WARNING"}).length;
		$scope.filter.infoCount = messages.filter(function(e) {return e.level=="INFO"}).length;
		$scope.filter.liveCount = messages.filter(function(e) {return e.level=="LIVE"}).length;
		$scope.filter.debugCount = messages.filter(function(e) {return e.level=="DEBUG"}).length;
	};

	$scope.updateFilters();

	$scope.selectLogFilter = function(filter) {
		$scope.logFilter = filter;
	}

	$scope.sessionInProgress = false;
	$scope.sessionStateSwitching = false;

	$scope.startSession = function() {
		if(!$scope.sessionStateSwitching){
			if($scope.sessionInProgress){
				console.log("stop session");
				$scope.sendToJava("stopSession");
			}else{
				console.log("start session");
				$scope.sendToJava("runSession");
			}
			$scope.sessionStateSwitching = true;
			$scope.sessionInProgress = false;
			$scope.openLogTab();
		}
	};

	$scope.openLogTab = function() {
		$timeout(function() {
			$state.go("log");
		});
	}

	$scope.$on('$stateChangeSuccess', function(event, toState){ 
		$scope.pageName = toState.pageName;
		$scope.pageIndex = toState.pageIndex;
		$analytics.pageTrack(toState.pageName);
		console.log("ga: " + toState.pageName)
	});

	$scope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams){ 
		console.log("state not found", unfoundState); 
	});

	var autoSave = false;
	$scope.$watch('model', function() {
        if(autoSave){
        	$scope.saveProject($scope.getProjectPath(), $scope.model);
        }
    }, true);
	
	$scope.saveBeforeClose = function() {
		if(needSave){
			$scope.showCloseColtDialog();
			return true;
		}
		return false;
	}	

	$scope.loadProject = function(projectPath) {
        autoSave = false;
        $http.get(projectPath,
			{transformResponse:function(data) {
				var x2js = new X2JS();
				var json = x2js.xml_str2json( data );
				return json;
			}
		})
		.error(function(data, status) {
			$scope.log("error load project: " + projectPath);
			console.log("error load project: " + projectPath);
		})
		.success(function(res) {
			autoSave = false;
			console.log("success load project: " + projectPath, res);
			var model = $scope.model;
			for(var v in res.xml){
				model[v] = res.xml[v];
			}

			initValues(model,['build'],['use-custom-output-path','use-real-time-transformation'],false);
			initValues(model,['build','offline-cms'],['integrate-mercury','run-mercury'],false);
			initValues(model,['build','security'],['use-inspectable'],false);
			initValues(model,['build','precompile'],['coffee-script','type-script','use-less','use-sass'],false);
			initValues(model,['live','live'],['paused','disable-in-minified','enable-debuger','simple-reload'],false);
			initValues(model,['live','launch'],[]);
			initValues(model,['live','settings'],['disconnect','clear-log'],false);

			model.live.live['max-loop'] *= 1;

			if(/(^\w[:].+)|(^\/)/.exec(projectPath)){
				$scope.projectBaseDir = projectPath.replace(/([^\/\\]+)\.colt$/, "");
			}

			console.log(model);
			$scope.$broadcast("projectLoaded", model);

			setTimeout(function () {
				autoSave = true;
			}, 500)
		});
	}
	coltDialogs.buildDialogs($scope);
	nodeApp.buildNode($scope);
})