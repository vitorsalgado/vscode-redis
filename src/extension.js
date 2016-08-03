'use strict';

const vscode = require('vscode')
    , manager = require('./manager');

let activate = (context) => {
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
}

let deactivate = () => { };

let addCommand = (context, command, handler) => context.subscriptions.push(
    vscode.commands.registerCommand(command, handler)
);

exports.activate = activate;
exports.deactivate = deactivate;