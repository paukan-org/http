'use strict';

module.exports = function (cfg, paukan) {

    var app = require('koa')();
    app
        .use(require('koa-response-time')())
        .use(require('koa-logger')())
        .use(require('koa-helmet').defaults())
        .use(require('koa-body')())
        .use(require('koa-static')(__dirname + '/../client'))
        .use(require('./routes')(cfg, paukan));

    var server = app.listen(cfg.listen);
    require('./rtsp')(server, cfg.rtsp);

    return app;
};
