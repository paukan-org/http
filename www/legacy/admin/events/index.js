'use strict';


var app = angular.module('Events', ['Global', 'ui.bootstrap']);

app.controller('EventCtrl', ['$scope', function($scope) {

    var event2class = {
        'state': 'text-success',
        'request': 'text-danger',
        'reply': 'text-muted'
    };

    $scope.events = [];

    $scope.$on('event', function(e, data) {

        var eventName = data[0], payload = data.slice(1).join(', ');
        var append = {
            name: eventName,
            payload: payload,
            time: new Date(),
            class: event2class[eventName.split('.')[0]]
        };

        $scope.$apply(function () {
            if($scope.events.length > 50) { $scope.events.length = 50; }
            $scope.events.unshift(append);
        });
    });

}]);
