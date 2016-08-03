'use strict';

const fs = require('fs')
    , path = require('path')
    , vscode = require('vscode')
    , file = '/.vscode/redis.json';

let defaults = {};

defaults.databases = [{
    name: 'local',
    url: 'redis://localhost:6379'
}];

let load = () => 
    new Promise((resolve, reject) => {
        let root = vscode.workspace.rootPath;
        if (!root) {
            return resolve(defaults);
        }

        let settingsFile = path.join(root, file);

        fs.exists(settingsFile, (exists) => {
            if (!exists) {
                return save(defaults.databases);
            }

            fs.readFile(settingsFile, (err, data) => {
                if (err) {
                    return reject(`failed to read file ${file}`);
                }

                let config = JSON.parse(data);

                if (!config.databases) {
                    return save(defaults.databases);
                }

                return resolve(config);
            });
        });
    });

let save = (servers) => 
    new Promise((resolve, reject) => {
        if (!Array.isArray(servers)) {
            return reject('invalid array provided');
        }

        let root = vscode.workspace.rootPath;
        if (!root) {
            return reject(`workspace root path not available`);
        }

        let settingsPath = path.join(root, '/.vscode/');
        let settingsFile = path.join(root, file);

        fs.exists(settingsPath, (exists) => {
            if (!exists)
                fs.mkdirSync(settingsPath);

            fs.exists(settingsFile, (exists) => {
                if (!exists)
                    fs.writeFileSync(settingsFile, "{}");

                fs.readFile(settingsFile, (err, data) => {
                    if (err) {
                        return reject(`failed to read file ${settingsFile}`);
                    }

                    let config = JSON.parse(data);

                    if (!config.databases) {
                        config.databases = [];
                    }

                    servers.forEach(server => {
                        if (!config.databases.find(x => x.name == server.name))
                            config.databases.push(server);
                    });

                    fs.writeFile(settingsFile, JSON.stringify(config, null, 4), (err) => {
                        if (err) {
                            return reject(`failed to save configuration file ${settingsFile}`);
                        }

                        return resolve(config);
                    });
                });
            });
        });
    });

exports.load = load;
exports.save = save;