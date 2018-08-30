import * as vscode from 'vscode';

import { Dialog } from '../dialog';

export class HoverProvider implements vscode.HoverProvider 
{
   provideHover(doc: vscode.TextDocument, pos: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> 
   {
        let dialog = Dialog.getInstance();
        dialog.update(doc);
        
        const regex = /dialog:run\([\t ]*\"(.*)\"[\t ]*\)/;

        let line = doc.lineAt(pos.line).text;
        let result = regex.exec(line);
        if (result !== null) 
        {
            let id = result[1];

            let dialogLine = dialog.getDialogLine(id);

            if (dialogLine !== undefined)
            {
                let str = "";

                dialogLine.txtSegment.texts.forEach(element => {
                    str += "[" + element.ID + "]: " + element.text + "\n\n";
                });

                return new vscode.Hover(str);
            }

            return null;
        }
        return null;
    }
}