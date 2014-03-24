app.service('analyticsService', function($rootScope, $window) {
	var track = function(event, toState) {
		window.ga('send', 'pageview', {'page': toState.url + ".html"});   
		console.log("track-page", toState.url + ".html");    
	};
	$rootScope.$on('$stateChangeSuccess', track);
}
);