'use strict';

app.controller("AppCtrl", function($scope, nodeApp, Analytics, $http) {
	
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
	};

	$scope.updateFilters = function() {
		var messages = $scope.logMessages;
		$scope.filter.errorsCount = messages.filter(function(e) {return e.level=="ERROR"}).length;
		$scope.filter.warningCount = messages.filter(function(e) {return e.level=="WARNING"}).length;
		$scope.filter.infoCount = messages.filter(function(e) {return e.level=="INFO"}).length;
		$scope.filter.liveCount = messages.filter(function(e) {return e.level=="LIVE"}).length;
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
		}
	};

	$scope.$on('$stateChangeSuccess', function(event, toState){ 
		$scope.pageName = toState.pageName;
		$scope.pageIndex = toState.pageIndex;
		Analytics.trackPage(toState.url + ".html");
	});

	nodeApp.buildNode($scope);

	$scope.loadProject = function(projectPath) {
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
			console.log("success load project: " + projectPath, res);
			var model = $scope.model;
			for(var v in res.xml){
				model[v] = res.xml[v];
			}

			initValues(model,['build'],['use-custom-output-path','use-real-time-transformation'],false);
			initValues(model,['build','offline-cms'],['integrate-mercury','run-mercury'],false);
			initValues(model,['build','security'],['use-inspectable'],false);
			initValues(model,['build','precompile'],['coffee-script','type-script','use-less','use-sass'],false);
			initValues(model,['live','live'],['paused','live-html-edit','disable-in-minified','enable-debuger'],false);
			initValues(model,['live','launch'],[]);
			initValues(model,['live','settings'],['disconnect','clear-log'],false);

			console.log(model);
		});
	}

	var projectPath = $scope.getProjectPath();

	if(projectPath){
		console.log("load project: " + projectPath);
		$scope.loadProject(projectPath);
	}

	// popups.html#/close-save-dialog (in progress)
	// popups.html#/purchase-dialog
	// popups.html#/update-dialog
	// popups.html#/welcome-screen (in progress)
	$scope.testPopup = function() {
		var win = $scope.openPopup('popups.html#/purchase-dialog', 555, 300, "Close COLT");
		win.popup = {
			enterSerialNumber: function(serial){
				console.log("serial number", serial);
				win.close();
			},
			buy: function(){
				console.log("purchase COLT");
				win.close();
			},
			demo: function(){
				console.log("continue demo");
				win.close();
			}
		}
	}	

	$scope.testPopup2 = function() {
		var win = $scope.openPopup('popups.html#/close-save-dialog', 550, 150, "Close COLT");
		win.popup = {
			cancel: function(){
				console.log("cancel close", w);
				win.close();
			},
			save: function(){
				console.log("save project", w);
				win.close();
			},
			dontSave: function(){
				console.log("dont save");
				win.close();
			}
		}
	}
})