'use strict';

module.exports = function (cfg, paukan) {

    var app = require('koa')();
    app
        .use(require('koa-response-time')())
        .use(require('koa-logger')())
        .use(require('koa-helmet').defaults())
        .use(require('koa-helmet').xframe('SAMEORIGIN'))
        .use(require('koa-body')())
        .use(require('koa-static')(__dirname + '/../client'))
        .use(require('./routes')(cfg, paukan));

    var server = app.listen(cfg.listen);
    require('./rtsp')(server, cfg.rtsp);
    paukan.log.info('Server started on port', cfg.listen);
    return app;
};
