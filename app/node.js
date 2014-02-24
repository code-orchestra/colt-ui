//zip -r ../tmp/myApp.nw *

if(require){
	var gui = require('nw.gui'); 
	var win = gui.Window.get(); win.showDevTools();

	console.log("args: " + gui.App.argv);

	var startup = new Date().getTime();
	var spawn = require('child_process').spawn,

	java  = spawn('java', ['-jar', './java/colt.jar', '-ui']);

	java.on('close', function (code, signal) {
		console.log('child process terminated due to receipt of signal ' + signal);
		win.close(true);
	});

	java.stdout.on('data', function (message) {
		console.log('[' + (new Date().getTime() - startup) + ']: '+ message);
	});

	java.stderr.on('data', function (message) {
		console.log('stderr: '+ message);
	});

	win.on('close', function() {
		java.kill();
		this.close(true);
	});

	var tray = new gui.Tray({ title: '', icon: './icons/colt_32.png' });
	var menu = new gui.Menu();
	menu.append(new gui.MenuItem({ type: 'checkbox', label: 'box1' }));
	tray.menu = menu;


	var fs = require('fs'),
	var Q = require('q'),
	xml2js = require('xml2js');


	var nodeApp = {

		loadProject : function(filePath){
			var d = Q.defer();
			var parser = new xml2js.Parser();
			fs.readFile(filePath, function(err, data) {
				if(err){
					d.reject(err);
				}else{
					parser.parseString(data, function (err, result) {
						done.resolve(data);
					});	
				}
				
			});

			return d.promise;
		}

		saveProject : function (filePath, data){
			var d = Q.defer();
			var builder = new xml2js.Builder();
			var xml = builder.buildObject(data);

			fs.writeFile(filePath, xml, function(err) {
				if(err) {
					d.reject(err);
				} else {
					done.resolve();
				}
			}); 

			return d.promise;
		}
	}

	nodeApp.loadProject("./test-project.colt").then(function(data) {
		console.log(data);
	});
}