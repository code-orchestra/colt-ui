'use strict';

app.controller("AppCtrl", function($scope, nodeApp, Analytics, $http, $q) {
	
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

			if(/(^\w[:].+)|(^\/)/.exec(projectPath)){
				$scope.projectBaseDir = projectPath.replace(/([^\/\\]+)\.colt$/, "");
			}

			console.log(model);
		});
	}

	$scope.showSerialNumberDialog = function() {
		var win = $scope.openPopup('popups.html#/enter-serial-number-dialog', "Close COLT");
		var d = $q.defer();
		win.popup = {
			enterSerialNumber: function(serial){
				console.log("serial number", serial);
				d.resolve(serial);
				win.close();
			}
		}
		return d.promise
	}

	/*
	* type - error, info, warning, app
	*/
	$scope.showMessageDialog = function(type, message, stacktrase) {
		var win = $scope.openPopup('popups.html#/alert-dialog', "COLT");
		var d = $q.defer();
		win.popup = {
			close: function(){
				console.log("close alert");
				d.resolve();
				win.close();
			}
		}
		$scope.popup.type = type
		$scope.popup.message = message
		return d.promise;
	}

	$scope.showPurchaseDialog = function() {
		var win = $scope.openPopup('popups.html#/purchase-dialog', "Purchase COLT");
		var d = $q.defer();
		win.popup = {
			enterSerialNumber: function(serial){
				console.log("serial number", serial);
				d.resolve(serial);
				win.close();
			},
			buy: function(){
				console.log("purchase COLT");
				d.notify("https://www.plimus.com/jsp/buynow.jsp?contractId=3190926");
				win.close();
			},
			demo: function(){
				console.log("continue demo");
				d.reject();
				win.close();
			}
		}
		return d.promise;
	}

	$scope.showContinueWithDemoDialog = function(message) {
		var win = $scope.openPopup('popups.html#/continue-with-demo-dialog', "COLT Demo");
		var d = $q.defer();
		win.popup = {
			enterSerialNumber: function(serial){
				console.log("serial number", serial);
				d.resolve(serial);
				win.close();
			},
			buy: function(){
				console.log("purchase COLT");
				d.notify("https://www.plimus.com/jsp/buynow.jsp?contractId=3190926");
				win.close();
			},
			demo: function(){
				console.log("continue demo");
				d.reject();
				win.close();
			}
		}
		return d.promise;
	}	

	$scope.showCloseColtDialog = function() {
		var win = $scope.openPopup('popups.html#/close-save-dialog',"Close COLT");
		win.popup = {
			cancel: function(){
				console.log("cancel close");
				win.close();
			},
			close: function(){
				console.log("close");
				win.close();
			},
			save: function(){
				console.log("save project");
				win.close();
			},
			dontSave: function(){
				console.log("dont save");
				win.close();
			}
		}
	}

	$scope.showWelcomeScreen = function() {
		var win = $scope.openPopup('popups.html#/welcome-screen',"Welcome");
	}

	var chooseFile = function(name) {
		var d = $q.defer();
		var chooser = $(name);
		chooser.change(function(evt) {
			var filePath = $(this).val();
			if(filePath){
				d.resolve(filePath);
			}else{
				d.reject(filePath);
			}
		});

		chooser.trigger('click');
		return d.promise;
	}

	$scope.showOpenProjectDialog = function(){
		chooseFile("#openProjectInput").then(function (path) {
			$scope.sendToJava("load -file:" + path, "loaded")
			.then(function () {
				$scope.loadProject(path) 
			})
		});
	}

	$scope.showNewProjectDialog = function(){
		chooseFile("#newProjectInput").then(function (path) {
			$scope.sendToJava("create -file:" + path, "created")
			.then(function () {
				$scope.loadProject(path) 
			})
		})
	}

	$scope.showSaveAsProjectDialog = function(){
		return chooseFile("#saveAsProjectInput");
	}

	nodeApp.buildNode($scope);

	var projectPath = $scope.getProjectPath();

	if(projectPath){
		console.log("load project: " + projectPath);
		$scope.loadProject(projectPath);
	}
})