'use strict';
var rtsp = require('rtsp-ffmpeg');

function createStreamListener (io, name, uri) {
    var stream = new rtsp.FFMpeg({ input: uri });
    io.on('connection', function (socket) {
        var pipeStream = function pipeStream(data) {
            socket.emit('data', {
                type: 'rtsp',
                name: name,
                data: data.toString('base64')
            });
        };
        stream.on('data', pipeStream);
        socket.on('disconnect', function() {
            stream.removeListener('data', pipeStream);
        });
    });
}

module.exports = function (server, streams) {
    var io = require('socket.io')(server);
    for(var name in streams) {
        createStreamListener(io, name, streams[name]);
    }
};
