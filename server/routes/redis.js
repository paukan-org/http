'use strict';

// curl -H "Content-Type: application/json" -X POST -d '{ "cmd": "set", "payload": ["key", "value"]}' http://localhost:8080/api/redis
module.exports = function (redis) {

    if(!redis) {
        throw new Error('this type of connection dont support redis requests');
    }

    return function *() {

        var body = this.request.body,
            cmd = body.cmd,
            payload = body.payload;

        if(this.request.method !== 'POST' || !cmd || !payload.length) {
            this.throw('please send json POST request in format { cmd: "set", payload: ["key", "value"] }', 400);
        }

        if(typeof redis[cmd] !== 'function') {
            this.throw(cmd +': is not a valid redis function', 400);
        }

        function exec(callback) {
            payload.push(callback);
            redis[cmd].apply(redis, payload);
        }
        this.body = yield exec;
    };
};
