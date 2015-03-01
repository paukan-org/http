'use strict';

var scene = angular.module('Scene', []);
scene.controller('SceneCtrl', ['$interval', '$scope', function($interval, $scope) {


    // $scope.test = 'viewport';
    // $interval(function() {
    //     $scope.test = 'asd';
    //     // console.log(123);
    // }, 1000);

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

            function map(value, fromLow, fromHigh, toLow, toHigh) {
                return Math.round((value - fromLow) * (toHigh - toLow) / (fromHigh - fromLow) + toLow);
            }

            function setSize(diameter) {
                var lh, fs;
                if(diameter < 30) { diameter = 30; }
                lh = map(diameter, 30, 400, 32, 480);
                fs = map(diameter, 30, 400, 15, 330);
                elStyle.width = diameter + 'px';
                elStyle.height = diameter + 'px';
                elStyle.fontSize = fs + 'px';
                elStyle.lineHeight = lh + 'px';
            }

            scope.$watch('icon', function (value) {
                elSpan.className = 'icon icon-' + value;
            });
            scope.$watch('size', setSize);
            scope.$watch('x', function (value) {
                elStyle.left = value + 'px';
            });
            scope.$watch('y', function (value) {
                elStyle.top = value + 'px';
            });

            // default, primary, success, info, warning, danger, transparent
            scope.$watch('type', function (value) {
                el.className = 'btn btn-circle btn-'+(value || 'transparent');
            });
        }
    };
});

angular.module('editor', ['Scene']);
