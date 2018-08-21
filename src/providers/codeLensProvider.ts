import * as vscode from 'vscode';
import { DlgParser } from '../parser/dlgParser';
import { LuaParser } from '../parser/luaParser';

export class CodeLensProvider implements vscode.CodeLensProvider 
{
    dlgParser:DlgParser = new DlgParser();

    onDidChangeCodeLenses?: vscode.Event<void> | undefined;   
    provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CodeLens[]> 
    {
        // get path to dlg from lua
        let path = LuaParser.GetDlgPath(document);

        if (path !== undefined)
        {
            // parse dlg
            this.dlgParser.parseFile(path);
        }
        else
        {
            return null;
        }

        // create empty array
        var codeLensArr:vscode.CodeLens[] = [];

        // create regex object
        const regex = /[\t ]*dialog:runText\([\t ]*(\d+)[\t ]*,[\t ]*(\d+)[\t ]*\);?[\t ]*/g;

        let result;

        // find every `runText`
        while ((result = regex.exec(document.getText())) !== null) 
        {
         // This is necessary to avoid infinite loops with zero-width matches
            if (result.index === regex.lastIndex)
            {
                regex.lastIndex++;
            }

            // get major and minor value
            let major = result[1];
            let minor = result[2];
            
            // get line where it happens
            let line = document.lineAt(document.positionAt(regex.lastIndex));

            // if array exists
            if (this.dlgParser.options)
            {
                // find option in array
                var option = this.dlgParser.options.find(option => option.isEqual(major, minor));

                // if found option
                if (option !== undefined)
                {
                    // create codeLens and add to array
                    let codeLens = new vscode.CodeLens(line.range, { command: "", title: option.title });
                    codeLensArr.push(codeLens);
                }
            }
        }

        //console.log("Update: " + lens.length);

        return codeLensArr;
    }


}
