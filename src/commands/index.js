'use strict'

const Settings = require('../settings')
const Prompt = require('../prompt')
const RedisClient = require('../redis')
const Constants = require('./commands.str')
const MessageHandler = require('../message_handler')

let servers = []

exports.init = () => {
  const settings = Settings.load()
  servers = []
  settings.databases.forEach(database => servers.push(database))
}

exports.newConnection = () =>
  Prompt.safeInput('redis://localhost:6379', 'e.g. redis://localhost:6379', 'server address').then(addr =>
    Prompt.safeInput('local', 'e.g. qa redis', 'connection alias').then(name => {
      const server = { name: name, url: addr }
      let changed = false

      servers.forEach((element, index) => {
        if (element.name === name) {
          servers[index] = server
          changed = true
        }
      })

      if (!changed) {
        servers.push(server)
      }

      try {
        Settings.save(servers)
      } catch (e) {
        MessageHandler.warn('Failed to save settings. This may be because you don\'t have a open project.')
      }

      exports.connect(server)
    }))

exports.connect = server => RedisClient.connect(server)

exports.changeServer = () =>
  servers.length === 0
    ? exports.newConnection()
    : Prompt.strictPick(servers.map(x => x.name), 'choose redis connection').then(choice =>
      exports.connect(servers.find(x => x.name === choice)))

exports.help = () => MessageHandler.showMessageOnConsole(Constants.help)

exports.execute = () =>
  Prompt.strictInput('provide the command', 'command').then(input =>
    RedisClient.get().then(c => c.send_command(input, (err, reply) => RedisClient.handleStr(err, input, reply))))

exports.info = () =>
  RedisClient.get().then(c => c.send_command('info', (err, reply) => RedisClient.handleStr(err, 'INFO', reply)))

exports.get = () =>
  Prompt.strictInput('provide key', 'key').then(input =>
    RedisClient.get().then(c => c.get(input, (err, reply) => RedisClient.handleStr(err, `GET:${input}`, reply))))

exports.set = () =>
  Prompt.strictInput('provide key', 'key').then(key =>
    Prompt.safeInput('', 'provide value', 'value').then(value =>
      RedisClient.get().then(c => c.set(key, value, (err) => RedisClient.handleStr(err, 'SET', `key: ${key} | value: ${value}`)))))

exports.hset = () =>
  Prompt.strictInput('provide hash key', 'key').then(key =>
    Prompt.strictInput('provide field name', 'field').then(field =>
      Prompt.safeInput('', 'provide field value', 'value').then(value =>
        RedisClient.get().then(c => c.hset(key, field, value, (err) => RedisClient.handleStr(err, 'HSET', `hash: ${key} | field: ${field} value: ${value}`))))))

exports.hget = () =>
  Prompt.strictInput('provide hash key', 'key').then(key =>
    Prompt.strictInput('provide field name', 'field').then(field =>
      RedisClient.get().then(c => c.hget(key, field, (err, reply) => RedisClient.handleStr(err, `HGET:${key}:${field}`, reply)))))

exports.del = () =>
  Prompt.strictInput('provide key to be removed', 'key').then(input =>
    RedisClient.get().then(c => c.del(input, (err) => RedisClient.handleStr(err, 'DEL', input))))

exports.delhash = () =>
  Prompt.strictInput('provide hash key', 'key').then(key =>
    Prompt.strictInput('provide field name to be removed', 'field').then(field =>
      RedisClient.get().then(c => c.hdel(key, field, (err) => RedisClient.handleStr(err, 'HDEL', `hash: ${key} | field: ${field}`)))))

exports.hgetall = () =>
  Prompt.strictInput('provide hash key', 'hash key').then(input =>
    RedisClient.get().then(c => c.hgetall(input, (err, reply) => RedisClient.handleObj(err, `HGETALL:${input}`, reply))))

exports.end = () => {
  RedisClient.close()

  MessageHandler.info('Redis connection closed')
  MessageHandler.showStatusBarMessage('', '')
}

