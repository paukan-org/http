'use strict';


var app = angular.module('Global', ['ui.bootstrap']);

app.factory('primus', function() {
    return Primus.connect();
});

app.service('GlobalService', ['primus', '$rootScope', '$http', function(primus, $rootScope, $http) {
    // emit event from network like 'state.service.device.item' with payload
    primus.on('data', function (data) {
        $rootScope.$broadcast('event', data);
    });

    function request(service, device, state, payload, callback) {
        var body = { set: payload };
        if(!callback) {
            callback = function() {};
            body.nowait = true;
        }
        $http.post('/'+['request', service, device, state].join('/'), body).
            success(function (data, status, headers, config) {
                return callback(null, data);
            }).
            error(function (data, status, headers, config) {
                return callback(new Error(data));
            });
    }

    return {
        request: request
    };

}]);
