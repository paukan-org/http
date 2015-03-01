'use strict';

var scene = angular.module('Scene', []);
scene.controller('SceneCtrl', ['$interval', '$scope', function($interval, $scope) {

    var info = {};

    function recalcRatio() {
        var width = window.innerWidth || document.body.clientWidth,
            height = window.innerHeight || document.body.clientHeight,
            bg = info.background;

        info.ratio = {
            width: width / bg.width,
            height: height / bg.height
        };
        return info.ratio;
    }

    function setBackground(url) {

        $scope.background = {
            backgroundImage: 'url('+url+')',
            backgroundSize: 'cover'
        };

        var img = new Image();
        img.src = url;
        img.onload = function () {
            info.background = {
                url: url,
                width: img.width,
                height: img.height
            };
            recalcRatio();
        };
    }

    function scale(el, ratio) {

        // var k = ratio.width > ratio.height ? ratio.width : ratio.height;
        // if(!el.realSize) {
        //     el.realSize = Math.round(el.size / k);
        // }
        // el.size = Math.round(el.realSize * k);
    }

    function redrawElementsOnResize() {
        var ratio = recalcRatio(),
            k = ratio.width > ratio.height ? ratio.width : ratio.height;
        $scope.$apply(function () {
            $scope.buttons.forEach(function (button) {
                scale(button, ratio);
            });
        });
        console.log('current ratio', ratio);
    }

    setBackground('images/plan.jpg');

    var resizeInProgress, resizeFlag;
    window.onresize = function () {
        resizeFlag = true;
        if(resizeInProgress) { return; }
        if(resizeFlag) {
            redrawElementsOnResize();
            resizeFlag = false;
        }
        resizeInProgress = setTimeout(function() {
            resizeInProgress = null;
        }, 1000);
    };

    $scope.buttons = [{
        type: 'default',
        x: 100,
        y: 100,
        size: 100,
        icon: 'pee'
    },
    // {
    //     type: 'default',
    //     x: 100,
    //     y: 120,
    //     size: 100,
    //     icon: 'lightning-1'
    // }];
    ];

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
