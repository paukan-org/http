#!/usr/bin/env node

'use strict';

var core = require('paukan-core');
var async = require('async');

var config = core.common.serviceConfig(require('./config.json'), require('./package.json'));
var Server = require('./lib/server');

var service, http;
async.series([
    function (next) { // create basic service
        service = new core.Service(config, next);
    },
    function (next) { // launch http + ws server
        http = new Server(config, service, next);
    }
], function (err) {
    if(err) { throw err; }
    console.log('Web service started on %s port', config.listen);
});
