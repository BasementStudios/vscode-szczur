import * as vscode from 'vscode';

import { Dialog } from '../dialog';

export class CompletionItemProvider implements vscode.CompletionItemProvider
{
    private getDialogAddOptionCompletion(dialog: Dialog, line: string) : vscode.CompletionList
    {
        let list = new vscode.CompletionList();

        // create regex
        const regex = /dialog:addOption\((.*)\)/;

        // parse current line
        let result = regex.exec(line);

        if (result !== null) 
        {
            // get dialog txt data
            let dialogTxtData = dialog.getDialogTxtData();

            if (dialogTxtData !== undefined)
            {
                // foreach segment in dialogTxtData
                dialogTxtData.segments.forEach((segment) => {

                    // create new completion item
                    let completionItem = new vscode.CompletionItem("\"" + segment.ID + "\"", vscode.CompletionItemKind.Value);

                    // foreach text in segment
                    segment.texts.forEach((text) => {

                        // if segment is for addOption
                        if (text.ID === ">")
                        {
                            completionItem.detail = text.text;
                            list.items.push(completionItem);
                        }
                    });
                });
            }
        }

        return list;
    }

    private getDialogRunCompletion(dialog: Dialog, line: string) : vscode.CompletionList
    {
        let list = new vscode.CompletionList();

        // create regex
        const regex = /dialog:run\(\)/;

        // parse current line
        let result = regex.exec(line);

        if (result !== null) 
        {
            // get dialog txt data
            let dialogTxtData = dialog.getDialogTxtData();

            if (dialogTxtData !== undefined)
            {
                // foreach segment in dialogTxtData
                dialogTxtData.segments.forEach((segment) => {

                    let isOption = false;

                    segment.texts.forEach((text) => {
                        if (text.ID === ">")
                        {
                            isOption = true;
                        }
                    });

                    // if segment isn't for addOption
                    if (!isOption)
                    { 
                        // create new completion item
                        let completionItem = new vscode.CompletionItem("\"" + segment.ID + "\"", vscode.CompletionItemKind.Value);
                        list.items.push(completionItem);
                    }
                });
            }
        }

        return list;
    }

    provideCompletionItems(doc: vscode.TextDocument, pos: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList>
    {
        let list = new Array<vscode.CompletionItem>();

        // get dialog instance and update
        let dialog = Dialog.getInstance();
        dialog.update(doc);

        // get line from position
        let line = doc.lineAt(pos.line).text;
        
        // add completion list for dialog:run and dialog:addOption
        list = list.concat(this.getDialogRunCompletion(dialog, line).items);
        list = list.concat(this.getDialogAddOptionCompletion(dialog, line).items);

        return list;
    }

}
