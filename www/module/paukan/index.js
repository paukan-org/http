/**
 * Perform request to paukan network over paukan-http API
 */
'use strict';

var app = angular.module('Paukan', []);

app.factory('primus', function() {
    if(!Primus) { Primus = null; }    return Primus.connect();
});

app.service('PaukanService', ['primus', '$rootScope', '$http', function(primus, $rootScope, $http) {
    // emit event from network like 'state.service.device.item' with payload
    // ['state.*.*.*', 'request.*.*.*', 'reply.*.*.*']
    primus.on('data', function (data) {
        $rootScope.$broadcast('event', data);
    });

    // send request to API and execute in form 'requiest.{service}.{device}.{state}'
    function request(service, device, state, payload, callback) {
        var body = { set: payload };
        if(!callback) {
            callback = function() {};
            body.nowait = true;
        }
        $http.post('/'+['request', service, device, state].join('/'), body)
            .success(function (data, status, headers, config) {
                return callback(null, data);
            })
            .error(function (data, status, headers, config) {
                return callback(new Error(data.message ? data.message : data));
            });
    }

    function redis() {
        var arg = [], callback, handleResponce, body = {};

        for(var i in arguments) {
            arg.push(arguments[i]);
        }
        callback = typeof arg[arg.length - 1] === 'function' ? arg.pop() : function (err) {
            if(err) {
                console.log('[err]', err.message);
            }
        };
        body.run = arg;

        $http.post('/redis', body)
            .success(function (data, status, headers, config) {
                data.unshift(null);
                return callback.apply(null, data);
            })
            .error(function (data, status, headers, config) {
                return callback(new Error(data.message ? data.message : data));
            });
    }

    return {
        request: request,
        redis: redis
    };

}]);
