(function(Reflux, global) {
    'use strict';

    global.eventStore = Reflux.createStore({

        onEditItem: function(itemKey, newLabel) {
            //
        },
        // called whenever we change a list. normally this would mean a database API call
        update: function(list) {
            // localStorage.setItem(localStorageKey, JSON.stringify(list));
            this.trigger(list);
        },
        // this will be called by all listening components as they register their listeners
        getInitialState: function() {

            return 'qwe';
        }
    });

})(window.Reflux, window);
