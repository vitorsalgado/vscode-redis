'use strict'

const VsCode = require('vscode')
const OutChannel = VsCode.window.createOutputChannel('VS Code Redis')
const StatusBar = VsCode.window.createStatusBarItem(VsCode.StatusBarAlignment.Left)

exports.info = message => VsCode.window.showInformationMessage(message)
exports.warn = message => VsCode.window.showWarningMessage(message)
exports.error = error => VsCode.window.showErrorMessage(error)

exports.showStatusBarMessage = (message, tooltip) => {
  StatusBar.text = message
  StatusBar.tooltip = tooltip
  StatusBar.show()
}

exports.showMessageOnConsole = message => {
  OutChannel.appendLine(message)
  OutChannel.appendLine('')
  OutChannel.show()
}

exports.showErrorOnConsole = error => {
  OutChannel.appendLine('An Error Occurred:')
  OutChannel.appendLine(error)
  OutChannel.appendLine('')
  OutChannel.show()
}
