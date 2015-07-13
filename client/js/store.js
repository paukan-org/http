(function(Reflux, EventActions, global) {
    'use strict';

    var events = [];
    global.eventStore = Reflux.createStore({
        listenables: [EventActions],

        init: function () {
            console.log('store eventStore initialized');
        },

        onIncomingEvent: function(event) {
            events.unshift(event);
            this.trigger();
        },

        getLastEvents: function () {
            return events.slice(0, 20);
        }

    });

})(window.Reflux, window.eventActions, window);
