'use strict'

const VsCode = require('vscode')
const Redis = require('redis')
const Out = VsCode.window.createOutputChannel('VS Code Redis')
const MessageHandler = require('../message_handler')

let client = null

exports.get = () =>
  new Promise((resolve, reject) => {
    if (!client) {
      return reject(new Error('No active redis connection... Use "Connect" or "New Command" commands to start a new one'))
    }

    return resolve(client)
  })

exports.connect = server => {
  if (client) {
    client.end(true)
  }

  client = Redis.createClient({
    ...server,
    retry_strategy: options => {
      if (options.error && options.error.code === 'ECONNREFUSED') {
        const message = 'the server refused the connection'

        MessageHandler.error(message)

        return new Error(message)
      }

      if (options.total_retry_time > 3000) {
        const message = 'retry time exhausted'

        MessageHandler.error(message)

        return new Error(message)
      }

      if (options.times_connected > 3) {
        return undefined
      }

      return Math.max(options.attempt * 100, 3000)
    }
  })

  if (server.password) {
    client.auth(server.password, function (err) {
      if (err) {
        MessageHandler.error(err)
        return new Error(err)
      }
    })
  }

  client.on('error', error => {
    if (error) {
      MessageHandler.error(error)
    }
  })

  client.on('ready', () => {
    MessageHandler.info(`Redis client "${server.name}" connected on address "${server.url}"`)
    MessageHandler.showStatusBarMessage(`Redis: ${server.url} (${server.name})`, server.name)
  })

  client.on('reconnecting', () =>
    MessageHandler.showStatusBarMessage(`Redis: reconnecting to ${server.url} ...`, server.name))
}

exports.close = () => {
  if (client) {
    client.end(true)
    client = null
  }
}

exports.handleStr = (error, command, reply) => {
  if (error) {
    return MessageHandler.showErrorOnConsole(error)
  }

  Out.appendLine(`Command: ${command}`)
  Out.appendLine(`Reply: ${reply}`)
  Out.appendLine('---')
  Out.show()
}

exports.handleObj = (error, command, object) => {
  if (error) {
    return MessageHandler.showErrorOnConsole(error)
  }

  Out.appendLine(`Command: ${command}`)
  Out.appendLine('Object:')
  Out.appendLine(JSON.stringify(object, null, 2))
  Out.appendLine('---')
  Out.show()
}
