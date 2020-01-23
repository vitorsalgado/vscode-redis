'use strict';

const vscode = require('vscode');
const settings = require('./settings');
const prompt = require('./prompt');
const redisClient = require('./redis_client');
const consts = require('./consts');
const msg = require('./message_handler');

let servers = [];

const init = () =>
    settings.load()
        .then(config => {
            servers = [];
            config.databases.forEach(database => servers.push({ name: database.name, url: database.url }));
        })
        .catch(err => msg.error(err));

const newConnection = () =>
    prompt.safeInput('redis://localhost:6379', 'e.g. redis://localhost:6379', 'server address').then(addr =>
        prompt.safeInput('local', 'e.g. qa redis', 'connection alias').then(name => {
            const server = { name: name, url: addr };
            let changed = false;

            servers.forEach((element, index) => {
                if (element.name == name) {
                    servers[index] = server;
                    changed = true;
                }
            });

            if (!changed)
                servers.push(server);

            if (addr != 'redis://localhost:6379')
                settings.save(servers).catch((err) => msg.error(err));

            connect(server);
        }));

const connect = (server) => redisClient.connect(server);

const changeServer = () =>
    servers.length == 0
        ? newConnection()
        : prompt.strictPick(servers.map(x => x.name), 'choose redis connection').then(choice =>
            connect(servers.find(x => x.name == choice)));

const help = () => msg.showMessageOnConsole(consts.help);

const execute = () =>
    prompt.strictInput('provide the command', 'command').then(input =>
        redisClient.get().then(c => c.send_command(input, (err, reply) => redisClient.handleStr(err, input, reply))));

const info = () =>
    redisClient.get().then(c => c.send_command('info', (err, reply) => redisClient.handleStr(err, 'INFO', reply)));

const get = () =>
    prompt.strictInput('provide key', 'key').then(input =>
        redisClient.get().then(c => c.get(input, (err, reply) => redisClient.handleStr(err, `GET:${input}`, reply))));

const set = () =>
    prompt.strictInput('provide key', 'key').then(key =>
        prompt.safeInput('', 'provide value', 'value').then(value =>
            redisClient.get().then(c => c.set(key, value, (err, reply) => redisClient.handleStr(err, 'SET', `key: ${key} | value: ${value}`)))));

const hset = () =>
    prompt.strictInput('provide hash key', 'key').then(key =>
        prompt.strictInput('provide field name', 'field').then(field =>
            prompt.safeInput('', 'provide field value', 'value').then(value =>
                redisClient.get().then(c => c.hset(key, field, value, (err, reply) => redisClient.handleStr(err, 'HSET', `hash: ${key} | field: ${field} value: ${value}`))))));

const hget = () =>
    prompt.strictInput('provide hash key', 'key').then(key =>
        prompt.strictInput('provide field name', 'field').then(field =>
            redisClient.get().then(c => c.hget(key, field, (err, reply) => redisClient.handleStr(err, `HGET:${key}:${field}`, reply)))));

const del = () =>
    prompt.strictInput('provide key to be removed', 'key').then(input =>
        redisClient.get().then(c => c.del(key, (err, reply) => redisClient.handleStr(err, 'DEL', input))));

const del_hash = () =>
    prompt.strictInput('provide hash key', 'key').then(key =>
        prompt.strictInput('provide field name to be removed', 'field').then(field =>
            redisClient.get().then(c => c.hdel(key, field, (err, reply) => redisClient.handleStr(err, 'HDEL', `hash: ${key} | field: ${field}`)))));

const hgetall = () =>
    prompt.strictInput('provide hash key', 'hash key').then(input =>
        redisClient.get().then(c => c.hgetall(input, (err, reply) => redisClient.handleObj(err, `HGETALL:${input}`, reply))));

const end = () => {
    redisClient.close();

    msg.info('Redis connection closed');
    msg.showStatusBarMessage('', '');
};

const llen = () =>
    prompt.strictInput('provide list key', 'key').then(key =>
        redisClient.get().then(c => c.llen(key, (err, reply) => redisClient.handleStr(err, `LLEN:${key}`, reply))));

const lpush = () =>
    prompt.strictInput('provide list name', 'list').then(list =>
        prompt.strictInput('provide value', 'value').then(value =>
            redisClient.get().then(c => c.lpush(list, value, (err, reply) => redisClient.handleStr(err, `LPUSH:${list} '${value}'`, reply)))));

const lindex = () =>
    prompt.strictInput('provide list name', 'list').then(list =>
        prompt.strictInput('provide index', 'index').then(index =>
            redisClient.get().then(c => c.lindex(list, index, (err, reply) => redisClient.handleStr(err, `LINDEX:${list}[${index}]`, reply)))));

const linsert = () =>
    prompt.strictInput('provide list name', 'list').then(list =>
        prompt.strictPick(['Before', 'After'], 'before or after value').then(position =>
            prompt.strictInput('provide pivot', 'pivot').then(pivot =>
                prompt.strictInput('provide value', 'value').then(value =>
                    redisClient.get().then(c => c.linsert(list, position, pivot, value, (err, reply) => redisClient.handleStr(err, `LINSERT:${list} ${position} ${pivot} '${value}'`, reply)))))));

const lrange = () =>
    prompt.strictInput('provide list name', 'list').then(list =>
        prompt.safeInput('0', 'provide start index', 'start').then(start =>
                prompt.safeInput('-1', 'provide end index', 'end').then(end =>
                    redisClient.get().then(c => c.lrange(list, start, end, (err, reply) => redisClient.handleStr(err, `LRANGE:${list}[${start} - ${end}]'`, reply))))));

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
exports.end = end;

exports.llen = llen;
exports.lpush = lpush;
exports.lindex = lindex;
exports.linsert = linsert;
exports.lrange = lrange;
