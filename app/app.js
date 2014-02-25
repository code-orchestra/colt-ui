
var app = angular.module("COLT", []);

app.run(function($rootScope, $http) {
	$http.get('data.json')
	.then(function(res) {
		$rootScope.model = res.data.xml;
	});
});

app.controller("SettingsCtrl", function($scope) {
	
	
});