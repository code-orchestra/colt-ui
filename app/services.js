'use strict';

app.service("nodeApp", function($q) {
		this.buildNode = function($scope) {
		$scope.getProjectPath = function() {return "_autogenerated.colt"};
		$scope.loadProject = function() {};
		$scope.saveProject = function() {};
		$scope.sendToJava = function() {};
		$scope.openPopup = function() {};

		if(!top['require']){
			setTimeout(function() {
				$scope.$apply(function() {
					for (var i = 0; i <= 50; i++) {
						$scope.log("WARNING", "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo, saepe dolore esse voluptatem sunt voluptate? Voluptas, aliquid, obcaecati odit dignissimos excepturi repudiandae assumenda quod nemo aliquam porro reiciendis enim odio doloribus magnam incidunt quas dolorem. Sequi, perspiciatis, quis ex quaerat commodi itaque nisi id odit quod distinctio similique ab quia blanditiis qui fuga quae dicta iste veniam beatae natus repellat aspernatur voluptatem laborum magnam esse fugit officiis amet maiores quibusdam quasi sint corporis dignissimos sit aliquid iure maxime ducimus unde voluptate consectetur minima error voluptatum nam accusamus enim debitis deleniti in consequatur voluptatibus temporibus eveniet! Est, reprehenderit, vero, quam ut nihil temporibus illum accusantium impedit inventore fugiat suscipit adipisci odit excepturi consequuntur assumenda omnis et provident? Quos error similique eligendi. Officiis, explicabo vero eaque rem officia illum magni exercitationem quibusdam unde commodi. Tempora, ipsa, commodi, possimus, quaerat alias iure modi quis neque voluptate aliquam architecto excepturi cupiditate illum repellendus deleniti velit libero. Dignissimos, ratione, delectus, quis minus cupiditate atque saepe tempore ad excepturi praesentium suscipit vitae repellat accusantium odit tempora ab doloribus. Quis, modi, alias, nesciunt eius tenetur doloribus sit mollitia rerum id delectus esse assumenda voluptatum minus dolores quasi dolor corporis saepe quam eaque aspernatur nostrum reiciendis accusamus neque ea illum explicabo ab cupiditate fugit architecto iure nobis nemo rem ad sequi perspiciatis consequuntur laborum! Eveniet, magni, neque qui veritatis error voluptates odio molestiae maxime ex fugiat doloribus vitae blanditiis inventore quisquam nostrum sint dolor at dicta ipsum atque dolore nisi excepturi numquam temporibus ducimus rem velit aspernatur repellat laudantium repudiandae officiis nemo expedita corporis. Mollitia, debitis, sapiente, praesentium dolores tenetur veritatis libero inventore perspiciatis quos quasi veniam culpa rem architecto ab cupiditate eum tempore consequatur nesciunt ipsam qui dolorum soluta ad! Mollitia, distinctio, deserunt, corporis dolorem dolores laudantium ipsam error reiciendis laborum aut dolor est ut vero eos fugit deleniti libero illo cumque recusandae nobis quidem optio enim quam adipisci earum veritatis consectetur suscipit! In, et, facere minima laboriosam eos illo error molestiae veritatis repellendus magnam quasi suscipit harum cum veniam cupiditate eaque nihil assumenda eligendi cumque dolore perspiciatis fugiat adipisci hic enim iste accusantium aperiam odio consequuntur doloremque culpa incidunt quia beatae recusandae ullam quidem nostrum autem aliquam iure ipsa minus voluptas quo voluptatem dicta reprehenderit temporibus quis? Adipisci, fuga, laboriosam voluptatem molestias harum earum vitae architecto sequi quasi at unde est nam repellat ut mollitia officia assumenda. Vel, quos, corporis minima earum assumenda obcaecati sunt quasi.", "index.html");
					}
				});
			}, 1000);
		}else{
			var gui = require('nw.gui'); 
			var win = gui.Window.get(); win.showDevTools();
			
			var projectPath = '/Volumes/Archive/Projects/colt-ui/autogenerated.colt';
			if (gui.App.argv != "") {
				projectPath = gui.App.argv;
			};

			console.log("app args:", gui.App.argv);
				
			var startup = new Date().getTime();
			var spawn = require('child_process').spawn,

			java  = spawn('java', ['-jar', './java/colt.jar', projectPath, '-ui']);
			java.on('close', function (code, signal) {
				console.log('child process terminated due to receipt of signal ' + signal);
				//win.close(true);
			});

			var trimMessage = function(message) {
				message =  (message + "");
				message =  message.replace(/^\[fileScanner\]\s+/, "");
				message =  message.replace(/(\n|\r)+$/, "")
				message =  message.replace(/\\n/g, "\\n")
	                              .replace(/\\'/g, "\\'")
	                              .replace(/\\"/g, '\\"')
	                              .replace(/\\&/g, "\\&")
	                              .replace(/\\r/g, "\\r")
	                              .replace(/\\t/g, "\\t")
	                              .replace(/\\b/g, "\\b")
	                              .replace(/\\f/g, "\\f")
	            return message;
			};

			var isPing = function(text) {
				var pingRegexp = /ping/g;
				return pingRegexp.exec(text) != null;
			}

			java.stdout.on('data', function (text) {
				text = (text+"");
				try{
					var regexp = /-json:(.+?)\/json/g;
					var match = regexp.exec(text);

					if(match){
						while(match) {
							var messageText = match[1];
							match = regexp.exec(text)
							// console.log("match: " + match);
							// console.log("message text", messageText);
							try{
								var json = JSON.parse(trimMessage(messageText));
								$scope.$apply(function() {
									if(json.type == "log"){
										$scope.logMessages.push(json);
										$scope.updateFilters();
									}else if(json.type == "runSession"){
										$scope.sessionInProgress = true;
										$scope.sessionStateSwitching = false;
										console.log("$scope.sessionInProgress", $scope.sessionInProgress);
									}else if(json.type == "stopSession"){
										$scope.sessionInProgress = false;
										$scope.sessionStateSwitching = false;
										console.log("$scope.sessionInProgress", $scope.sessionInProgress);
									}else if(json.type == "exec"){
										var exec = require('child_process').exec;
									    var child = exec(json.exec,
										  function (error, stdout, stderr) {
										    if(("" + stdout).length)$scope.log('INFO', trimMessage(stdout));
										    if(("" + stderr).length)$scope.log('ERROR', trimMessage(stderr));
										    if (error !== null) {
										      $scope.log("ERROR", 'exec error: ' + error);
										    }
										});
									}else if(json.type == "SerialNumber") {
										switch(json.state){
											case "show":
												$scope.showSerialNumberDialog().then(
													$scope.sendToJava,
													function() {
												    	$scope.sendToJava("continue");
													},
													function(update) {
													    gui.Shell.openExternal(update);
													}
												)
												break;
											case "error":
												$scope.popup.errorMessage = json.message
												$scope.showSerialNumberDialog().then(
													$scope.sendToJava,
													function() {
												    	$scope.sendToJava("continue");
													},
													function(update) {
													    gui.Shell.openExternal(update);
													}
												)
												break;
											case "success":
												$scope.showMessageDialog("app", json.message)
												break;
											case "demoMessage":
												$scope.showMessage("info", json.message)
												break;
											case "demoCount":
												$scope.popup.message = json.message
												$scope.showSerialNumberDialog().then(
													$scope.sendToJava,
													function() {
												    	$scope.sendToJava("continue");
													},
													function(update) {
													    gui.Shell.openExternal(update);
													}
												)
												break;
										}									
									}else if(json.type == "recentProjectsPaths") {
										if (serviceDefers["recentProjectsPaths"] != null) {
											serviceDefers["recentProjectsPaths"].resolve(json.array)
											serviceDefers["recentProjectsPaths"] = null
										};
									}
									$scope.$emit(json.type, json);
								});

							}catch(e){
								console.error("error parse json: |" + messageText + "|", e);
								return;
							}
							
						}
					}else if(!isPing(text)){
						console.log("stdout:", text);
					}
					
					if(isPing(text)){
				    	$scope.sendToJava("pong");
				    }
				}catch(e){
					console.error("!!!!! ", e)
				}
			});

			java.stderr.on('data', function (message) {
				// console.log('stderr: '+ message);
				$scope.log("ERROR", trimMessage(message));
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
			var x2js = new X2JS();

			$scope.loadProject = function(filePath){
				var d = $q.defer();
				fs.readFile(filePath, function(err, data) {
					if(err){
						d.reject(err);
					}else{
						var json = x2js.xml_str2json( data );
						d.resolve(json);
					}
				});
				return d.promise;
			};

			$scope.getProjectPath = function(){
				var gui = require('nw.gui');
				var projectFilePath = gui.App.argv
				if (projectFilePath == "") {
					projectFilePath = '_autogenerated.colt'
				};
				return projectFilePath;
			}

			$scope.saveProject = function (filePath, data){
				var d = $q.defer();
				var xml = xml2js.json2xml(data);

				fs.writeFile(filePath, xml, function(err) {
					if(err) {
						d.reject(err);
					} else {
						d.resolve();
					}
				}); 
				return d.promise;
			};
			$scope.sendToJava = function(message) {
				java.stdin.write(message + "\n");
			};

			var serviceDefers = {}
			$scope.sendToJavaWithPromise = function(message, resolveType) {
				var d = serviceDefers[resolveType] || $q.defer()
				serviceDefers[resolveType] = d 
				$scope.sendToJava(message)
				return d.promise
			}
			
			$scope.openPopup = function(html, title) {
				var windowObject = window.open(html, "popup", {resizable:false, width:window.width,height:window.height});
				var modal = gui.Window.get(windowObject);
				modal.hide();
				modal.showDevTools();
				modal.on('loaded', function() {
					console.log("popup opened", win);
					win.hide();
					modal.focus();
					modal.title = title;
					modal.x = win.x - 40;
					modal.y = win.y - 40;
					modal.setPosition("mouse");
					modal.show();
				});
				windowObject.popupInfo = {};
				windowObject.popupInfo.onResize = function(w, h) {
					windowObject.resizeTo(w, h+32);
				};
				modal.on('focused', function() {
					console.log("popup focused");
				});
				modal.on('closed', function() {
					win.show();
					win.focus();
					console.log("popup closed");
				});
				return windowObject;
			};
		}
	} 
});