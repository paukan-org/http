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
                states = config.states,
                eventMap = {},
                currentState;

            function redraw() {

                // default, primary, success, info, warning, danger, transparent
                el.className = 'btn btn-circle btn-' + (config.type || 'default');

                elSpan.className = 'icon icon-' + config.icon;

                elStyle.width = config.size + 'vmin';
                elStyle.height = config.size + 'vmin';
                elStyle.fontSize = (config.size - 4) + 'vmin';
                elStyle.lineHeight = config.size + 'vmin';

                elStyle.left = config.x + 'vmin';
                elStyle.top = config.y + 'vmin';
            }

            //
            function switchState(num) {

                console.log('[button] execute state #'+num);
                var state = states[num],
                    then = state.then || {};
                for(var i in then) {
                    config[i] = then[i];
                }
                currentState = num;
                redraw();
            }

            function testState(action, value) {

                switch(action.operand) {
                    case '<':
                        return value < action.value;
                    case '>':
                        return value > action.value;
                    case '=':
                        return value == action.value; // '==' is correct
                    case '*':
                        var patt = new RegExp(action.value);
                        return patt.test(value);
                    default:
                        return true; // simply event fired
                }
            }

            // find suitable state according event map and passed event value
            function findState(map, value) {

                for(var i=0, l = map.length; i < l; i++) {
                    var action = map[i];
                    if(testState(action, value)) {
                        return action.stateID;
                    }
                }
                return false;
            }

            scope.click = function () {
                var state = states[currentState],
                    click = state.click,
                    eventName = state.if && state.if[0];
                console.log('send to request.'+eventName+' value '+click);
                var bind = eventName.split('.');
                Api.request(bind[0], bind[1], bind[2], [click]);
            };

            // scope.$watch('config', redraw);

            // prepare map of events with links to states
            states.forEach(function (v, k) {
                var vIf = v.if;
                if(vIf && vIf.length) {
                    var name = 'state.'+vIf[0];
                    if(typeof eventMap[name] === 'undefined') {
                        eventMap[name] = [];
                    }
                    eventMap[name].push({
                        stateID: k,
                        operand: vIf[1],
                        value: vIf[2]
                    });
                }
            });

            switchState(0); // set default state

            scope.$on('event', function (event, data) {

                var name = data[0],
                    value = data[1],
                    newStateId;

                if(
                    typeof eventMap[name] !== 'undefined' &&
                    (newStateId = findState(eventMap[name], value)) !== false &&
                    currentState !== newStateId
                ) {
                    switchState(newStateId);
                }
            });
        }
    };
}]);
