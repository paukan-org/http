'use strict';

/**
 * Main scene controller
 */

var scene = angular.module('Scene', ['Button']);

scene.service('SceneService', ['$q', function($q) {

    var schema;
    /**
     * draw scene described in json
     */
    function loadScene(json) {
        return $q(function (resolve, reject) {
            schema = json; // store schema settings
            document.title = json.name + ' v.' + json.version; // set header
            loadStyle(json.style || '/assets/style.css'); // set own style css
            loadStyle(json.icons || '/assets/icons/styles.css'); // load iconset
            if(json.image) { // load scene background
                var img = document.createElement('img');
                img.src = json.image;
                document.querySelector('#scene').appendChild(img);
            }
            resolve();
        });
    }

    function loadStyle(href) {
        var el = document.createElement('link');
        el.rel = 'stylesheet';
        el.type ='text/css';
        el.href = href;
        document.querySelector('head').appendChild(el);
    }

    return {
        load: loadScene
    };

}]);

scene.controller('SceneCtrl', ['$scope', '$location', '$http', 'SceneService', function($scope, $location, $http, service) {

    var path = $location.path();
    if(!path) {
        return console.log('please specify scene name');
    }

    $scope.buttons = [
        { // eq, ne, gt, lr, ge, le
            'state.ups.raspberry.charge eq 100': {
                x: 10,
                y: 10,
                size: 10,
                icon: 'wifi-3',
                disabled: false,
                click: ['set.ups.raspberry.disabled 1', 'disabled']
            },
            'state.ups.raspberry.charge leq 50': {
                icon: 'wifi-2',
                disabled: false,
                click: ['set.ups.raspberry.dummy', 'state.ups.raspberry.charge eq 100']
            },
            'state.ups.raspberry.charge like *': {
                icon: 'wifi-1',
                disabled: false
            },
            'disabled': {
                icon: 'wifi-1',
                disabled: true,
                click: false
            }
        }
    ];

    // load scene schema and draw it on page
    $http.get('/scenes' + path + '.json')
        .then(function (res) {
            // 2do: validate https://github.com/mafintosh/is-my-json-valid
            return service.load(res.data);
        })
        .then(function (msg) {
            console.log(msg);
        })
        .catch(function (err) {
            console.error(err);
        })
        .finally(function () {
            console.log('end');
        });
}]);
