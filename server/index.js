'use strict';

var app = require('koa')();
var debug = require('debug');
var core = require('paukan-core');
var cfg = core.common.serviceConfig(require('../config.json'), require('../package.json'));

debug.enable('server');

app
    .use(require('koa-response-time')())
    .use(require('koa-logger')())
    .use(require('koa-helmet').defaults())
    .use(require('koa-static')(__dirname + '/../client'))
    .use(require('./routes'));

var server = app.listen(cfg.listen);
require('./rtsp')(server, cfg.rtsp);

debug('server')('Application started on port');
