'use strict';

var router = require('koa-router')({
    prefix: '/api'
});

router.all('/request/:service/:device/:state', require('./request'));
router.all('/redis', require('./redis'));

module.exports = router.routes();
