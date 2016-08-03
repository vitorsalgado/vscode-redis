"use strict";

const vscode = require('vscode')
    , output = vscode.window.createOutputChannel("Redis")
    , statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);

exports.outputString = (error, command, message) => {
    if (error) error(error);

    output.appendLine('');
    output.appendLine(`${command} > ${message}`);
    output.show();
};

exports.outputObject = (error, command, object) => {
    if (error) error(error);

    output.appendLine('');
    output.appendLine(command);
    output.appendLine(JSON.stringify(object, null, 4));
    output.show();
};

exports.outputError = (error) => {
    error(error);
};

exports.info = (message) => vscode.window.showInformationMessage(message);
exports.warn = (message) => vscode.window.showWarningMessage(message);
exports.error = (error) => vscode.window.showErrorMessage(`an error ocurred in Redis ... ${error}`);

exports.showStatusBarMessage = (message, tooltip) => {
    statusBar.text = `$(database) ${message}`;
    statusBar.tooltip = tooltip;
    statusBar.show();
};

let error = (error) => {
    output.appendLine('');
    output.appendLine(`ERROR: ${message}`);
    output.show();
};