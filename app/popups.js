'use strict';

var app = angular.module("popups", [
	'ui.router', 
	'colt.directives'
	]);

app.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise("/welcome-screen");
	$stateProvider
	.state('welcome-screen', {
		url: "/welcome-screen",
		templateUrl: "popups/welcome-screen.html",
		pageName: "Welcome Screen",
		controller: "WelcomeController"
	})
	.state('purchase-dialog', {
		url: "/purchase-dialog",
		templateUrl: "popups/purchase-dialog.html",
		pageName: "Purchase COLT",
		controller: "PurchaseController"
	})
	.state('continue-demo-dialog', {
		url: "/continue-demo-dialog",
		templateUrl: "popups/continue-demo-dialog.html",
		pageName: "Purchase COLT",
		controller: "ContinueDemoController"
	})
	.state('enter-serial-number-dialog', {
		url: "/enter-serial-number-dialog",
		templateUrl: "popups/enter-serial-number-dialog.html",
		pageName: "Enter Serial Number",
		controller: "EnterSerialNumberController"
	})
	.state('update-dialog', {
		url: "/update-dialog",
		templateUrl: "popups/update-dialog.html",
		pageName: "Update COLT",
		controller: "UpdateController"
	})
	.state('close-save-dialog', {
		url: "/close-save-dialog",
		templateUrl: "popups/close-save-dialog.html",
		pageName: "Close COLT",
		controller: "CloseSaveController"
	})
	.state('alert-dialog', {
		url: "/alert-dialog",
		templateUrl: "popups/alert-dialog.html",
		pageName: "Alert",
		controller: "AlertController"
	})
	.state('proxy-settings-dialog', {
		url: "/proxy-settings-dialog",
		templateUrl: "popups/proxy-settings-dialog.html",
		pageName: "Proxy Settings",
		controller: "ProxySettingsController"
	})
	.state('proxy-settings-inline-dialog', {
		url: "/proxy-settings-inline-dialog",
		templateUrl: "popups/proxy-settings-inline-dialog.html",
		pageName: "Proxy Settings",
		controller: "ProxySettingsController"
	})
	.state('js-doc-popup', {
		url: "/js-doc-popup",
		templateUrl: "popups/js-doc-popup.html",
		pageName: "JS Doct",
		controller: "JsDocsController"
	})
});

app.run(function($rootScope) {
	$rootScope.$on('$stateChangeSuccess', function(event, toState){ 
		$rootScope.pageName = toState.pageName;
		$rootScope.pageIndex = toState.pageIndex;
		$rootScope.onResize();
	});

	$(document).bind("resize", function() {
		$rootScope.onResize();
	});
	
	$rootScope.onResize = function() {
		if(window.onResize != undefined){
			window.onResize();
		}
	}
	
	$rootScope.callToOwnerWindow = function(command, arg) {
		if(window.hasOwnProperty("popup")){
			if(window.popup.hasOwnProperty(command)){
				window.popup[command](arg);
			}else{
				console.log("'" + command + "' command not found");
			}
		}else{
			console.log("popup property not found");
		}
	}

	if(window.popup){
		$rootScope.popup = window.popup;
	}else{
		$rootScope.popup = window.popup = {};
		window.setPopup = function(p) {
			$rootScope.$apply(function() {
				$.extend($rootScope.popup, p);
			})
		}
	}

	window.onerror = function(msg, url, line) {
		console.log("ERROR", "COLT UI Error: " + msg, url+":"+line);
	}
});

app.controller("WelcomeController", function($scope, $rootScope) {
	console.log("welcome screen");

	$scope.openLink = function(url) {
		$scope.callToOwnerWindow("openLink", url);
	}

	$scope.newProject = function() {
		$scope.callToOwnerWindow("newProject");
	}

	$scope.openDemoProjects = function(){
		$scope.callToOwnerWindow("openDemoProjects");
	}

	$scope.openRecentProject = function(index) {
		$scope.callToOwnerWindow("openRecentProject", index);
	}

	$scope.openProject = function() {
		console.log("open project")
		$scope.callToOwnerWindow("openProject");
	}
});

