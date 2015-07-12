'use strict';

// curl -H "Content-Type: application/json" -X POST -d '["qwe", "asd"]' http://localhost:8080/api/request/service/device/state
// curl -H "Content-Type: application/json" -X POST -d '["qwe"]'  http://localhost:8080/api/request/service/device/state
module.exports = function (network) {

    return function *(next) {
        var params = this.params,
            payload = this.request.body.length && this.request.body || [],
            replyID = payload[0],
            requestEvent = ['request', params.service, params.device, params.state].join('.');

            function wait(callback) {
                var timeout, replyEvent = ['reply', params.service, replyID, params.state].join('.');

                function cb(err, response) {
                    clearTimeout(timeout);
                    network.local.removeListener(replyEvent, callback);
                    if(err) { // timeout
                        return callback(err);
                    }
                    if(response[0]) { // error in response
                        response[0] = new Error(response[0]);
                    }
                    return callback.apply(null, response);
                }

                // subscribe to answer
                timeout = setTimeout(cb, 3000, new Error('answer timeout for '+requestEvent));
                network.local.once(replyEvent, cb);
            }

        // emit event
        payload.unshift(requestEvent);
        network.emit.apply(network, payload);

        if(replyID) { // wait for responce
            this.body = yield wait;
        } else { // no reply id specified
            this.body = {};
        }
    };
};
