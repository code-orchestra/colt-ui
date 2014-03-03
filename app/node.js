//zip -r ../tmp/myApp.nw *

var nodeApp;

if(this['require'] != undefined){
	var gui = require('nw.gui'); 
	var win = gui.Window.get(); //win.showDevTools();

	console.log("args: " + gui.App.argv);

	var startup = new Date().getTime();
	var spawn = require('child_process').spawn,

	java  = spawn('java', ['-jar', './java/colt.jar', '-ui']);

	java.on('close', function (code, signal) {
		console.log('child process terminated due to receipt of signal ' + signal);
		//win.close(true);
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

	// var tray = new gui.Tray({ title: '', icon: './icons/colt_32.png' });
	// var menu = new gui.Menu();
	// menu.append(new gui.MenuItem({ type: 'checkbox', label: 'box1' }));
	// tray.menu = menu;

	var fs = require('fs');
	var Q = require('q');
	var x2js = new X2JS();

	nodeApp = {
		loadProject : function(filePath){
			var d = Q.defer();
			fs.readFile(filePath, function(err, data) {
				if(err){
					d.reject(err);
				}else{

					var json = x2js.xml_str2json( data );
					d.resolve(json);
				}
				
			});
			return d.promise;
		},

		saveProject : function (filePath, data){
			var d = Q.defer();
			var xml = xml2js.json2xml(data);

			fs.writeFile(filePath, xml, function(err) {
				if(err) {
					d.reject(err);
				} else {
					d.resolve();
				}
			}); 
			return d.promise;
		}
	}

	nodeApp.loadProject("./test-project.colt").then(function(data) {
		console.log("PROJECT:");
		console.log(data);			
	});
}