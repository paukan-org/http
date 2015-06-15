/**
 * Perform request to paukan network over paukan-http API
 */
'use strict';

var module = angular.module('Api', []); // jshint ignore:line

module.factory('primus', function() {
    return Primus.connect(); // jshint ignore:line
});

module.service('ApiService', ['primus', '$rootScope', '$http', function(primus, $rootScope, $http) {
    // emit event from network like 'state.service.device.item' with payload
    // ['state.*.*.*', 'request.*.*.*', 'reply.*.*.*']
    primus.on('data', function (data) {
        $rootScope.$broadcast('event', data);
    });

    // send request to API and execute in form 'requiest.{service}.{device}.{state}'
    function request(service, device, state, payload, callback) {
        return send(['request', service, device, state].join('.'), payload, callback);
    }

    // send raw request
    function send(event, payload, callback) {
        var body = { set: payload };
        if(!callback) {
            callback = function() {};
            body.nowait = true;
        }
        $http.post('/'+event.replace(/\./g, '/'), body)
            .success(function (data, status, headers, config) {
                return callback(null, data);
            })
            .error(function (data, status, headers, config) {
                return callback(new Error(data.message ? data.message : data));
            });
    }

    // execute redis function
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
        send: send,
        redis: redis
    };

}]);
