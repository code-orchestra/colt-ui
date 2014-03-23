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

		$scope.showProxyDialog = function() {
			var popup = $scope.openPopup('popups.html#/update-dialog', "Proxy Settings");
			var d = $q.defer();
			$.extend(popup, {
				close: function(){
					console.log("close update");
					d.resolve();
					popup.window.close();
				},
				save: function(){
					console.log("update!");
					d.resolve();
					popup.window.close();
				}
			});
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
				}
			});
			popup.type = type
			popup.message = message
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
		}

		$scope.showWelcomeScreen = function(rescentProjects) {
			var popup = $scope.openPopup('popups.html#/welcome-screen',"Welcome");
			$.extend(popup, {
				close: function(){
					console.log("close");
					popup.window.close();
				},
				newProject: function(){
					console.log("new project");
					popup.window.close();
				},
				openDemoProjects: function(){
					console.log("open demo project");
					popup.window.close();
				},
				openProject: function(){
					console.log("open project");
					popup.window.close();
				},
				openRescentProject: function(index){
					console.log("open rescent project", rescentProjects[index]);
					popup.window.close();
				}
			});
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

		$scope.showNewProjectDialog = function(){
			chooseFile("#newProjectInput").then(function (path) {
				$scope.sendToJava("create -file:" + path)
			})
		}

		$scope.showSaveAsProjectDialog = function(){
			return chooseFile("#saveAsProjectInput");
		}

		$scope.testJsDocs = function() {
			$scope.openJsDoc("Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat, facere ratione itaque laudantium possimus natus illum vero rerum quae deleniti aperiam incidunt atque veniam nisi facilis reiciendis voluptas. Sequi, veritatis, enim numquam molestias nam debitis inventore ipsam aut et quas eos aliquam necessitatibus sapiente quos praesentium labore assumenda molestiae veniam maxime reprehenderit mollitia voluptatum consectetur harum repudiandae eaque id quod? Commodi, magnam, nostrum, eaque nesciunt assumenda nulla sit facilis possimus impedit tempora eligendi minus vero labore dolor tempore qui id ullam facere alias incidunt enim quod hic sint voluptates iure! Voluptas, natus, a, possimus, obcaecati impedit aliquid maxime laboriosam labore porro mollitia ab aspernatur harum optio accusamus temporibus veniam ut! Doloremque, saepe, hic quis in ut voluptates veniam error itaque laboriosam minima illo consequuntur harum consectetur cum esse officiis non accusantium nostrum blanditiis beatae magni optio libero debitis. Laboriosam, deserunt, quidem soluta quo distinctio cupiditate ad perferendis sequi ducimus labore dignissimos veritatis atque id quibusdam delectus reiciendis facilis. Atque, soluta, aliquid accusamus porro iusto magni voluptatum cumque totam ex quod illo distinctio blanditiis at tempore reiciendis repudiandae dicta ullam facere rem explicabo facilis nesciunt voluptatibus optio corporis vel sequi a impedit! Perferendis excepturi molestiae deleniti tempore quia voluptas in iure!", "JS Doc Title")
		}
	}
});