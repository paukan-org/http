'use strict';

var app = angular.module('test', ['Api']);

app.controller('TestCtrl', ['$scope', 'ApiService', function($scope, Api) {

    // $scope.$on('event', function (event, data) {
    //     var name = data.shift();
    //     console.log('>>>');
    //     console.log(name);
    //     console.log(data);
    // });
    // Paukan.redis('lrange', '222', 1, -1, function (err, res) {
    //     if(err) {
    //         console.log(err.message);
    //     } else {
    //         console.log(res);
    //     }
    // });

}]);
