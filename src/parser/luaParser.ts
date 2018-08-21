
import { TextDocument } from 'vscode';
import { dirname } from 'path';

export class LuaParser
{

    static GetDlgPath(doc: TextDocument)
    {
         // create regex
        let regex = /[\t ]*dialog:load\([\t ]*\"(.*)\"[\t ]*\);?[\t ]*/;

        // get match from regex
        var result = regex.exec(doc.getText());

        // check if found match
        if (result !== null)
        {   
            // get current path
            let dirPath = dirname(doc.fileName);

            // create file path to dialog.dlg
            return dirPath + "/" + result[1];
        }
    }
}
