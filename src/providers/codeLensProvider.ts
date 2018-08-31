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

            // if dialog line exists
            if (dialogLine !== undefined)
            {
                let text: string;

                // if data from json exists
                if (dialogLine.jsonSegment !== undefined)
                {
                    let characters: string[] = [];

                    // show all characters in this segment
                    dialogLine.jsonSegment.characters.forEach((character) => {
                        characters.push(character.name);
                    });

                    text = characters.join(", ");
                }
                else
                {
                    // show first line of segment
                    let textLine = dialogLine.txtSegment.texts[0];

                    text = "[" + textLine.ID + "]: " + textLine.text;
                }

                // create codeLens and add to array
                let codeLens = new vscode.CodeLens(line.range, { command: "", title: text });
                codeLensArr.push(codeLens);
            }
        }

        //console.log("Update: " + lens.length);

        return codeLensArr;
    }


}
