
'use strict'; // *stritch

import * as vscode from 'vscode';

import { CodeLensProvider } from "./providers/codeLensProvider";
import { HoverProvider } from "./providers/hoverProvider";

export function activate(context: vscode.ExtensionContext) {
    // register hover provider
    context.subscriptions.push(vscode.languages.registerHoverProvider({ scheme:'file', language: 'lua' }, new HoverProvider()));

    // register codeLens provider
    context.subscriptions.push(vscode.languages.registerCodeLensProvider({ scheme:'file', language: 'lua' }, new CodeLensProvider()));

    console.log("Started!");
}

export function deactivate() {
}
