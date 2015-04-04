/**
 * Rounded buttons for web gui
 */
'use strict';

var module = angular.module('Button', ['Api']);

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
                name = 'state.'+config.bind.join('.'),
                states = config.states,
                currentState;

            elStyle.width = config.size + 'vmin';
            elStyle.height = config.size + 'vmin';
            elStyle.fontSize = (config.size - 4) + 'vmin';
            elStyle.lineHeight = config.size + 'vmin';
            elStyle.left = config.x + 'vmin';
            elStyle.top = config.y + 'vmin';

            function redraw() {

                elSpan.className = 'icon icon-' + config.icon;
                // default, primary, success, info, warning, danger, transparent
                el.className = 'btn btn-circle btn-' + (config.type || 'default');
            }

            function updateState(num) {

                console.log('[button] execute state #'+num);
                var state = states[num],
                    then = state.then || {};
                for(var i in then) {
                    config[i] = then[i];
                }
                currentState = num;
            }

            function isStateSuitable(state, value) {

                var stateIf = state.if;
                if(stateIf.length !== 2) { return; }

                var operand = stateIf[0],
                    testValue = stateIf[1];

                switch(operand) {
                    case '<':
                        return value < testValue;
                    case '>':
                        return value > state.value;
                    case '=':
                        return value == state.value; // '==' is correct
                    case '*':
                        var patt = new RegExp(testValue);
                        return patt.test(value);
                    default:
                        return;
                }
            }

            // value passed - try to find suitable state
            // if state not found or value not passed - will pick first default one
            function switchState(value) {

                var isEmptyValue = typeof value === 'undefined',
                    suitableState;
                // find first suitable state
                for(var i=0, l = states.length; i < l; i++) {
                    var state = states[i];
                    if(!state.if) {
                        suitableState = i;
                        if(isEmptyValue) { break; } // first button init and default state found - exit
                    } else {
                        if(isStateSuitable(state, value)) {
                            suitableState = i;
                            break;
                        }
                    }
                }

                if(typeof suitableState === 'undefined') {
                    return console.log('[err] not found suitable state for button');
                }

                updateState(suitableState);
                redraw();
            }

            scope.click = function () {
                console.log('send to request.'+config.bind.join('.')+' value '+states[currentState].click);
                var bind = config.bind;
                Api.request(bind[0], bind[1], bind[2], [states[currentState].click]);
            };

            // scope.$watch('config', redraw);
            switchState();

            scope.$on('event', function (event, data) {

                var eventName = data[0],
                    value = data[1];

                if(name !== eventName) { return; }
                switchState(value);
            });
        }
    };
}]);