exports.llen = () =>
  Prompt.strictInput('provide list key', 'key').then(key =>
    RedisClient.get().then(c => c.llen(key, (err, reply) => RedisClient.handleStr(err, `LLEN:${key}`, reply))))

exports.lpush = () =>
  Prompt.strictInput('provide list name', 'list').then(list =>
    Prompt.strictInput('provide value', 'value').then(value =>
      RedisClient.get().then(c => c.lpush(list, value, (err, reply) => RedisClient.handleStr(err, `LPUSH:${list} '${value}'`, reply)))))

exports.lpushx = () =>
  Prompt.strictInput('provide list name', 'list').then(list =>
    Prompt.strictInput('provide value', 'value').then(value =>
      RedisClient.get().then(c => c.lpushx(list, value, (err, reply) => RedisClient.handleStr(err, `LPUSH:${list} '${value}'`, reply)))))

exports.rpush = () =>
  Prompt.strictInput('provide list name', 'list').then(list =>
    Prompt.strictInput('provide value', 'value').then(value =>
      RedisClient.get().then(c => c.rpush(list, value, (err, reply) => RedisClient.handleStr(err, `RPUSH:${list} '${value}'`, reply)))))

exports.rpushx = () =>
  Prompt.strictInput('provide list name', 'list').then(list =>
    Prompt.strictInput('provide value', 'value').then(value =>
      RedisClient.get().then(c => c.rpushx(list, value, (err, reply) => RedisClient.handleStr(err, `RPUSH:${list} '${value}'`, reply)))))

exports.lindex = () =>
  Prompt.strictInput('provide list name', 'list').then(list =>
    Prompt.strictInput('provide index', 'index').then(index =>
      RedisClient.get().then(c => c.lindex(list, index, (err, reply) => RedisClient.handleStr(err, `LINDEX:${list}[${index}]`, reply)))))

exports.linsert = () =>
  Prompt.strictInput('provide list name', 'list').then(list =>
    Prompt.strictPick(['Before', 'After'], 'before or after value').then(position =>
      Prompt.strictInput('provide pivot', 'pivot').then(pivot =>
        Prompt.strictInput('provide value', 'value').then(value =>
          RedisClient.get().then(c => c.linsert(list, position, pivot, value, (err, reply) => RedisClient.handleStr(err, `LINSERT:${list} ${position} ${pivot} '${value}'`, reply)))))))

exports.lrange = () =>
  Prompt.strictInput('provide list name', 'list').then(list =>
    Prompt.safeInput('0', 'provide start index', 'start').then(start =>
      Prompt.safeInput('-1', 'provide end index', 'end').then(end =>
        RedisClient.get().then(c => c.lrange(list, start, end, (err, reply) => RedisClient.handleStr(err, `LRANGE:${list}[${start} - ${end}]'`, reply))))))

exports.lpop = () =>
  Prompt.strictInput('provide list name', 'list').then(list =>
    RedisClient.get().then(c => c.lpop(list, (err, reply) => RedisClient.handleStr(err, `LPOP:${list}`, reply))))

exports.rpop = () =>
  Prompt.strictInput('provide list name', 'list').then(list =>
    RedisClient.get().then(c => c.rpop(list, (err, reply) => RedisClient.handleStr(err, `RPOP:${list}`, reply))))

exports.lset = () =>
  Prompt.strictInput('provide list name', 'list').then(list =>
    Prompt.strictInput('provide index', 'index').then(index =>
      Prompt.strictInput('provide value', 'value').then(value =>
        RedisClient.get().then(c => c.lset(list, index, value, (err, reply) => RedisClient.handleStr(err, `LSET:${list}[${index}]'`, reply))))))

exports.ltrim = () =>
  Prompt.strictInput('provide list name', 'list').then(list =>
    Prompt.safeInput('0', 'provide start index', 'start').then(start =>
      Prompt.safeInput('-1', 'provide end index', 'end').then(end =>
        RedisClient.get().then(c => c.ltrim(list, start, end, (err, reply) => RedisClient.handleStr(err, `LTRIM:${list}[${start} - ${end}]'`, reply))))))
