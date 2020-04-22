<a href="https://marketplace.visualstudio.com/items?itemName=vitorsalgado.vscode-redis"><img src="assets/icon.png" width="180px" align="right" /></a>

# VS Code Redis
#### Extension for Visual Studio Code 
[![Build Status](https://travis-ci.org/vitorsalgado/vscode-redis.svg?branch=master)](https://travis-ci.org/vitorsalgado/vscode-redis) 
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com) 
![Version](https://vsmarketplacebadge.apphb.com/version/vitorsalgado.vscode-redis.svg "Marketplace") 
![Installs](https://vsmarketplacebadge.apphb.com/installs/vitorsalgado.vscode-redis.svg "Installs")  
Adds common Redis commands to VS Code Command Palette.

## Install
The Plugin on [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=vitorsalgado.vscode-redis).
* Press `Ctrl + Shift + P`
* Pick  `Extensions: Install Extension`
* Search for **vscode-redis**

## Usage
![how to](assets/how-to.gif)     

## Features
* Multiple Redis connections;
* Switch between server connections;
* Execute any Redis command with `Redis: Execute Command`
* "Command Palette" supported Redis commands:
    * `info`
    * `get`
    * `set`
    * `hget`
    * `hset`
    * `del`
    * `hdel`
    * `hgetall`
    * `llen`
    * `lpush`
    * `lpushx`
    * `rpush`
    * `rpushx`
    * `lindex`
    * `linsert`
    * `lrange`
    * `lpop`
    * `rpop`
    * `lset`
    * `ltrim`

## Optional Extension Settings
You can configure multiple Redis connections on your workspace. 
First, place a file named "redis.json" in .vscode folder. Open "redis.json" and edit it following the sample below:
```
{
    "databases": [
        {
            "name": "local",
            "url": "redis://localhost:6379"
        },
        {
            "name": "production",
            "url": "rediss://production-address:9091",
            "password": "super_secret_password"
        }
    ]
}
```
Execute the command `Redis: Reload Configuration` to load the servers listed in configuration file.

## Changelog
See [Changelog](CHANGELOG.md).

## Contributing
Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

# Versioning
We use **[Semantic Versioning](https://semver.org/)** for versioning. For the versions available, see the tags on this repository.

## License
This project is available under MIT License. See [LICENSE](LICENSE).
