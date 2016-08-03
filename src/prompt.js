'use strict';

const vscode = require('vscode')

exports.safeInput = (defaultValue, prompt, placeholder) => 
    new Promise((resolve, reject) => 
        vscode.window.showInputBox({value: defaultValue, prompt: prompt, placeHolder: placeholder})
            .then((input) => input ? resolve(input) : resolve(defaultValue)))

exports.strictInput = (prompt, placeholder) => 
    new Promise((resolve, reject) => 
        vscode.window.showInputBox({value: '', prompt: prompt, placeHolder: placeholder})
            .then((input) => input ? resolve(input) : reject()))

exports.strictPick = (values, placeHolder) => 
    new Promise((resolve, reject) =>
        vscode.window.showQuickPick(values, { matchOnDescription: false, placeHolder: placeHolder })
            .then(choice => choice ? resolve(choice) : reject()))