app.controller("PurchaseController", function($scope, $rootScope) {
	console.log("purchase colt dialog");

	$scope.serialNumber = '';

	$scope.enterSerialNumber = function() {
		$scope.callToOwnerWindow("enterSerialNumber", $scope.serialNumber);
	}
	$scope.buy = function(type) {
		$scope.callToOwnerWindow("buy", type);
	}
	$scope.demo = function() {
		$scope.callToOwnerWindow("demo");
	}
});

app.controller("EnterSerialNumberController", function($scope, $rootScope) {
	console.log("enter serial number dialog");

	$scope.serialNumber = '';

	$scope.enterSerialNumber = function() {
		$scope.callToOwnerWindow("enterSerialNumber", $scope.serialNumber); 
	}
});

app.controller("ContinueDemoController", function($scope, $rootScope) {
	console.log("continue with deme dialog");

	$scope.serialNumber = '';

	$scope.enterSerialNumber = function() {
		$scope.callToOwnerWindow("enterSerialNumber", $scope.serialNumber);
	}
	$scope.buy = function() {
		$scope.callToOwnerWindow("buy");
	}
	$scope.demo = function() {
		$scope.callToOwnerWindow("demo");
	}

	$scope.enterSerialNumber();
});

app.controller("UpdateController", function($scope, $rootScope) {
	console.log("update colt dialog");

	$scope.update = function() {
		$scope.callToOwnerWindow("update");
	}
	$scope.cancel = function() {
		$scope.callToOwnerWindow("cancel");
	}
});

app.controller("CloseSaveController", function($scope, $rootScope) {
	console.log("close/save colt dialog");	

	$scope.dontSave = function() {
		$scope.callToOwnerWindow("dontSave");
	}
	$scope.save = function() {
		$scope.callToOwnerWindow("dontSave");
	}
	$scope.cancel = function() {
		$scope.callToOwnerWindow("cancel");
	}
});

app.controller("AlertController", function($scope, $rootScope) {
	console.log("alert dialog");	
	
	// $scope.popup.type = "error";
	// $scope.popup.message = "my message";
	// $scope.popup.stacktrace = "stacktrace";
	// $scope.popup.showEmailDialog = true;
	// $scope.popup.email = "my@email.com";

	if($scope.popup.type == undefined){
		$scope.popup.type = "warning";
	}
	if($scope.popup.message == undefined){
		$scope.popup.message = "No message";
	}
	console.log($scope.popup.type)
	$scope.showDevConsole = function() {
		$scope.callToOwnerWindow("showDevConsole");
	}
	$scope.sendBug = function() {
		$scope.callToOwnerWindow("sendBug");
	}
	$scope.close = function() {
		$scope.callToOwnerWindow("close");
	}
});

app.controller("ProxySettingsController", function($scope, $rootScope) {
	console.log("proxy settings dialog");
	if($scope.popup.port == undefined){
		$scope.popup.port = "8080";
	}
	$scope.save = function() {
		$scope.callToOwnerWindow("save", $scope.popup);
	}
});

