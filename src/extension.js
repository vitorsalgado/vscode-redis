'use strict'

const VsCode = require('vscode')
const Commands = require('./commands')

module.exports.activate = context => {
  Commands.init()

  addCommand(context, 'extension.redis.newConnection', Commands.newConnection)
  addCommand(context, 'extension.redis.connect', Commands.changeServer)
  addCommand(context, 'extension.redis.reloadConfiguration', Commands.init)
  addCommand(context, 'extension.redis.execute', Commands.execute)
  addCommand(context, 'extension.redis.help', Commands.help)

  addCommand(context, 'extension.redis.info', Commands.info)
  addCommand(context, 'extension.redis.get', Commands.get)
  addCommand(context, 'extension.redis.set', Commands.set)
  addCommand(context, 'extension.redis.hget', Commands.hget)
  addCommand(context, 'extension.redis.hset', Commands.hset)
  addCommand(context, 'extension.redis.del', Commands.del)
  addCommand(context, 'extension.redis.hdel', Commands.delhash)
  addCommand(context, 'extension.redis.hgetall', Commands.hgetall)
  addCommand(context, 'extension.redis.end', Commands.end)

  addCommand(context, 'extension.redis.llen', Commands.llen)
  addCommand(context, 'extension.redis.lpush', Commands.lpush)
  addCommand(context, 'extension.redis.rpush', Commands.rpush)
  addCommand(context, 'extension.redis.lpushx', Commands.lpushx)
  addCommand(context, 'extension.redis.rpushx', Commands.rpushx)
  addCommand(context, 'extension.redis.lindex', Commands.lindex)
  addCommand(context, 'extension.redis.linsert', Commands.linsert)
  addCommand(context, 'extension.redis.lrange', Commands.lrange)
  addCommand(context, 'extension.redis.lpop', Commands.lpop)
  addCommand(context, 'extension.redis.rpop', Commands.rpop)
  addCommand(context, 'extension.redis.lset', Commands.lset)
  addCommand(context, 'extension.redis.ltrim', Commands.ltrim)
}

module.exports.deactivate = () => { }

const addCommand = (context, command, handler) =>
  context.subscriptions.push(VsCode.commands.registerCommand(command, handler))
