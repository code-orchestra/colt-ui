'use strict';

app.service("appMenu", function($q) { 
	if(top['require']){
		var gui = require('nw.gui');
		var win = gui.Window.get();
        var recentProjectsPaths = [];

		this.buildMenu = function($scope, array) {
            recentProjectsPaths = array;
			console.log("build menu");
			
			var menu  = new gui.Menu({ type: 'menubar' });
			
			var file = new gui.MenuItem({label: 'File'});
			var fileSubMenu = new gui.Menu();
			fileSubMenu.append(new gui.MenuItem({
				label: 'New Project',
				click: function () {
					$scope.showNewProjectDialog();
				}
			}));
			fileSubMenu.append(new gui.MenuItem({ type: 'separator' }));
			fileSubMenu.append(new gui.MenuItem({
				label: 'Open Project',
				click: function () {
					$scope.showOpenProjectDialog();
				}
			})); 
			
			var recentProjects = new gui.MenuItem({ label: 'Open Recent' });
			recentProjects.submenu = initRecentProjects($scope, array);
			fileSubMenu.append(recentProjects);

			fileSubMenu.append(new gui.MenuItem({ type: 'separator' }));
//			fileSubMenu.append(new gui.MenuItem({
//				label: 'Save Project',
//				click: function () {
//					//$scope.sendToJava("save")
//				}
//			}));
			fileSubMenu.append(new gui.MenuItem({
				label: 'Save As...',
				click: function () {
                    $scope.showSaveAsProjectDialog()
                }
			}));
			fileSubMenu.append(new gui.MenuItem({
				label: 'Close Project',
				click: function () {
                    $scope.showWelcomeScreen(recentProjectsPaths, true)
				}
			}));
			
			file.submenu = fileSubMenu;
			menu.append(file);

			var run = new gui.MenuItem({ label: 'Build' });
			var runSubMenu = new gui.Menu();
			runSubMenu.append(new gui.MenuItem({ 
				label: 'Production Buil',
				enabled: false,
				click: function () {
					//todo: implement 
				}
			}));
			run.submenu = runSubMenu;
			menu.append(run);

			var help = new gui.MenuItem({ label: 'Help' });
			var helpSubMenu = new gui.Menu();
			helpSubMenu.append(new gui.MenuItem({
				label: 'Open Demo Projects Directory',
				click: function () {
					//todo: implement 
				}
			}));
			helpSubMenu.append(new gui.MenuItem({
				label: 'Open Welcome Screen',
				click: function () {
					$scope.showWelcomeScreen(recentProjectsPaths)
				}
			}));
			helpSubMenu.append(new gui.MenuItem({
				type: 'separator'
			}));
			helpSubMenu.append(new gui.MenuItem({
				label: 'Proxy settings',
				click: function () {
                    $scope.sendToJava("getProxy", "proxy")
                        .then($scope.showProxyDialog)
                        .then(function (settings) {
                            $scope.sendToJava("setProxy " + JSON.stringify(settings));
                        });
				}
			}));
			helpSubMenu.append(new gui.MenuItem({
				label: 'Check for updates',
				click: function () {
					//todo: implement 
				}
			}));
			helpSubMenu.append(new gui.MenuItem({
				label: 'Enter Serial Number',
				click: function () {
					$scope.showSerialNumberDialog()
					.then(function(serial) {
						$scope.sendToJava("serialNumber " + serial)
					}) 
				}
			}));
			help.submenu = helpSubMenu;
			menu.append(help);

			win.menu = menu;
		};

		var initRecentProjects = function ($scope, array) {
			var recentProjectsSubMenu = new gui.Menu();

			array.forEach(function (entry) {
				recentProjectsSubMenu.append(new gui.MenuItem({
					label: entry,
					click: function () {
						$scope.sendToJava("load -file:" + entry)
					}
				}));
			});
			
			if (recentProjectsSubMenu.items.length > 0) {
				recentProjectsSubMenu.append(new gui.MenuItem({ type: 'separator' }))
			}
			recentProjectsSubMenu.append(new gui.MenuItem({
				label: 'Clear List',
				enabled: recentProjectsSubMenu.items.length > 0,
				click: function () {
					$scope.sendToJava("clearRecentProjectsPaths");
				}
			}));
			return recentProjectsSubMenu;
		}
	}
});