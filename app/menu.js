'use strict';

app.service("appMenu", function($q) {
		this.buildMenu = function($scope) {
			
			var gui = require('nw.gui'); 
			var win = gui.Window.get();

			var menu  = new gui.Menu({ type: 'menubar' });
			
			var file = new gui.MenuItem({label: 'File'});
			var fileSubMenu = new gui.Menu();
			fileSubMenu.append(new gui.MenuItem({
				label: 'New Project',
				click: function () {
					//todo: implement 
				}
			}));
			fileSubMenu.append(new gui.MenuItem({ type: 'separator' }));
			fileSubMenu.append(new gui.MenuItem({
				label: 'Open Project',
				click: function () {
					//todo: implement 
				}
			})); 
			
			var recentProjects = new gui.MenuItem({ label: 'Open Recent' });
			var recentProjectsSubMenu = new gui.Menu();
			recentProjectsSubMenu.append(new gui.MenuItem({
				label: 'Clear List',
				click: function () {
					//todo: implement 
				}
			}));
			recentProjects.submenu = recentProjectsSubMenu;
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
				}
			}));
			help.submenu = helpSubMenu;
			menu.append(help);

			win.menu = menu;
		}
});