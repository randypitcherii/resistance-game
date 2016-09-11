var app = angular.module('app', []);

app.controller('getGames', ['$scope', '$http', function ($scope, $http) {
 	$http.get('/getGames').success(function(data) {
 		$scope.games = data;
 	})
}]);