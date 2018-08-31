import * as vscode from 'vscode';

import { Dialog, DialogLine } from '../dialog';
import { Character } from '../data/dialogJsonData';

export class HoverProvider implements vscode.HoverProvider 
{
    private static getDialogText(dialogLine : DialogLine) : string
    {
        let result = "";

        // foreach every text in segment
        dialogLine.txtSegment.texts.forEach(element => {

            // if has option
            if (element.ID === ">")
            {
                // show option
                result += "### " + element.text + "\n\n";
            }
            else // if it is normal line
            {
                let character : Character | undefined = undefined;
                
                // find character from id
                if (dialogLine.jsonSegment !== undefined)
                {
                    character = dialogLine.jsonSegment.characters.find((character : Character) => {
                        let result = character.texts.find((text) => {
                            return text.ID.toString() === element.ID;
                        });

                        return result !== undefined;
                    });
                }

                // if found character
                if (character !== undefined)
                {
                    result += "**" + character.name + "**";
                }
                else // if not
                {
                    result += "[" + element.ID + "]";  
                }

                // add text what character said
                result += ": " + element.text + "\n\n";
            }
        });

        // get link to `dialog.json` and `dialog.txt`
        let jsonPath = Dialog.getInstance().getDialogPath() + Dialog.JSON_FILENAME;
        let textPath = Dialog.getInstance().getDialogPath() + Dialog.TXT_FILENAME;

        // add link to message
        result += "[dialog.json](file:" + jsonPath + ")";
        result += " | ";
        result += "[dialog.txt](file:" + textPath + ")";
        return result;
    }

    private getHoverMessage(regex: RegExp, dialog: Dialog, line: string) : string
    {
        // parse current line
        let result = regex.exec(line);

        if (result !== null) 
        {
            // get id
            let id = result[1];

            // get dialog line from id
            let dialogLine = dialog.getDialogLine(id);

            if (dialogLine !== undefined)
            {
                // generate hover message
                let str = HoverProvider.getDialogText(dialogLine);

                // show hover message
                return str;
            }
        }

        return "";
    }

    provideHover(doc: vscode.TextDocument, pos: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> 
    {
        // get dialog instance and update
        let dialog = Dialog.getInstance();
        dialog.update(doc);
        
        // get line from position
        let line = doc.lineAt(pos.line).text;
        
        let result = "";

        result += this.getHoverMessage(/dialog:run\([\t ]*\"(.*)\"[\t ]*\)/,       dialog, line);
        result += this.getHoverMessage(/dialog:addOption\([\t ]*\"(.*)\"[\t ]*\)/, dialog, line);

        if (result.length !== 0)
        {
            return new vscode.Hover(result);
        }

        return null;
    }
}