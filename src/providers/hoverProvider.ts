import * as vscode from 'vscode';

import { DlgParser } from '../parser/dlgParser';
import { LuaParser } from '../parser/luaParser';

export class HoverProvider implements vscode.HoverProvider 
{
   dlgParser: DlgParser = new DlgParser();

   provideHover(doc: vscode.TextDocument, pos: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> 
   {
        let line = doc.lineAt(pos.line).text;
        let regex = /^[\t ]*dialog:runText\([\t ]*(\d+)[\t ]*,[\t ]*(\d+)[\t ]*\);?[\t ]*$/;
        let result = regex.exec(line);
        if (result !== null) 
        {
            // get path to dlg from lua
            let path = LuaParser.GetDlgPath(doc);

            if (path !== undefined)
            {
                // parse dlg
                this.dlgParser.parseFile(path);
            }
            else
            {
                return null;
            }

            let major = result[1];
            let minor = result[2];
            let findResult = this.dlgParser.options.find(option => option.isEqual(major, minor));
            
            if (findResult !== undefined) 
            {
                return new vscode.Hover(findResult.title);
            }
            return null;
        }
        return null;
    }
}