app.controller("JsDocsController", function($scope) {
	console.log("js doc popup");
	// $scope.popup.title = "JS Docs";
	// $scope.popup.html = $sce.trustAsHtml("Lorem ipsum dolor sit amet, consectetur adipisicing elit. Incidunt, alias eaque perferendis modi odio eius ullam veritatis a facere culpa maxime voluptatum sint quos temporibus non deleniti asperiores deserunt. Magnam officia amet distinctio. Asperiores, ad, saepe eos fuga rem temporibus error nostrum labore architecto sequi accusantium obcaecati sapiente hic repellendus quidem perferendis distinctio accusamus. Maxime, nihil, culpa, autem, veritatis odio error enim libero neque incidunt assumenda officiis perferendis molestiae quis rem earum obcaecati reiciendis omnis iure magnam accusamus nostrum soluta repellat numquam ad porro dignissimos fugit ipsa sapiente aut mollitia voluptas in minus placeat. Omnis explicabo ea saepe repudiandae aut veritatis ut in similique ex. Repellendus, dolor consequuntur expedita ducimus a sint quisquam fugiat illum sed inventore cumque nulla. Reprehenderit, molestias, dolorem, omnis, recusandae inventore placeat facere repudiandae architecto officia repellendus deserunt quis eum laudantium illo est enim ipsam quo impedit libero obcaecati amet nobis alias dignissimos aliquam dolores incidunt reiciendis! Labore consectetur cum eligendi tenetur quidem culpa explicabo. Quo, voluptatibus, laborum facere ut velit vel illo officia iusto minus amet quisquam odio animi eos officiis omnis mollitia eveniet impedit atque beatae deleniti eum pariatur voluptas fuga. Minima, debitis, dolores, nostrum explicabo aliquid natus eaque ipsa libero veniam atque voluptas maiores. Saepe, soluta, a, libero ab amet sequi maiores fugiat laboriosam facilis eum minus excepturi blanditiis vel expedita eius eveniet eaque. Iure, eum ex molestias ea veniam quam pariatur! Debitis, doloribus, dolor, animi, totam repudiandae facere neque quia atque commodi necessitatibus itaque omnis veritatis vitae ea perferendis voluptas quidem nesciunt dolorum laboriosam possimus doloremque temporibus id praesentium enim voluptatibus iure iusto. A, sunt, cum, nulla dolorem dolor aspernatur odio omnis fugiat aliquam fuga porro qui adipisci eveniet rem dolores ullam in exercitationem cumque quaerat velit! Quas, veniam aut aperiam nostrum dolor excepturi reprehenderit doloribus commodi repudiandae animi velit nulla accusantium suscipit assumenda explicabo. Hic, illo, aut, eveniet deleniti ut atque nobis est neque ex recusandae quam beatae reiciendis non obcaecati iusto eos earum quae. Voluptatem, libero fuga totam quis ad corporis veritatis eligendi magnam magni dicta! Asperiores, odit, debitis, vel commodi corrupti vero voluptatum minus nihil cum nulla excepturi porro corporis dicta nostrum ut cumque et! Iusto, temporibus, recusandae molestias aspernatur culpa labore quidem molestiae architecto enim dolor consectetur dolores voluptates accusantium. Soluta, debitis, fugit, reiciendis optio officia placeat suscipit ad tempora exercitationem totam ut ea ipsum deserunt sequi quidem mollitia voluptatibus qui quis eligendi quisquam laboriosam sit incidunt saepe molestias provident non nostrum rerum amet enim earum nobis magnam temporibus velit voluptate dicta iste officiis expedita porro quas veniam repudiandae iusto sapiente recusandae error aliquam dignissimos! Nemo, necessitatibus, sit quidem impedit rem eius tempora earum dolorem ipsam ipsa molestias quis delectus quibusdam doloribus quaerat saepe laudantium numquam alias consequatur vitae veritatis illum molestiae qui tenetur voluptas corporis ipsum. Deleniti, inventore, dolor, itaque labore impedit debitis velit alias suscipit magni eligendi deserunt ullam rerum autem commodi nihil qui repellendus nemo dolore dignissimos similique mollitia animi sit maxime nostrum assumenda esse aliquam fugiat iste a. Recusandae, tenetur, cumque numquam nam laudantium placeat incidunt quisquam dicta eum id voluptatem quas quasi amet iusto ducimus. Magni, sint, reiciendis laudantium ullam tempora facere eligendi eveniet officia fugiat accusantium modi fugit reprehenderit suscipit dolor adipisci sequi dignissimos repellat laborum! Minus tempora rerum in! Ab, aut, veritatis, fugit recusandae libero reiciendis fuga esse suscipit eos eaque minima voluptate perferendis tempora corporis excepturi dolores quae autem voluptates cumque ipsa impedit accusamus natus laboriosam nulla qui! Culpa recusandae necessitatibus labore deserunt temporibus facilis maiores quidem suscipit veritatis ab. Nobis, odio, pariatur excepturi dicta temporibus voluptates eum accusantium odit nihil accusamus nostrum iusto perspiciatis suscipit sed ratione harum modi similique doloribus quos repudiandae sunt dolorum omnis dignissimos fugit dolor ducimus libero error illo eligendi officiis mollitia dolorem reiciendis reprehenderit. Perspiciatis, omnis eaque laborum necessitatibus libero est cumque quaerat tempora ipsum in officia eligendi quam quisquam fugit vel nesciunt eum provident sunt beatae exercitationem possimus eveniet quod suscipit ipsa molestiae laudantium illo ipsam deserunt cum error consectetur ratione consequatur culpa ex optio distinctio consequuntur! Reiciendis, vero dolores eaque laboriosam rerum nulla doloribus facere praesentium corporis natus corrupti dicta! Ipsum, vero, obcaecati, architecto debitis iusto vel eius repudiandae temporibus eaque est perferendis voluptatem odit nisi qui provident recusandae sapiente impedit praesentium nihil quisquam doloribus consequuntur quasi. Nemo, illum ea repellendus perspiciatis harum excepturi quibusdam totam reprehenderit ipsam odit quisquam repellat cum? Libero, odio, consequuntur obcaecati ea excepturi ad voluptates quos odit repudiandae repellat qui amet. Enim, delectus, quaerat, asperiores totam minus quia ipsam sunt cumque quidem reiciendis consequatur perferendis obcaecati sed vel natus temporibus hic officiis soluta laboriosam quae molestias pariatur eos earum officia omnis? In, voluptatibus laboriosam ad aperiam molestias quos quidem quisquam quaerat totam fuga sint impedit! Optio, dicta, perferendis ea sequi aspernatur molestiae quod aperiam qui assumenda quam facilis natus eos minima ex animi et omnis excepturi aut doloribus velit? Dignissimos, laborum, distinctio, cupiditate, nobis eum explicabo nihil quo expedita minus optio ratione sit inventore officia aspernatur eligendi voluptatibus labore quibusdam sint dolore at quasi ab in! A eaque deleniti aspernatur sed quasi. Qui, pariatur a ipsam impedit atque consequuntur fugiat temporibus quasi. Vel, cupiditate voluptatibus mollitia dolor obcaecati quos. Distinctio, vitae, error, at, sequi tempora culpa nemo alias reiciendis assumenda maxime unde ad magni ipsa esse architecto eos facere! Molestias, unde, fugiat, perspiciatis maxime accusantium possimus id ab delectus necessitatibus at reprehenderit asperiores. Nulla, totam, dolore, nemo laboriosam ipsum doloremque dignissimos sed sit delectus reiciendis ex animi praesentium illo vel placeat velit qui inventore nostrum alias voluptatem voluptate laborum dolorem ipsa consequatur repellat omnis eveniet quis at labore veniam! Optio, non, officiis amet perferendis ex nesciunt tempore? Eum, itaque, et incidunt commodi blanditiis maiores in laboriosam placeat tempora impedit vel dolor labore quia consectetur ex perferendis quis. Soluta, placeat, aperiam, ipsam accusamus eius sunt fuga distinctio ad atque voluptatem explicabo eaque ipsum ut veritatis culpa voluptatibus corrupti tempora reprehenderit laudantium ea ratione dignissimos repellat fugit autem at dicta eos. Nostrum, nihil, delectus, totam porro tempore repellendus iure pariatur doloribus praesentium dolores eum ea sapiente voluptas accusantium explicabo eligendi assumenda facilis animi facere necessitatibus quod id voluptates in velit sint saepe laborum quisquam cum quam nemo! Natus, perspiciatis, maiores totam reiciendis illo ipsa tempora animi iusto ad molestiae ullam officia deleniti culpa quas minus officiis soluta sapiente consequuntur optio sunt amet blanditiis tenetur odio architecto excepturi! Quisquam, enim, velit, quia aspernatur consequuntur nam quaerat optio consectetur cupiditate atque facere amet officiis repudiandae. Aut, sapiente, incidunt ullam nobis magnam nesciunt totam qui quisquam ducimus labore optio ea nemo assumenda facilis rerum reiciendis maiores molestiae id numquam culpa quam fugit eum facere recusandae similique dicta error. Velit, nobis, ex quos ducimus neque tenetur magnam officia delectus perspiciatis et veniam temporibus totam eveniet aliquam ratione libero omnis cum quia animi tempore architecto quasi inventore id nulla odio? Numquam, deleniti, sunt, doloribus, optio atque cum voluptatum doloremque iure earum repellendus dolore quo labore quos impedit ad ipsam omnis nesciunt saepe officia voluptate odit animi ab corrupti assumenda tempore unde eos. Quis, repudiandae, quia, sint culpa quo molestias praesentium tempora dolorem architecto in fugit reprehenderit harum minima aliquam a officiis excepturi impedit. Voluptas, modi, nisi, voluptate, unde et libero dicta fuga magnam error maiores illum eveniet ipsum tempore rerum minima nostrum provident fugiat dolore cupiditate blanditiis. Obcaecati, reiciendis, aliquid, aut quisquam delectus a ipsam nobis omnis voluptates natus odit assumenda voluptatem ipsum iure cupiditate aspernatur est perspiciatis neque eveniet aliquam culpa nesciunt eum nemo velit fugiat inventore iste repellendus eos voluptatum ducimus ad magnam corporis quo tempora veniam quae molestias officia laudantium consequuntur soluta. Beatae, cumque, impedit repudiandae facilis vitae harum error. Saepe, autem, nemo necessitatibus ad earum recusandae dignissimos aspernatur dolorem odio error magni laborum est? Aut, modi, sapiente asperiores laudantium eius quisquam nemo iure repudiandae vitae officia voluptate atque expedita consectetur quis aliquam perspiciatis doloremque accusamus a magnam dolores omnis illo ullam cumque quibusdam harum. Delectus, quibusdam dolorum accusamus rem tenetur laudantium! Rem, voluptates pariatur vel debitis optio cupiditate sed totam fuga ipsum sequi harum at aliquid necessitatibus repellat minus quam esse soluta autem ut quos! Consequatur, perspiciatis, nisi recusandae possimus veniam magnam nihil aliquam quibusdam accusamus eaque consectetur modi quis illum ipsa quisquam? Quisquam, blanditiis, neque soluta dicta omnis nemo necessitatibus molestias distinctio sapiente alias vitae dolores nostrum molestiae provident velit! Mollitia, perspiciatis pariatur alias odio cumque facilis nulla exercitationem impedit! Et, quo, odio, ad, officiis aliquam earum consectetur atque deleniti perspiciatis enim exercitationem veniam perferendis assumenda inventore eveniet! Exercitationem, inventore voluptate quae ea quidem doloremque atque necessitatibus! Repellendus, veniam perferendis dolores molestias iste dolore praesentium quibusdam omnis nobis delectus voluptatum vitae et illo dolor minus amet odit consequuntur doloremque eaque fugiat. Eius, quae, maxime nam at accusamus alias voluptate sequi eos quibusdam impedit tenetur inventore quo corporis hic suscipit qui non laudantium ea debitis nisi quam numquam expedita. Doloribus, ad dolore odit atque laudantium debitis. Eveniet, cupiditate accusantium odio laboriosam corrupti debitis maiores ad sit voluptas eum dolores minus soluta fugiat excepturi dicta quasi in optio. Omnis blanditiis beatae excepturi odit praesentium vitae quod. Placeat, omnis accusantium vero non odio? Commodi, ipsum, saepe, quisquam nesciunt molestiae itaque vero fuga maiores nulla ipsam iure mollitia inventore porro architecto ea nobis voluptatibus accusamus eaque dolorem distinctio dicta blanditiis at quasi facilis voluptates. Temporibus, debitis, error laboriosam in quod architecto ipsam omnis. Vel, at, cupiditate sed recusandae nihil maiores corporis amet. Id, eius, ipsa, delectus, dicta aspernatur dolorum aliquam vero voluptatum unde quas voluptatem illo vitae assumenda error asperiores cupiditate consequuntur autem fuga consequatur blanditiis corrupti quasi omnis velit quo sunt iure facere magnam. Nihil, blanditiis, alias, dolorem dignissimos consectetur laboriosam ipsum impedit repudiandae natus ut ratione perferendis iusto in quae id autem ullam! Modi, ea, placeat consequuntur id aspernatur illum ipsum voluptates fuga ab impedit omnis sunt dolore natus aliquam pariatur ipsam et ducimus sint eos inventore quae dicta dolorum tenetur molestias iure ex in quas. Dolor, tempore, et reiciendis dolores minima qui est rerum obcaecati distinctio atque magnam cumque quam quae tenetur rem nesciunt asperiores accusamus labore ipsum dolorum aliquam ducimus mollitia vitae adipisci quia similique deserunt vel culpa dignissimos itaque voluptatibus hic illum incidunt. Quo, quaerat, rem sunt cum odit dolor quisquam architecto suscipit beatae ab impedit ut. Quaerat, recusandae explicabo asperiores qui necessitatibus possimus eveniet sed quis ipsum! Nemo, delectus, quo, nihil libero neque voluptatum harum quaerat a eos odio recusandae repellat nobis et ea porro magnam perspiciatis! Veniam, numquam magni sint temporibus earum sunt eum corrupti magnam sequi recusandae nam omnis necessitatibus tenetur quo voluptatem facilis ipsam explicabo impedit placeat voluptas pariatur aut velit aspernatur distinctio nihil nemo doloribus tempora animi sit itaque enim quam saepe eligendi. Doloremque magni repellat et minus asperiores quidem unde. Voluptates deserunt neque voluptatibus sed dolorum eveniet enim quisquam est vitae a. Ducimus, doloremque error corporis numquam iure omnis molestiae aliquam nesciunt ipsa fugit illum placeat. Et, enim hic error facere voluptate fugit perferendis. Suscipit, dolores laborum vel dolorem quod et corrupti esse veritatis amet accusamus voluptatibus distinctio alias laboriosam quaerat labore inventore consequatur iure error. Sed, dolor tempore ipsam sit quis ipsa voluptatum. Animi, aliquam, autem ipsa at temporibus rerum similique nemo quae cupiditate corrupti id vero quibusdam error dicta corporis sequi veritatis in vitae beatae fugit. Sint, iste, quaerat, dolorum officiis magnam et itaque a quos officia consequuntur odio dolores velit quod repellat doloribus exercitationem ab? Delectus, rerum, iure, dolorem sequi modi voluptatibus quia ut ipsum ducimus est id eum non magnam voluptatum earum voluptas architecto. In, enim, eligendi. Hic, illum, ut, obcaecati in vel animi ipsum atque doloribus error praesentium vitae odit accusamus vero earum omnis corrupti eaque magnam repellat facilis perspiciatis. Similique, nam, ea perspiciatis accusamus commodi libero fugit sint omnis modi laudantium ratione eaque eum ex aperiam suscipit voluptates quam debitis vero assumenda eius maiores minima inventore labore id odio temporibus laborum obcaecati. Non, nemo, laborum error distinctio iure dignissimos officiis id laboriosam odio quis ea soluta amet quibusdam. Deleniti adipisci maxime alias est eius necessitatibus. Maxime, deserunt, adipisci, quidem ducimus maiores unde corporis cumque voluptas aliquam velit itaque placeat quis temporibus exercitationem ipsum et eos nam.");
});

app.filter('unsafe', function($sce) {
	return function(val) {
		return $sce.trustAsHtml(val);
	};
});
