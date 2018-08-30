import * as vscode from 'vscode';

import { Dialog } from '../dialog';

export class CodeLensProvider implements vscode.CodeLensProvider 
{
   // dlgParser:DlgParser = new DlgParser();

    onDidChangeCodeLenses?: vscode.Event<void> | undefined;   
    provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CodeLens[]> 
    {
        // create empty array
        var codeLensArr:vscode.CodeLens[] = [];

        let dialog = Dialog.getInstance();
        dialog.update(document);
        
        // create regex object
        const regex = /dialog:run\([\t ]*\"(.*)\"[\t ]*\)/g;

        let result;

        // find every `runText`
        while ((result = regex.exec(document.getText())) !== null) 
        {
            // This is necessary to avoid infinite loops with zero-width matches
            if (result.index === regex.lastIndex)
            {
                regex.lastIndex++;
            }

            // get id
            let id = result[1];
            
            // get line where it happens
            let line = document.lineAt(document.positionAt(regex.lastIndex));
            
            let dialogLine = dialog.getDialogLine(id);

            // if array exists
            if (dialogLine !== undefined)
            {
                let characters: string[] = [];

                dialogLine.jsonSegment.characters.forEach((character) => {
                    characters.push(character.name);
                });

                // create codeLens and add to array
                let codeLens = new vscode.CodeLens(line.range, { command: "", title: characters.join(", ") });
                codeLensArr.push(codeLens);
            }
        }

        //console.log("Update: " + lens.length);

        return codeLensArr;
    }


}
