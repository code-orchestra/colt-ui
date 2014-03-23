'use strict';

var app = angular.module("popups", [
	'ui.router', 
	'angular-google-analytics',
	'colt.directives'
	]);

// app.config(function(AnalyticsProvider) {
// 	AnalyticsProvider.setAccount('UA-40699654-4');
// 	AnalyticsProvider.trackPages(true);
// });

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

app.run(function($rootScope, Analytics) {
	$rootScope.$on('$stateChangeSuccess', function(event, toState){ 
		$rootScope.pageName = toState.pageName;
		$rootScope.pageIndex = toState.pageIndex;
		// Analytics.trackPage(toState.url + ".html");
		$rootScope.onResize();
	});

	$(document).bind("resize", function() {
		console.log("on resize", arguments);
		$rootScope.onResize();
	});
	
	$rootScope.onResize = function() {
		var win = $(".popup-window");
		if(win.size() > 0){
			if(window.popupInfo){
				window.popupInfo.onResize($(win)[0].scrollWidth, $(win)[0].scrollHeight);
			}
		}else{
			console.log("popup window not found")
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
		// if(sessionStorage.hasOwnProperty("popup")){
		// 	if(sessionStorage.popup.hasOwnProperty(command)){
		// 		sessionStorage.popup[command](arg);
		// 	}
		// }
	}

	if(window.popup){
		$rootScope.popup = window.popup;
	}else{
		$rootScope.popup = {};
	}

	window.onerror = function(msg, url, line) {
		console.log("ERROR", "COLT UI Error: " + msg, url+":"+line);
	}
});

app.controller("WelcomeController", function($scope, $rootScope) {
	console.log("welcome screen");

	if(!$scope.popup.hasOwnProperty("rescentProjects")){
		$scope.popup.rescentProjects = [
		{name:"My Rescent Project"},
		{name:"Index"}
		];
	}

	$scope.openLink = function(url) {
		$window.open(url);
	}

	$scope.newProject = function() {
		$scope.callToOwnerWindow("newProject");
	}

	$scope.openDemoProjects = function(){
		$scope.callToOwnerWindow("openDemoProjects");
	}

	$scope.openRescentProject = function(index) {
		$scope.callToOwnerWindow("openRescentProject", index);
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
	$scope.buy = function() {
		$scope.callToOwnerWindow("buy");
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
	if($scope.popup.type == undefined){
		$scope.popup.type = "warning";
	}
	if($scope.popup.message == undefined){
		$scope.popup.message = "No message";
	}
	console.log($scope.popup.type)
	// $scope.popup.message = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Necessitatibus, nihil, blanditiis praesentium adipisci doloribus laboriosam vel et at consequatur ea."
	// $scope.popup.stacktrace = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque, impedit, eligendi, quaerat, iste et molestiae dolor veritatis rem cupiditate doloribus reprehenderit natus sed nisi ratione modi ex nihil eum expedita. Dolores architecto ipsam provident. Sint, voluptate, impedit doloremque incidunt dolorem nulla molestias consequatur ex libero fugit hic aliquid ea voluptas officia qui fuga reiciendis ad sit minus harum. Sint, pariatur, alias nesciunt dicta fugiat doloribus quis neque laborum ut porro expedita vitae sunt minus modi doloremque labore obcaecati ipsum maiores reprehenderit dolore veritatis inventore numquam ab debitis non facere tempore unde perferendis impedit optio. Minus, fugiat tempora nam optio quasi expedita reiciendis tempore repellendus! Natus, ipsum, accusantium, quasi et est iusto illo animi ipsam ex quod alias perferendis culpa velit neque rerum labore veniam dolorem quas aliquam reiciendis a impedit esse iste quaerat quam temporibus saepe optio obcaecati sequi quos eius fuga rem repellat vel voluptatibus magnam voluptas! Pariatur, porro, earum, placeat, id optio inventore iusto quasi aut minima ratione deleniti numquam recusandae fugit aperiam sunt impedit sequi sit dolor consequuntur vel eaque officia et veritatis reprehenderit rem dignissimos iste mollitia. Doloribus, reprehenderit tempora commodi harum corporis porro minus saepe tenetur fugiat voluptatibus in vero hic repellat vel quod ipsa id quas sed neque nihil? Quaerat, sequi, sit velit blanditiis similique quae eligendi aperiam quibusdam consequuntur nihil optio molestias dicta. Quidem, qui, tempora voluptatum atque doloremque hic nihil ea debitis voluptate corporis odio a nostrum maxime nemo facere repudiandae obcaecati vero repellendus numquam consequatur consequuntur ipsa optio quod porro quis officia animi minima delectus veniam suscipit alias perspiciatis culpa quisquam. Labore, quos eligendi voluptatum corporis perspiciatis at et ipsum sequi? Culpa, ab, quisquam dignissimos illo minus fuga earum adipisci similique distinctio atque nulla aspernatur necessitatibus veritatis iure odio ipsa est. Deserunt, doloribus, eaque, sapiente maiores commodi harum deleniti praesentium repellendus error aspernatur architecto labore officia eum quia debitis sunt a odio distinctio voluptatibus quo accusamus quasi atque non tenetur rerum possimus quaerat consequatur exercitationem corrupti nam! Consequuntur, numquam, deserunt dolor quo eum beatae cum sapiente illum saepe doloremque voluptatum sequi magni! Nihil, sunt ipsa ipsam sint asperiores nesciunt quisquam possimus est magni a et quod quibusdam similique sed doloremque enim sequi atque dolore dolorem dolores minima officia nemo molestias incidunt explicabo dolor error cum veniam delectus repudiandae vero beatae totam aperiam recusandae quam laborum perspiciatis debitis. Autem, commodi atque quibusdam esse illo quasi. Cum, eligendi, rem, obcaecati provident odit at veniam atque consequuntur aperiam esse quia iure fugit officia laudantium optio adipisci deleniti dignissimos dolorum temporibus tempore quas fugiat sed illo quisquam aut consectetur voluptate error eum natus voluptates reiciendis commodi architecto officiis. Accusamus sit tempore cum nihil harum suscipit minima maiores quisquam! Corporis, dignissimos, minima, voluptate, ea eum at nulla dolore sequi quod ipsam fuga labore cumque! Eum, ratione, quos asperiores autem fuga fugiat saepe similique. Unde, sapiente, laboriosam fugit dicta nihil labore animi recusandae officiis aut accusantium quia nulla porro repellendus impedit vel assumenda reprehenderit magnam quidem ex quae dolorem totam ut reiciendis culpa consectetur enim nemo commodi. Nisi, placeat hic nostrum eos tenetur nobis totam illum. Atque, quaerat, quibusdam, voluptatem laborum hic quasi esse debitis asperiores recusandae nihil non quo doloribus necessitatibus accusantium sunt aliquam ad ex quas ratione repudiandae adipisci distinctio quam earum voluptates officia officiis reiciendis quis itaque tempora ipsum nam numquam quae similique. Doloribus, omnis, dolorem, veritatis quas tempore suscipit facilis iure voluptate optio inventore cupiditate consequatur quaerat voluptatibus neque obcaecati amet voluptatem nulla ipsa enim eos necessitatibus assumenda placeat perspiciatis. Vero, sint, doloremque, maiores, molestiae praesentium laborum ratione aliquid placeat veritatis adipisci accusamus fuga assumenda sed voluptatum rem! Quaerat, tenetur, officiis, magnam, delectus praesentium ratione odit odio explicabo mollitia optio asperiores sunt corrupti architecto. Iusto, nam eveniet excepturi ut sunt cupiditate odio libero veritatis incidunt mollitia sequi explicabo ducimus. Laborum, unde, excepturi deserunt officiis quas ipsum vel itaque sapiente porro quam ea quia. Quidem, quam, eveniet suscipit maiores nisi beatae dolor itaque inventore molestiae voluptatibus quo nemo quia quibusdam! Aspernatur, nesciunt, odio molestiae deleniti repellendus dicta officiis eius vitae laudantium hic magnam iste veniam ex quia accusantium totam quae voluptatibus pariatur similique porro in sapiente ipsa omnis harum placeat laborum excepturi. Possimus, dolorem, culpa ad libero repellat tenetur cumque tempore officia nemo ipsam esse illum natus. Corrupti, nemo facere alias aliquid cum officia ut rerum libero doloribus tempora iure reprehenderit maiores exercitationem consectetur blanditiis maxime eius fuga odio non facilis quaerat sit incidunt aut unde sed saepe sunt impedit nostrum recusandae ea earum harum explicabo obcaecati expedita dolorum nisi numquam perferendis corporis dicta ex officiis ducimus! Temporibus, doloribus, id nemo eius harum pariatur asperiores eveniet quod voluptatum saepe minima doloremque quae nesciunt perferendis tempore nisi repellat fugiat voluptatibus quos veniam. A, repellendus, exercitationem, labore, commodi veritatis accusamus fugit veniam aut odit voluptas minima maiores quia modi debitis esse illum cupiditate consequuntur totam excepturi pariatur praesentium aperiam dolorum id et voluptatum. Cupiditate, ipsa, magnam, laboriosam obcaecati incidunt at harum eos tenetur minus officia atque consectetur qui nobis amet alias corporis dicta itaque porro culpa consequuntur excepturi fugiat voluptatibus repellendus repellat quod perspiciatis ullam totam tempore nulla sit. Consequatur, magnam quos praesentium accusantium accusamus placeat delectus eos assumenda repudiandae facere totam minima doloremque vitae in nesciunt beatae laudantium soluta eius porro dicta quaerat ipsum ex facilis veritatis quidem officiis exercitationem quisquam provident inventore mollitia maiores quas velit tempora rerum maxime similique et consectetur. Enim, quibusdam, asperiores, ipsum, quod maiores iusto incidunt accusamus vitae vel soluta quos ex nisi explicabo eius doloribus non temporibus fugit ea distinctio ut quasi pariatur laudantium nesciunt voluptatum deserunt. Dolore, delectus, quasi, illo animi rerum impedit dolorum saepe est nisi recusandae quis dignissimos voluptates labore eveniet alias. Soluta, aliquam, distinctio, tenetur excepturi quam saepe voluptate nobis inventore delectus vitae quas mollitia rem maxime quis nesciunt quos dignissimos adipisci facilis nemo fuga molestiae sunt pariatur libero. Vel, sit, ratione rerum molestiae omnis dolorem non similique natus quibusdam magni sed veritatis possimus excepturi aspernatur quae aliquid temporibus provident quis repellat adipisci facere quia ea beatae dignissimos culpa enim eaque eligendi earum harum dolorum ipsum architecto quas tempore suscipit voluptatum praesentium esse consequuntur. Necessitatibus, earum, odio, similique ad dolores nisi modi dignissimos corporis dolore fugiat repudiandae cumque quo aut vitae ipsa dolorem autem possimus praesentium eos harum nobis minima itaque nesciunt ea doloribus incidunt error delectus voluptate repellendus optio. Placeat, assumenda, facilis, natus velit excepturi incidunt dolorem nulla aut voluptatem odit esse repellendus non enim sequi consequatur provident accusamus. Sint, nulla quos necessitatibus in distinctio explicabo obcaecati? Suscipit, adipisci, veniam doloribus officiis soluta enim quae consequuntur voluptates natus dicta omnis illo optio magni perferendis eum et a accusantium ad! Veniam, id, ab, eveniet totam voluptas facilis alias accusantium atque praesentium facere deserunt inventore doloremque dolorum. Dolorem blanditiis debitis exercitationem excepturi voluptatum aliquam voluptates. Amet, voluptate, nostrum, aliquid, illo laboriosam at distinctio ducimus magni mollitia aliquam omnis doloribus. Vel, dolorum, quas itaque dicta tenetur nam voluptatibus sequi veniam suscipit earum nulla nemo libero non quibusdam error accusantium ut totam reprehenderit veritatis repellat. Incidunt, dolor, provident doloremque esse eum fugiat eveniet rem minus voluptatibus hic quisquam a placeat molestias id neque unde consequatur. Illo, vero, ab, voluptas, error quidem illum rem id asperiores iusto voluptatem ullam optio at itaque. Quaerat, eum, optio officiis ducimus doloribus nihil eos quod aperiam? Delectus, quaerat excepturi sunt voluptatem repudiandae recusandae cumque perferendis architecto totam nisi! Quam perferendis aut error tempora commodi dolorum odit rem itaque obcaecati! Dolorum, veritatis, eos delectus reiciendis porro ab consectetur saepe cum vel possimus dolore quis. Dolores, molestias, tempore, excepturi corrupti quisquam fugit hic libero neque velit tenetur ex dolorum eligendi aut aspernatur doloremque eos debitis qui itaque consectetur voluptate impedit dolorem quam? Expedita, nesciunt, iusto repellendus dolorum ullam necessitatibus architecto reiciendis. Dignissimos in provident impedit velit voluptatum possimus quibusdam doloremque cupiditate! Vel, eaque libero voluptas voluptates nisi consectetur cum est sit ab veritatis dolor sint sequi doloribus labore quas tempora ratione ut explicabo. Officiis, amet alias nisi repellendus quasi inventore pariatur blanditiis vel ex error asperiores deleniti rem magnam tenetur id quas veniam eligendi quidem magni sunt autem eaque culpa at quae soluta sint qui. Dolorem, nulla, quasi, nam, quo voluptatem molestias sunt optio voluptate laboriosam praesentium unde repellendus perferendis doloribus beatae saepe numquam eligendi modi sed. A, id, perferendis, similique ipsam illo voluptatem sapiente mollitia nostrum commodi adipisci est fugiat iure facilis laboriosam dolor dignissimos laborum sint doloribus veniam rerum perspiciatis dolorem voluptatibus quas fugit unde corporis ut obcaecati molestiae consectetur. Aspernatur, reprehenderit incidunt rem doloremque natus aliquam ad inventore nostrum? Soluta, quod fuga cumque vero amet est commodi deserunt dolor eveniet quia! Deserunt, est, ratione, consectetur, dolorum voluptatem provident saepe reiciendis natus quaerat fugit enim nam placeat vero voluptate odit tenetur corporis similique illo assumenda libero ipsa soluta exercitationem. Suscipit, reiciendis, aspernatur, natus unde non eos consectetur eum sit consequuntur perferendis velit nisi possimus voluptas minus quos tempore quaerat ratione rerum dolorem sapiente. Molestiae, omnis officiis fugit praesentium ipsa quos hic rerum dolorum? Ad, doloribus, aliquam veniam doloremque praesentium laboriosam nostrum dicta vel modi voluptate porro neque sequi nulla quis atque in tempora quasi aperiam excepturi dolores cumque fugiat libero. Cupiditate, impedit, ut exercitationem iusto beatae natus dolores voluptatibus itaque numquam consequuntur cumque ad voluptatem autem explicabo nisi doloribus repellat. Dolor, soluta ut accusamus voluptatem tempora nisi quisquam sint mollitia tenetur vel itaque voluptatibus impedit ducimus aliquid dolore quae exercitationem similique error inventore sunt harum quidem voluptate culpa. Accusamus, illum ea quod et distinctio quaerat repudiandae dolores perferendis quasi accusantium recusandae asperiores porro odit sapiente reiciendis exercitationem nesciunt aut tenetur! Tenetur, nobis amet repudiandae molestias omnis adipisci sint tempora aliquid quo libero nihil quasi consequatur culpa voluptas qui velit ullam doloribus at enim eveniet ratione fugiat quos facere beatae fugit reiciendis vero quisquam a animi ut veritatis cupiditate ex quod. Vero, cum mollitia doloribus libero officia facere expedita maxime et aut accusamus consequatur corporis. Ducimus, neque nesciunt ullam voluptatibus quos suscipit impedit maxime praesentium aliquid illum. Ratione, placeat, qui aspernatur reiciendis nemo tenetur nobis voluptates deleniti quae sit debitis odio quod vel. Nostrum, aperiam temporibus itaque consequuntur unde debitis fugit fugiat officiis exercitationem quisquam pariatur corporis dolorum libero non repudiandae. Incidunt inventore voluptas voluptate nesciunt. Dicta, neque, dolorem, cupiditate explicabo quaerat velit quibusdam labore inventore eum illum eveniet consequuntur reprehenderit voluptas. Cum, amet, eius, enim, asperiores ea culpa sed neque quasi qui voluptas facere reiciendis earum sunt voluptate sequi officiis beatae id distinctio dignissimos magnam debitis delectus aliquid quam obcaecati voluptates omnis laborum! Modi, officiis, ducimus, quidem, molestiae reiciendis ad tempore harum perferendis unde itaque veniam ratione vero placeat non molestias vitae quae voluptatum quibusdam iure id sunt tempora iusto rerum eius aliquam omnis quam laboriosam eligendi eaque saepe dignissimos doloremque quaerat sint maxime accusamus quisquam illo distinctio inventore iste nisi facere aliquid possimus ut velit animi beatae! Veritatis, odio nemo cum minus unde expedita nisi iure ducimus aliquam mollitia quod blanditiis in. Alias debitis hic molestias nulla repellendus id totam ducimus porro. Iure, quas, consequatur, autem facilis tempore unde officiis repellendus saepe delectus quisquam rerum quasi ipsa debitis earum distinctio ipsam eligendi libero animi neque quis atque molestiae sapiente. Magni, perspiciatis labore sunt doloribus doloremque? Repellat facilis in pariatur modi. Sed, dolores, ipsa, nam, amet deleniti at esse pariatur totam voluptas iste commodi est harum! Nesciunt, similique, nobis, sed accusamus aliquam ex eligendi natus quasi quam tempore ratione voluptatum non debitis quia voluptas aspernatur temporibus quo ad possimus officia autem aut animi iste ducimus deserunt facere illum maxime fuga pariatur incidunt molestias inventore veniam rerum veritatis consectetur itaque quos est adipisci velit omnis nemo quibusdam asperiores commodi mollitia exercitationem ut! Id, facere, consequuntur, error, exercitationem delectus rem natus totam quasi possimus illum incidunt vero aliquid tenetur quam laboriosam. Ducimus, atque, accusantium, vero laborum quo ratione iure recusandae id vel fuga praesentium repellendus quidem hic ex adipisci! Inventore, temporibus, magni, velit, iusto voluptate voluptatum ducimus officia dolorem molestiae at cumque ex distinctio laboriosam cupiditate sunt ullam amet tempore illo praesentium architecto neque eius sit ab quis vero nisi quae nobis doloribus perspiciatis excepturi sed delectus sint ratione laudantium aliquam vitae et. Labore, ipsum."
	$scope.close = function() {
		$scope.callToOwnerWindow("close");
	}
});

app.controller("ProxySettingsController", function($scope, $rootScope) {
	console.log("proxy settings dialog");
	if($scope.popup.port == undefined){
		$scope.popup.port = "8080";
	}
	$scope.ok = function() {
		$scope.callToOwnerWindow("save");
	}
});

app.controller("JsDocsController", function($scope) {
	console.log("js doc popup");
	$scope.popup.jsdocHtml = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellat, alias atque sequi facere beatae quidem accusantium ipsum magnam minus quos placeat nostrum doloremque tempore aut saepe explicabo consectetur perferendis vitae maiores odit excepturi ab quisquam laborum quae cum quo quas. Iste, illum, modi, deleniti pariatur et cupiditate libero nam magnam eligendi vero praesentium ex consequuntur maiores quod cumque. Nihil, vel, eveniet, numquam maxime nam minus quia autem nisi aliquid fugit harum amet cupiditate fuga et itaque temporibus error iusto illo quas facere rem possimus molestias provident porro quos id consectetur nobis commodi ut non dolor similique sint doloribus. Asperiores, voluptatum enim recusandae quam a ipsum velit! Exercitationem, obcaecati, reprehenderit quia commodi consectetur sapiente officiis sint dicta natus veniam voluptatum quidem placeat iste consequuntur nostrum amet eum et nemo at voluptate quasi voluptas ratione expedita repudiandae adipisci esse molestias. Voluptates, maxime, illo, laboriosam ea temporibus rem minima eum provident esse libero porro quisquam consequatur quos expedita consectetur quasi quibusdam dolor id commodi doloribus totam harum magnam aperiam doloremque voluptatem quo blanditiis ducimus quis perspiciatis ut. Expedita, saepe totam a laboriosam tempora unde ipsam rem laborum asperiores exercitationem nisi maiores numquam reprehenderit nobis porro esse labore dolor vero ipsum sequi molestiae odio."
});

