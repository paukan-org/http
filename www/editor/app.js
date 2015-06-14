'use strict';

var scene = angular.module('Scene', ['Button']);

scene.controller('SceneCtrl', ['$scope', function($scope) {

/*
- при создании кнопки подписываемся на событие 'state.{bind}' и создаем хэндлер
- при наступлении события проходим по {states} и выполняем подходящее условие
 */
    $scope.buttons = [{
        x: 40, y: 40, size: 10,
        states: [ // if: ['<', '>', '=', '*']
            {
                if: ['ups.raspberry.charge', '=', 100],
                then: {
                    type: 'default',
                    icon: 'wifi-3'
                },
                click: 0
            },
            {
                if: ['ups.raspberry.charge', '<', 30],
                then: {
                    type: 'danger',
                    icon: 'wifi-1'
                },
                click: 1
            },
            {
                if: ['ups.raspberry.charge', '<', 100],
                then: {
                    type: 'warning',
                    icon: 'wifi-2'
                },
                click: 1
            }
        ]
    }];


}]);
angular.module('editor', ['Scene']);
