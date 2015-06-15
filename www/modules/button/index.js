/**
 * Rounded buttons for web gui
 */
'use strict';

var module = angular.module('Button', ['Api']); // jshint ignore:line

var allowedOperands = {
    eq: function (a, b) { return a == b; }, // jshint ignore:line
    ne: function (a, b) { return a != b; }, // jshint ignore:line
    gt: function (a, b) { return a > b; },
    lr: function (a, b) { return a < b; },
    ge: function (a, b) { return a >= b; },
    le: function (a, b) { return a <= b; },
    like: function (a, b) {
        var patt = new RegExp(b);
        return patt.rest(a);
    }
};

module.directive('ngButton', ['ApiService', function(Api) {
    return {
        replace: true,
        scope: { config:'=' },
        template: '<a class="btn btn-default btn-circle" ng-click="click($event)"><span class=""></span></a>',
        link: function (scope, element, attr) {

            var el = element[0],
                elSpan = el.childNodes[0],
                elStyle = el.style,
                config = scope.config,
                eventMap = {}, currentState = {};

            /**
             * handle click on button
             */
            scope.click = function () {

                var click = currentState.click,
                    action = click[0], state = click[1];
                if(action) {
                    console.log('send ' + action);
                    // var bind = eventName.split('.');
                    // Api.request(bind[0], bind[1], bind[2], [click]);
                }
                if(state) {
                    setState(state);
                }
            };

            // // scope.$watch('config', redraw);

            /**
             * convert string event to callback and put it to map
             */
            function event2map(str, map) {

                var arr = str.split(' '), name = arr[0], payload;
                if(arr.length === 1) { // 'event' => always true on this event
                    payload = function () { return str; };
                } else if(arr.length === 3 && allowedOperands[arr[1]]) { // 'event eq 10' => [event, operand, value]
                    payload = function (value) {
                        if(allowedOperands[arr[1]](value, arr[2])) {
                            return str;
                        }
                    };
                } else { // wrong event format
                    return;
                }
                if(typeof map[name] === 'undefined') {
                    map[name] = [];
                }
                map[name].push(payload);
            }

            /**
             * update button state
             */
            function setState(id) {

                console.log('[button] execute state "'+id+'""');
                var state = config[id];
                for(var i in state) {
                    currentState[i] = state[i];
                }
                redraw();
            }

            /**
             * update button visible ui according current state
             */
            function redraw() {

                el.className = 'btn btn-circle btn-' + (currentState.type || 'default');
                elSpan.className = 'icon icon-' + currentState.icon;
                // elStyle.width = config.size + 'vmin'; // recalc
                // elStyle.height = config.size + 'vmin';
                // elStyle.fontSize = (config.size - 4) + 'vmin';
                // elStyle.lineHeight = config.size + 'vmin';
                // elStyle.left = config.x + 'vmin';
                // elStyle.top = config.y + 'vmin';
            }

            // prepare map of events with links to states
            var firstEvent;
            for(var event in config) {
                if(typeof config[event] === 'object') {
                    event2map(event, eventMap);
                    if(!firstEvent) {
                        firstEvent = event;
                    }
                }
            }

            // set first state for button by default
            setState(firstEvent);

            // handle incoming events and test against our prepared map
            scope.$on('event', function (event, data) {

                var id = (eventMap[event] || []).filter(function (test) {
                    return test(data);
                });
                if(id) { // we found new state
                    setState(id);
                }
            });
        }
    };
}]);
