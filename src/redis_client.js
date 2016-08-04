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
            msg.warn('no active redis connection... Use "Connect" or "New Command" commands to start a new one');
            return reject();
        }

        return resolve(client);
    });

exports.connect = (server) => {
    if (client)
        client.end(true);

    client = redis.createClient(server.url, {
        retry_strategy: (options) => {
            if (options.error && options.error.code === 'ECONNREFUSED') {
                const message = 'the server refused the connection';
                
                msg.error(message);

                return new Error(message);
            }

            if (options.total_retry_time > 3000) {
                const message = 'retry time exhausted';

                msg.error(message);

                return new Error(message);
            }

            if (options.times_connected > 3) {
                return undefined;
            }

            return Math.max(options.attempt * 100, 3000);
        }
    });
    
    client.on('error', (error) => {
        if (error)
            msg.error(error);
    });

    client.on('ready', () => {
        msg.info(`Redis client "${server.name}" connected on address "${server.url}"`);
        msg.showStatusBarMessage(`redis > ${server.url}`, server.name);
    });

    client.on('reconnecting', () => 
        msg.showStatusBarMessage(`redis > reconnecting to ${server.url} ...`, server.name));        
};

exports.close = () => {
    if (client) {
        client.end(true);
        client = null;
    }
}

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