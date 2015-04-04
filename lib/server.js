'use strict';

var async = require('async');
var express = require('express');
var Primus = require('primus');
var ld = require('lodash-node');

var listenEvents = ['state.*.*.*', 'request.*.*.*', 'reply.*.*.*'];

function Server(cfg, service, callback) {

    this.cfg = cfg;
    this.service = service;

    this.createWebServer(callback);
}

Server.prototype.createWebServer = function(callback) {
    var app = express(), wwwroot = __dirname + '/../www';

    app.use(require('body-parser').json());
    app.use('/', express.static(wwwroot));

    app.all('/request/:service/:device/:state', this.proxyRequestAction.bind(this));
    app.all('/redis', this.proxyRedisAction.bind(this));

    app.use(function(req, res) { // default answer
        res.status(404).json({
            message: 'This is not the page you are looking for...'
        });
    });

    // error handler
    // app.use(function(err, req, res) {
    //     if (err.status === 401) {
    //         return res.status(401).json({
    //             message: 'You shall not pass'
    //         });
    //     }
    //     console.log('catched');
    //     console.log(err.stack ? err.stack : err);
    //     res.status(500).json({
    //         message: err.message || 'Something really bad happened!'
    //     });
    // });
    //

    var server = require('http').createServer(app);
    var primus = new Primus(server, {
        transformer: 'websockets',
        parser: 'JSON'
    });

    primus.on('connection', function connected(client) {
        // 2do: auth?
        console.log('client connected to websocket from', client.address);
    });

    var network = this.service.network;
    listenEvents.forEach(function (mask) {
        network.on(mask, function () { // handle events incoming over networj and proxy them to ws
            var argv = ld.values(arguments);
            argv.unshift(this.event);
            primus.write(argv);
        });
    });
    server.listen(this.cfg.listen, callback);
};

Server.prototype.errorResponce = function(res, err) {
    if(typeof err === 'string') {
        err = new Error(err);
    }
    return res.status(500).json({
        message: err.message || 'Something really bad happened!'
    });
};

// execute redis command and send responce (only on direct connection)
Server.prototype.proxyRedisAction = function(req, res) {
    var redis = this.service.network.redis,
        self = this;

    if(!redis) {
        return this.errorResponce(res, new Error('this type of connection dont support redis requests'));
    }
    var payload = req.query.run ? req.query.run : req.body.run,
        cmd = payload.shift();

    if(typeof redis[cmd] !== 'function') {
        return this.errorResponce(res, new Error(cmd +': is not a valid redis function'));
    }
    payload.push(function () {
        var arg = ld.values(arguments),
            err = arg.shift();
        if (err) {
            return self.errorResponce(res, err);
        }
        res.json(arg);
    });

    redis[cmd].apply(redis, payload);
};

// curl -H "Content-type: application/json" -d '{"set": "qweasd"}' http://127.0.0.1:8080/request/test/test1/switch
// curl http://127.0.0.1:8080/request/test/test1/counter

// send action to queue
Server.prototype.proxyRequestAction = function(req, res) {

    var payload = [], replyId,
        timeout,
        setString = req.query.set ? req.query.set : req.body.set,
        nowait = req.query.nowait ? req.query.nowait : req.body.nowait,
        params = req.params,
        network = this.service.network,
        self = this;

    if(setString) {
        if(typeof setString === 'string') {
            payload = setString.split(',');
        } else if (setString.length) {
            payload = setString;
        }
    }

    if(payload.length) {
        replyId = payload[0];
    }

    if(nowait || !replyId) {
        res.json({});
    } else {
        var replyEvent = ['reply', params.service, replyId, params.state].join('.');

        var callback = ld.once(function(err, result) {
            clearTimeout(timeout);
            network.local.removeListener(replyEvent, callback);
            if(err) {
                return self.errorResponce(res, err);
            }
            return res.json(result);
        });

        timeout = setTimeout(callback, 3000, new Error('answer timeout'));
        network.local.once(replyEvent, callback);
    }

    payload.unshift(
        ['request', params.service, params.device, params.state].join('.')
    );
    return network.emit.apply(network, payload);
};

Server.prototype.generateReplyId = function() {
    return Math.random().toString(36).substr(2, 5);
};

module.exports = Server;
