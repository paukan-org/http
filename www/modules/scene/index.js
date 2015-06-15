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
            // find used modules and load corresponding schemas
            var modules = (json.modules || []).map(function (v) {
                return v.type;
            }).filter(function (value, index, arr) {
                return arr.indexOf(value) === index;
            });
            console.log(modules);
            resolve('done :)');
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

    $scope.buttons = [{
        "type": "button",
        "relative": true,
        "x": 0,
        "y": 40,
        "size": 10,
        "actions": [
            {
                "on": {
                    "event": ["ups.raspberry.charge", "eq", "100"],
                    "type": "default",
                    "icon": "wifi-3"
                },
                "click": {
                    "send": ["ups.some.action", "123"],
                    "icon": "wifi-2"
                }
            }
        ]
    }];

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
