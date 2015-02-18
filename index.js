/*eslint-env node*/
'use strict';

var Hapi = require('hapi');
var Boom = require('boom');
var api = require('./api');

var server = new Hapi.Server();

server.connection({
    port: process.env.PORT
});

server.route({
    method: 'GET',
    path: '/{qtType}/{year}/{month}/{day}',
    handler: function (req, reply) {
        var qtType = req.params.qtType;
        if (!api.isValidQTType(qtType)) {
            return reply(Boom.badRequest('Unknown qtType'));
        }
        api.get(
          req.params.year, req.params.month, req.params.day,
          req.params.qtType, 1001,
          function(verses) {
              reply(verses);
        });
    }
});

server.start();
