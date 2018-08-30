import * as vscode from 'vscode';

import { Dialog, DialogLine } from '../dialog';
import { Character } from '../data/dialogJsonData';

export class HoverProvider implements vscode.HoverProvider 
{
    private static getDialogText(dialogLine : DialogLine) : string
    {
        let result = "";

        dialogLine.txtSegment.texts.forEach(element => {

            let character = dialogLine.jsonSegment.characters.find((character : Character) => {
                let result = character.texts.find((text) => {
                    return text.ID.toString() === element.ID;
                });

                return result !== undefined;
            });

            if (character !== undefined)
            {
                result += "**" + character.name + "**";
            }
            else
            {
                result += "[" + element.ID + "]";  
            }

            result += ": " + element.text + "\n\n";
        });

        return result;
    }

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
                let str = HoverProvider.getDialogText(dialogLine);

                return new vscode.Hover(str);
            }

            return null;
        }
        return null;
    }
}