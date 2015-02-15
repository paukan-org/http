'use strict';

var app = angular.module('Services', ['Global']);

// load inventory on start
// mark disabled on 'offline'
// periodicaly ping
// update inventory on 'online'
app.controller('ServiceCtrl', ['$scope', 'GlobalService', function($scope, global) {

    var services = {};
    var devices = {};

    function discovery() {
        global.request('global', 'any', 'discover', ['uiadmin']);
    }

    function disable(serviceId, value) {
        services[serviceId].disabled = value;
        for(var deviceId in devices) {
            var device = devices[deviceId];
            if(device.service === serviceId) {
                device.disabled = value;
            }
        }
    }

    $scope.$on('event', function(e, data) {
        var eventName = data[0].split('.'), serviceId;

        // reply.http.test.discover [null, Object]
        if(eventName[0] === 'reply' && eventName[3] === 'discover') {
            var service = data[2];
            $scope.$apply(function () {
                services[service.id] = service;
                service.devices.forEach(function (device) {
                    device.service = service.id;
                    devices[service.id+'.'+device.id] = device;
                });
            });
        }

        // state.test.service.offline
        if(eventName[2] === 'service' && eventName[3] === 'offline') {
            serviceId = eventName[1];
            if(services[serviceId]) {
                $scope.$apply(function () {
                    disable(serviceId, true);
                });
            }
        }

        // state.test.service.online
        if(eventName[2] === 'service' && eventName[3] === 'online') {
            serviceId = eventName[1];
            if(services[serviceId]) {
                $scope.$apply(function () {
                    disable(serviceId, false);
                });
            } else {
                discovery();
            }
        }

    });

    setTimeout(discovery, 1000);

    $scope.select = function(item) {
        $scope.displayButtons = Object.keys(item.states).length;
        $scope.selected = item;
    };

    $scope.request = function(item, action, value) {
        var payload = value ? [null, value] : [ item.id ];
        if(typeof item.devices !== 'undefined') { // this is service
            global.request(item.id, 'service', action, payload);
        } else { // this is device
            global.request(item.service, item.id, action, payload);
        }
    };

    $scope.services = services;
    $scope.devices = devices;
    $scope.selected = null;
}]);
