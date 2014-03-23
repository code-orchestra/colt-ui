'use strict';

app.service("appMenu", function($q) { 
	if(top['require']){
		var gui = require('nw.gui');
		var win = gui.Window.get();
		var self = this
		this.buildMenu = function($scope, array) {

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
			fileSubMenu.append(new gui.MenuItem({
				label: 'Save Project',
				click: function () {
					//$scope.sendToJava("save") 
				}
			}));
			fileSubMenu.append(new gui.MenuItem({
				label: 'Save As...',
				click: function () {
					//todo: implement 
				}
			}));
			fileSubMenu.append(new gui.MenuItem({
				label: 'Close Project',
				click: function () {
					//todo: implement 
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
			run.submenu = runSubMenu
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
					//todo: implement 
				}
			}));
			helpSubMenu.append(new gui.MenuItem({
				type: 'separator',
				click: function () {
					//todo: implement 
				}
			}));
			helpSubMenu.append(new gui.MenuItem({
				label: 'Proxy settings',
				click: function () {
					//todo: implement 
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
		}

		var initRecentProjects = function ($scope, array) {
			var recentProjectsSubMenu = new gui.Menu();

			array.forEach(function (entry) {
				console.log(entry)
				recentProjectsSubMenu.append(new gui.MenuItem({
					label: entry,
					click: function () {
						$scope.sendToJavaWithPromise("load -file:" + entry, "loaded")
						.then(function () {
							$scope.loadProject(entry)
						}) 
					}
				}));
			})
			
			if (recentProjectsSubMenu.items.length > 0) {
				recentProjectsSubMenu.append(new gui.MenuItem({ type: 'separator' }))
			};
			recentProjectsSubMenu.append(new gui.MenuItem({
				label: 'Clear List',
				enabled: recentProjectsSubMenu.items.length > 0,
				click: function () {
					self.buildMenu($scope, [])
				}
			}));
			return recentProjectsSubMenu
		}
	}
});