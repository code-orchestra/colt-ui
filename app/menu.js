'use strict';

app.service("appMenu", function($q) {
		this.buildMenu = function($scope) {
			
			var gui = require('nw.gui'); 
			var win = gui.Window.get();

			var menu  = new gui.Menu({ type: 'menubar' });
			menu.append(new gui.MenuItem({ label: 'Item A' }));
			menu.append(new gui.MenuItem({ label: 'Item B' }));
			menu.append(new gui.MenuItem({ type: 'separator' }));
			menu.append(new gui.MenuItem({ label: 'Item C' }));
			win.menu = menu;
		}
});