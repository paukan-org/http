'use strict';
var Promise = require('bluebird');
var core = require('paukan-core');
var createHttp = require('./server');

var cfg = core.common.serviceConfig(require('./config.json'), require('./package.json'));

module.exports = Promise.fromNode(function (done) {
    // create paukan service instance
    new core.Service(cfg, done);
}).then(function (service) {
    // create webservice instance
    createHttp(cfg, service);
});
