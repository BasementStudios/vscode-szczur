import * as vscode from 'vscode';

import { Dialog } from '../dialog';

export class CodeLensProvider implements vscode.CodeLensProvider 
{
   // dlgParser:DlgParser = new DlgParser();


    private getCodeLens(regex : RegExp, dialog : Dialog, document : vscode.TextDocument)  : vscode.CodeLens[]
    {
        var codeLensArr:vscode.CodeLens[] = [];

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

                // if line is `dialog:addOption`
                if (dialogLine.txtSegment.texts.length > 0 && dialogLine.txtSegment.texts[0].ID === ">")
                {
                    text = dialogLine.txtSegment.texts[0].text;
                }
                else // if line is `dialog:run`
                {
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
                }

                // create codeLens and add to array
                let codeLens = new vscode.CodeLens(line.range, { command: "", title: text });
                codeLensArr.push(codeLens);
            }
        }


        return codeLensArr;
    }

    onDidChangeCodeLenses?: vscode.Event<void> | undefined;   
    provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CodeLens[]> 
    {
        // create empty array
        var codeLensArr:vscode.CodeLens[] = [];

        let dialog = Dialog.getInstance();
        dialog.update(document);
        
        // get codelens for `dialog:run` and `dialog:addOption`
        codeLensArr = codeLensArr.concat(this.getCodeLens(/dialog:run\([\t ]*\"(.*)\"[\t ]*\)/g, dialog, document));
        codeLensArr = codeLensArr.concat(this.getCodeLens(/dialog:addOption\([\t ]*\"(.*)\"[\t ]*\)/g, dialog, document));

        return codeLensArr;
    }


}
