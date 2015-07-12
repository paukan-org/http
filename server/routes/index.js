'use strict';

module.exports = function (cfg, paukan) {

    var router = require('koa-router')({ prefix: '/api' });

    router.post('/request/:service/:device/:state', require('./request')(paukan.network));

    router.post('/redis', require('./redis')(paukan.network.redis));

    return router.routes();
};
