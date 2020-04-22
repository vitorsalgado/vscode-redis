'use strict'

const VsCode = require('vscode')
const OutChannel = VsCode.window.createOutputChannel('VS Code Redis')
const StatusBar = VsCode.window.createStatusBarItem(VsCode.StatusBarAlignment.Left)

module.exports.info = message => VsCode.window.showInformationMessage(message)
module.exports.warn = message => VsCode.window.showWarningMessage(message)
module.exports.error = error => VsCode.window.showErrorMessage(error)

module.exports.showStatusBarMessage = (message, tooltip) => {
  StatusBar.text = message
  StatusBar.tooltip = tooltip
  StatusBar.show()
}

module.exports.showMessageOnConsole = message => {
  OutChannel.appendLine(message)
  OutChannel.appendLine('')
  OutChannel.show()
}

module.exports.showErrorOnConsole = error => {
  OutChannel.appendLine('An Error Occurred:')
  OutChannel.appendLine(error)
  OutChannel.appendLine('')
  OutChannel.show()
}
