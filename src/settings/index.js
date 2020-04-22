const FileSystem = require('fs')
const Path = require('path')
const VsCode = require('vscode')
const RedisSettingsFile = '/.vscode/redis.json'
const DefaultSettings = require('./settings.default')

exports.load = () => {
  const root = VsCode.workspace.workspaceFolders ? VsCode.workspace.workspaceFolders[0] : undefined

  if (!root) {
    return DefaultSettings
  }

  const settingsFile = Path.join(root.uri.path, RedisSettingsFile)
  const exists = FileSystem.existsSync(settingsFile)

  if (!exists) {
    return DefaultSettings
  }

  const content = FileSystem.readFileSync(settingsFile).toString()
  const settings = JSON.parse(content)

  if (!settings.databases) {
    return DefaultSettings
  }

  return settings
}

exports.save = servers => {
  if (!Array.isArray(servers)) {
    throw new Error('Parameter servers must be a array')
  }

  const root = VsCode.workspace.workspaceFolders ? VsCode.workspace.workspaceFolders[0] : undefined

  if (!root) {
    throw new Error('Workspace root path not available')
  }

  const settingsPath = Path.join(root.uri.path, '/.vscode/')
  const settingsFile = Path.join(root.uri.path, RedisSettingsFile)
  const dirExists = FileSystem.existsSync(settingsPath)

  if (!dirExists) {
    FileSystem.mkdirSync(settingsPath)
  }

  const fileExists = FileSystem.existsSync(settingsFile)

  if (!fileExists) {
    FileSystem.writeFileSync(settingsFile, '{}')
  }

  const content = FileSystem.readFileSync(settingsFile).toString()
  const settings = JSON.parse(content)

  settings.databases = settings.databases || []

  servers.forEach(server => {
    if (!settings.databases.find(x => x.name === server.name)) {
      settings.databases.push(server)
    }
  })

  FileSystem.writeFileSync(settingsFile, JSON.stringify(settings, null, 4))
}
