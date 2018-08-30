'use strict'; // *stritch

import * as vscode from 'vscode';

import { CodeLensProvider } from "./providers/codeLensProvider";
import { HoverProvider } from "./providers/hoverProvider";
import { CompletionItemProvider } from './providers/completionItemProvider';

export function activate(context: vscode.ExtensionContext) {
    // register hover provider
    context.subscriptions.push(vscode.languages.registerHoverProvider({ scheme:'file', language: 'lua' }, new HoverProvider()));

    // register codeLens provider
    context.subscriptions.push(vscode.languages.registerCodeLensProvider({ scheme:'file', language: 'lua' }, new CodeLensProvider()));

    // register 
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider({scheme:'file', language: 'lua'}, new CompletionItemProvider()));

    console.log("Started!");
}

export function deactivate() {
    console.log("End!");
}
