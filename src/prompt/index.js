'use strict'

const VsCode = require('vscode')

module.exports.safeInput = (defaultValue, prompt, placeholder) =>
  VsCode.window.showInputBox({ value: defaultValue, prompt: prompt, placeHolder: placeholder })
    .then(input => input || defaultValue)

module.exports.strictInput = (prompt, placeholder) =>
  VsCode.window.showInputBox({ value: '', prompt: prompt, placeHolder: placeholder })
    .then(input => input || new Error('Value is required'))

module.exports.strictPick = (values, placeHolder) =>
  VsCode.window.showQuickPick(values, { matchOnDescription: false, placeHolder: placeHolder })
    .then(choice => choice || new Error('It is required to choose a value'))
