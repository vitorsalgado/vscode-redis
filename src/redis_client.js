'use strict';

const vscode = require('vscode')
    , redis = require('redis')
    , output = vscode.window.createOutputChannel("Redis")
    , statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left)
    , msg = require('./message_handler');

let client = null;

exports.get = () => 
    new Promise((resolve, reject) => {
        if (!client) {
            msg.warn('no active redis connection... use "new connection" command to create a new one');
            return reject();
        }

        return resolve(client);
    });

exports.connect = (server) => {
    client = redis.createClient(server.url);

    client.on('error', msg.error);
    client.on('ready', () => {
        msg.info(`Redis connection "${server.name}" ready on "${server.url}"`);
        msg.showStatusBarMessage(`redis > ${server.url}`, server.name);
    });
};

exports.handleStr = (error, command, message) => {
    if (error)
        return msg.showErrorOnConsole(error);

    output.appendLine('');
    output.appendLine(`${command} > ${message}`);
    output.show();
};

exports.handleObj = (error, command, object) => {
    if (error)
        return msg.showErrorOnConsole(error);

    output.appendLine('');
    output.appendLine(command);
    output.appendLine(JSON.stringify(object, null, 4));
    output.show();
};