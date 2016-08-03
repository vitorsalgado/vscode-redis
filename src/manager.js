"use strict";

const vscode = require('vscode')
    , settings = require('./settings')
    , redis = require('redis')
    , msg = require('./message_handler');

let client = null
    , currentServer = null
    , servers = [];

let init = () => {
    settings.load()
        .then(config => {
            config.databases.forEach(database => { 
                servers.push({name: database.name, url: database.url});
            });
        })
        .catch((err) => msg.error(err));
};

let newConnection = () => {
    vscode.window.showInputBox({value: 'http://localhost:6379', prompt: 'e.g. http://localhost:6379', placeHolder: "Server Url"}).then((input) => {
        let addr = input ? input : 'http://localhost:6379';
        
        vscode.window.showInputBox({value: '', prompt: "e.g. production redis", placeHolder: "Connection name"}).then((input) => {
            let name = input ? input : 'local';
            let server = { name: name, url: addr };
            let added = false;

            servers.forEach((element, index) => {
                if (element.name == name) {
                    servers[index] = server;
                    added = true;

                    return;
                }
            });

            if (!added) {
                servers.push(server);
            }

            settings.save(servers).catch((err) => msg.error(err));
            connect(server);
        });
    });
};

let connect = (server) => {
    client = redis.createClient(server.url);
    currentServer = server;

    client.on('error', msg.error);
    client.on('ready', () => {
        msg.info(`Redis connection "${server.name}" ready on "${server.url}"`);
        msg.showStatusBarMessage(`redis > ${server.url}`, server.name);
    });
};

let changeServer = () => {
    vscode.window.showQuickPick(servers.map(x => x.name), {matchOnDescription: false, placeHolder: "Choose Redis connection"}).then((choice) => {
        if (choice) {
            connect(servers.find(x => x.name == choice));
        }
    });
};

let redisClient = () => {
    return new Promise((resolve, reject) => {
        if (!client) {
            msg.warn('no active redis connection... use "new connection" command to create a new one');
            return reject();
        }

        return resolve(client);
    });
};

let info = () => redisClient().then(c => c.send_command('info', (err, reply) => msg.outputString(err, 'INFO', reply)));

let get = () => {
    vscode.window.showInputBox({value: '', prompt: 'provide key', placeHolder: 'key'}).then(input => {
        if (!input) {
            return;
        }        

        redisClient().then(c => c.get(input, (err, reply) => msg.outputString(err, `GET:${input}`, reply)));
    });
};

let set = () => {
    vscode.window.showInputBox({value: '', prompt: 'provide key', placeHolder: 'key'}).then(key => {
        if (!key) {
            return;
        }

        vscode.window.showInputBox({value: '', prompt: 'provide value', placeHolder: 'value'}).then(value => {
            redisClient().then(c => c.set(key, value, (err, reply) => msg.outputString(err, 'SET', `key: ${key} | value: ${value}`)));
        });
    });    
}

let hgetall = () => {
    vscode.window.showInputBox({value: '', prompt: 'provide hash key', placeHolder: 'hash key'}).then(input => {
        if (!input) {
            return;
        }

        redisClient().then(c => c.hgetall(input, (err, reply) => msg.outputObject(err, `HGETALL:${input}`, reply)));
    });
};

exports.init = init;
exports.newConnection = newConnection;
exports.changeServer = changeServer;

exports.info = info;
exports.get = get;
exports.set = set;
exports.hgetall = hgetall;