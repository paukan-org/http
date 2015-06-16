'use strict';

/**
 * Main scene controller
 */

var module = angular.module('Scene', ['Button']); // jshint ignore:line

module.service('SceneService', ['$q', function($q) {

    var schema;
    /**
     * draw scene described in json
     */
    function loadScene(json, scope) {
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
            for(var i in json.buttons) { // append buttons
                scope.buttons.push(json.buttons[i]);
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
    function mapX(value) {
        return value  * window.innerWidth / schema.resolution.width;
    }

    function mapY(value) {
        return value  * window.innerHeight / schema.resolution.height;
    }

    function getSchema() {
        return schema || {};
    }

    return {
        load: loadScene,
        schema: getSchema,
        mapX: mapX,
        mapY: mapY
    };

}]);

module.controller('SceneCtrl', ['$scope', '$location', '$http', 'SceneService', function($scope, $location, $http, service) {

    var path = $location.path();
    if(!path) {
        return console.log('please specify scene name');
    }

    $scope.buttons = [];

    // load scene schema and draw it on page
    $http.get('/scenes' + path + '.json')
        .then(function (res) {
            // 2do: validate https://github.com/mafintosh/is-my-json-valid
            return service.load(res.data, $scope);
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
