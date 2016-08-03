'use strict';

const vscode = require('vscode')
    , settings = require('./settings')
    , prompt = require('./prompt')
    , redisClient = require('./redis_client')
    , consts = require('./consts')
    , msg = require('./message_handler');

let servers = [];

let init = () => {
    settings.load()
        .then(config =>
            config.databases.forEach(database => servers.push({ name: database.name, url: database.url })))
        .catch(err => msg.error(err));
};

let newConnection = () => 
    prompt.safeInput('redis://localhost:6379', 'e.g. redis://localhost:6379', 'server address').then(addr => 
        prompt.safeInput('local', 'e.g. qa redis', 'connection alias').then(name => {
            let server = { name: name, url: addr };
            let changed = false;

            servers.forEach((element, index) => {
                if (element.name == name) {
                    servers[index] = server;
                    changed = true;
                }
            });

            if (!changed) {
                servers.push(server);
            }

            settings.save(servers).catch((err) => msg.error(err));
            connect(server);
        }));

let connect = (server) => redisClient.connect(server)

let changeServer = () => 
    servers.length == 0
        ? newConnection()
        : prompt.strictPick(servers.map(x => x.name), 'choose redis connection').then(choice => 
            connect(servers.find(x => x.name == choice)));

let help = () => msg.showMessageOnConsole(consts.help);

let execute = () => 
    prompt.strictInput('provide the command', 'command').then(input => 
        redisClient.get().then(c => c.send_command(input, (err, reply) => redisClient.handleStr(err, input, reply))));

let info = () => 
    redisClient.get().then(c => c.send_command('info', (err, reply) => redisClient.handleStr(err, 'INFO', reply)));

let get = () => 
    prompt.strictInput('provide key', 'key').then(input => 
        redisClient.get().then(c => c.get(input, (err, reply) => redisClient.handleStr(err, `GET:${input}`, reply))));

let set = () => 
    prompt.strictInput('provide key', 'key').then(key => 
        prompt.safeInput('', 'provide value', 'value').then(value =>
            redisClient.get().then(c => c.set(key, value, (err, reply) => redisClient.handleStr(err, 'SET', `key: ${key} | value: ${value}`)))));

let hset = () =>
    prompt.strictInput('provide hash key', 'key').then(key =>
        prompt.strictInput('provide field name', 'field').then(field =>
            prompt.safeInput('', 'provide field value', 'value' ).then(value => 
                redisClient.get().then(c => c.hset(key, field, value, (err, reply) => redisClient.handleStr(err, 'HSET', `hash: ${key} | field: ${field} value: ${value}`))))));

let hget = () => 
    prompt.strictInput('provide hash key', 'key').then(key => 
        prompt.strictInput('provide field name', 'field').then(field =>
            redisClient.get().then(c => c.hget(key, field, (err, reply) => redisClient.handleStr(err, `HGET:${key}:${field}`, reply)))));

let del = () => 
    prompt.strictInput('provide key to be removed', 'key').then(input =>
        redisClient.get().then(c => c.del(key, (err, reply) => redisClient.handleStr(err, 'DEL', input))));

let del_hash = () => 
    prompt.strictInput('provide hash key', 'key' ).then(key =>
        prompt.strictInput('provide field name to be removed', 'field').then(field => 
            redisClient.get().then(c => c.hdel(key, field, (err, reply) => redisClient.handleStr(err, 'HDEL', `hash: ${key} | field: ${field}`)))));

let hgetall = () => 
    prompt.strictInput('provide hash key', 'hash key').then(input => 
        redisClient.get().then(c => c.hgetall(input, (err, reply) => redisClient.handleObj(err, `HGETALL:${input}`, reply))));

exports.init = init;
exports.newConnection = newConnection;
exports.changeServer = changeServer;
exports.execute = execute;
exports.help = help;

exports.info = info;
exports.get = get;
exports.set = set;
exports.hget = hget;
exports.hset = hset;
exports.del = del;
exports.del_hash = del_hash;
exports.hgetall = hgetall;