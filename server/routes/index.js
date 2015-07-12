'use strict';

module.exports = function (cfg, paukan) {

    var router = require('koa-router')({
        prefix: '/api'
    });

    router.all('/request/:service/:device/:state', require('./request'));
    router.post('/redis', require('./redis')(paukan.network.redis));

    return router.routes();
};
