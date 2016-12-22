'use strict';

const vscode = require('vscode');
const output = vscode.window.createOutputChannel("Redis");
const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);

exports.info = (message) => vscode.window.showInformationMessage(message);
exports.warn = (message) => vscode.window.showWarningMessage(message);
exports.error = (error) => vscode.window.showErrorMessage(error);

exports.showStatusBarMessage = (message, tooltip) => {
    statusBar.text = `$(database) ${message}`;
    statusBar.tooltip = tooltip;
    statusBar.show();
};

exports.showMessageOnConsole = (message) => {
    output.appendLine('');
    output.appendLine(message);
    output.show();
};

exports.showErrorOnConsole = (error) => {
    output.appendLine('');
    output.appendLine(`ERROR: ${error}`);
    output.show();
};
