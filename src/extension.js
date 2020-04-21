'use strict';

const vscode = require('vscode');
const manager = require('./manager');

const activate = (context) => {
    manager.init();

    addCommand(context, 'extension.redis.newConnection', manager.newConnection);
    addCommand(context, 'extension.redis.connect', manager.changeServer);
    addCommand(context, 'extension.redis.reloadConfiguration', manager.init);
    addCommand(context, 'extension.redis.execute', manager.execute);
    addCommand(context, 'extension.redis.help', manager.help);

    addCommand(context, 'extension.redis.info', manager.info);
    addCommand(context, 'extension.redis.get', manager.get);
    addCommand(context, 'extension.redis.set', manager.set);
    addCommand(context, 'extension.redis.hget', manager.hget);
    addCommand(context, 'extension.redis.hset', manager.hset);
    addCommand(context, 'extension.redis.del', manager.del);
    addCommand(context, 'extension.redis.hdel', manager.hdel);
    addCommand(context, 'extension.redis.hgetall', manager.hgetall);
    addCommand(context, 'extension.redis.end', manager.end);

    addCommand(context, 'extension.redis.llen', manager.llen);
    addCommand(context, 'extension.redis.lpush', manager.lpush);
    addCommand(context, 'extension.redis.rpush', manager.rpush);
    addCommand(context, 'extension.redis.lpushx', manager.lpushx);
    addCommand(context, 'extension.redis.rpushx', manager.rpushx);
    addCommand(context, 'extension.redis.lindex', manager.lindex);
    addCommand(context, 'extension.redis.linsert', manager.linsert);
    addCommand(context, 'extension.redis.lrange', manager.lrange);
    addCommand(context, 'extension.redis.lpop', manager.lpop);
    addCommand(context, 'extension.redis.rpop', manager.rpop);
    addCommand(context, 'extension.redis.lset', manager.lset);
    addCommand(context, 'extension.redis.ltrim', manager.ltrim);
};

const deactivate = () => { };

const addCommand = (context, command, handler) => context.subscriptions.push(
    vscode.commands.registerCommand(command, handler)
);

exports.activate = activate;
exports.deactivate = deactivate;
