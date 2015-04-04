'use strict';

var scene = angular.module('Scene', ['Button']);

scene.controller('SceneCtrl', ['$scope', function($scope) {

/*
- при создании кнопки подписываемся на событие 'state.{bind}' и создаем хэндлер
- при наступлении события проходим по {states} и выполняем подходящее условие
 */
    $scope.buttons = [{
        x: 10, y: 10, size: 10,
        bind: ['service', 'device', 'statename'],
        states: [
            {
                if: ['<', 10], // if: ['<', '>', '=', '*']
                then: {
                    type: 'danger'
                },
                click: 1
            }, {
                then: {
                    type: 'default',
                    icon: 'pee'
                },
                click: 0
            }
        ]
    }];


}]);
angular.module('editor', ['Scene']);
