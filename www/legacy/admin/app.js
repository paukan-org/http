'use strict';

var app = angular.module('admin', ['Global', 'Events', 'Services']);
    // .config(function() {})
app.run(['$rootScope', 'GlobalService', function($rootScope) {}]);
