'use strict';

app.service("coltDialogs", function($q) {
	this.buildDialogs = function($scope){
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

		/* type - error, info, warning, app */
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
				},
				close: function(){
					console.log("close");
					d.reject();
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
				},
				close: function(){
					console.log("close");
					d.reject();
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

		$scope.showWelcomeScreen = function(rescentProjects) {
			var win = $scope.openPopup('popups.html#/welcome-screen',"Welcome");
			win.popup = {
				close: function(){
					console.log("close");
					win.close();
				},
				newProject: function(){
					console.log("new project");
					win.close();
				},
				openDemoProjects: function(){
					console.log("open demo project");
					win.close();
				},
				openProject: function(){
					console.log("open project");
					win.close();
				},
				openRescentProject: function(index){
					console.log("open rescent project", rescentProjects[index]);
					win.close();
				}
			}
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