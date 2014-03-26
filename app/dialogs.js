'use strict';

app.service("coltDialogs", function($q) {
	this.buildDialogs = function($scope){
		$scope.showSerialNumberDialog = function() {
			var popup = $scope.openPopup('popups.html#/enter-serial-number-dialog', "Close COLT");
			var d = $q.defer();
			popup.enterSerialNumber = function(serial){
				console.log("serial number", serial);
				d.resolve(serial);
				popup.window.close();
			}
			return d.promise;
		}


		$scope.showUpdateDialog = function() {
			var popup = $scope.openPopup('popups.html#/update-dialog', "Update COLT");
			var d = $q.defer();
			$.extend(popup, {
				cancel: function(){
					console.log("close update");
					d.resolve();
					popup.window.close();
				},
				update: function(){
					console.log("update!");
					d.resolve();
					popup.window.close();
				}
			});
			return d.promise;
		}

		$scope.showProxyDialog = function(settings) {
			var popup = $scope.openPopup('popups.html#/proxy-settings-dialog', "Proxy Settings");
			var d = $q.defer();
			$.extend(popup, {
				save: function(value){
					console.log("save proxy settings");
					d.resolve(value);
					popup.window.close();
				}
			}, settings);

			return d.promise;
		}

		/* type - error, info, warning, app */
		$scope.showMessageDialog = function(type, message, stacktrase) {
			var popup = $scope.openPopup('popups.html#/alert-dialog', "COLT");
			var d = $q.defer();
			$.extend(popup, {
				close: function(){
					console.log("close alert");
					d.resolve();
					popup.window.close();
				},
				type: type,
				message: message
			});
			console.log("type", type)
			return d.promise;
		}

		$scope.showPurchaseDialog = function() {
			var popup = $scope.openPopup('popups.html#/purchase-dialog', "Purchase COLT");
			var d = $q.defer();
			$.extend(popup, {
				enterSerialNumber: function(serial){
					console.log("serial number", serial);
					d.resolve(serial);
					popup.window.close();
				},
				buy: function(type){
					console.log("purchase COLT");
					console.log("type", type);
					if(type == 'mo'){
						$scope.openBrowserWindow("https://www.plimus.com/jsp/buynow.jsp?contractId=3190926");
					}else if(type == 'year'){
						$scope.openBrowserWindow("https://www.plimus.com/jsp/buynow.jsp?contractId=3193830");
					}
					d.reject();
					popup.window.close();
				},
				demo: function(){
					console.log("continue demo");
					d.reject();
					popup.window.close();
				},
				close: function(){
					console.log("close");
					d.reject();
				}
			});
			return d.promise;
		}

		$scope.showContinueWithDemoDialog = function(message) {
			var popup = $scope.openPopup('popups.html#/continue-with-demo-dialog', "COLT Demo");
			var d = $q.defer();
			$.extend(popup, {
				enterSerialNumber: function(serial){
					console.log("serial number", serial);
					d.resolve(serial);
					popup.window.close();
				},
				buy: function(){
					console.log("purchase COLT");
					d.notify("https://www.plimus.com/jsp/buynow.jsp?contractId=3190926");
					popup.window.close();
				},
				demo: function(){
					console.log("continue demo");
					d.reject();
					popup.window.close();
				},
				close: function(){
					console.log("close");
					d.reject();
				}
			});
			return d.promise;
		}	

		$scope.showCloseColtDialog = function() {
			var popup = $scope.openPopup('popups.html#/close-save-dialog',"Close COLT");
			$.extend(popup, {
				cancel: function(){
					console.log("cancel close");
					popup.window.close();
				},
				close: function(){
					console.log("close");
					popup.window.close();
				},
				save: function(){
					console.log("save project");
					popup.window.close();
				},
				dontSave: function(){
					console.log("dont save");
					popup.window.close();
				}
			});
		};

        $scope.showWelcomeScreen = function(recentProjects, isMain) {
			var popup = $scope.openPopup('popups.html#/welcome-screen',"Welcome");
			var isCloseButton = true;
            $.extend(popup, {
				close: function(){
					console.log("close");
					popup.window.close();
                    return isMain && isCloseButton
				},
				newProject: function(){
					console.log("new project");
                    $scope.showNewProjectDialog();
                    isCloseButton = false;
					popup.window.close();
				},
				openDemoProjects: function(){
					console.log("open demo project");
                    $scope.showOpenDemoProjectDialog();
                    isCloseButton = false;
					popup.window.close();
				},
				openProject: function(){
					console.log("open project");
                    $scope.showOpenProjectDialog();
                    isCloseButton = false;
					popup.window.close();
				},
				openRecentProject: function(index){
					console.log("open recent project", recentProjects[index]);
                    $scope.sendToJava("load -file:" + recentProjects[index]);
                    isCloseButton = false;
					popup.window.close();
				},
				recentProjects: recentProjects.map(function (it) {return {name : it} }),
                openLink: function (url) {
                    console.log("url");
                    $scope.openExternal(url);
                }
			});
			console.log("recentProjects", popup.recentProjects);
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
				$scope.sendToJava("load -file:" + path)
			});
		}

		$scope.showOpenDemoProjectDialog = function(){
			chooseFile("#openDemoProjectInput").then(function (path) {
				$scope.sendToJava("load -file:" + path)
			});
		}

		$scope.showNewProjectDialog = function(){
			chooseFile("#newProjectInput").then(function (path) {
				$scope.sendToJava("create -file:" + path)
			})
		}

		$scope.showSaveAsProjectDialog = function(){
			return chooseFile("#saveAsProjectInput").then(function(path) {
                $scope.saveProject(path, $scope.model);
                $scope.sendToJava("load -file:" + path);
            });
		}

		$scope.testJsDocs = function() {
			$scope.openJsDoc("Lorem ipsum <b>dolor</b> sit amet, <b>consectetur</b> adipisicing <b>elit</b>. Placeat, eos, maiores, doloremque, quaerat beatae a veniam fuga dignissimos aut ipsa autem mollitia alias modi doloribus consequatur laboriosam odio praesentium ea natus reprehenderit voluptatum dolores necessitatibus veritatis quasi magnam neque deleniti facere sapiente nisi animi sit optio tempore quae ullam eum voluptate velit debitis. Rerum, ducimus fugiat qui accusantium sit et quas provident dicta aliquid quos excepturi fugit tempora sint blanditiis id eum recusandae asperiores doloremque quod odio possimus vel voluptatum in ullam aperiam dolor officia minima quisquam dolorum maiores itaque placeat numquam veritatis inventore impedit tenetur sequi. Nulla, est aperiam optio molestias ex iste et beatae iusto illo? Quam, tempore ab corrupti tempora expedita! Tenetur, fugiat, amet molestias sed eius quis beatae quos quod aperiam tempore et cum sunt vitae enim maiores culpa aspernatur doloremque totam numquam quas dolorem aut accusamus ab delectus rerum optio molestiae libero recusandae maxime sint nisi eligendi sequi vero qui illo veniam aliquam. A, enim, illo, vero laborum inventore totam pariatur hic nulla numquam sunt dicta nisi fuga explicabo. Officiis, tempore, dolore, ipsam deserunt maxime impedit ut odit perferendis iure aliquam vero dolor praesentium quae explicabo velit? Ut, blanditiis perspiciatis obcaecati autem delectus quod accusantium.", "JS Doc Title")
		}

		$scope.testJsDocsFile = function(url) {
			$scope.openJsDocFile(url);
		}
	}
});