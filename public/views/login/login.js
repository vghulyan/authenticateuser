app.controller("LoginCtrl", function($scope, $http, $rootScope, $location) {
	$scope.login = function(user) {
		$http.post('/login', user).success(function(response) {
			$rootScope.currentUser = user;
			$location.url("/profile");
		}).error(function(data, status) {
			$scope.errorMessage = "STATUS: " + status + " AUTHORISATION: " + data;
		});
	}
});