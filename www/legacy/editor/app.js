'use strict';

var scene = angular.module('Scene', []);

scene.controller('SceneCtrl', ['$scope', function($scope) {

/*
- при создании кнопки подписываемся на событие 'state.{bind}' и создаем хэндлер
- при наступлении события проходим по {states} и выполняем подходящее условие
 */
    $scope.buttons = [{
        // type: 'default',
        x: 10,
        y: 10,
        size: 10,
        icon: 'pee',
        bind: 'service.device.statename',
        states: [
            {
                if: '<', // >, <, =, * where "*" = regular expression
                val: 10,
                then: {
                    type: 'danger'
                }
            },
            {
                then: {
                    type: 'default'
                }
            }
        ]
    }];

}]);

scene.directive('ngButton', function() {
    return {
        replace: true,
        scope: {
            icon: '@icon', size: '@size', x: '@x', y: '@y', type: '@type'
        },
        template: '<a class="btn btn-default btn-circle"><span class=""></span></a>',
        link: function (scope, element, attr) {
            var el = element[0],
                elSpan = el.childNodes[0],
                elStyle = el.style;

            scope.$watch('icon', function (value) {
                elSpan.className = 'icon icon-' + value;
                // elSpan.innerHTML = '1';
            });
            scope.$watch('size', function (value) {
                elStyle.width = value + 'vmin';
                elStyle.height = value + 'vmin';
                elStyle.fontSize = (value - 4) + 'vmin';
                elStyle.lineHeight = value + 'vmin';
            });
            scope.$watch('x', function (value) {
                elStyle.left = value + 'vmin';
            });
            scope.$watch('y', function (value) {
                elStyle.top = value + 'vmin';
            });

            // default, primary, success, info, warning, danger, transparent
            scope.$watch('type', function (value) {
                el.className = 'btn btn-circle btn-'+(value || 'default');
            });
        }
    };
});

angular.module('editor', ['Scene']);
