import { LuaParser } from "./parser/luaParser";
import { TextDocument } from "vscode";
import { fstat, stat } from "fs";

export class DialogLine
{
    constructor()
    {

    }
}

export class Dialog
{
    static instance : Dialog | undefined;

    public static JSON_FILENAME = "/dialog.json";
    public static TXT_FILENAME = "/dialog.txt";


    dialogPath: string | undefined;

    dialogJsonMTime : Date = new Date();
    dialogTxtMTime : Date = new Date();

    dialogLines: DialogLine[] = [];

    newDialogFiles : boolean = true;

    readDialogJson() {

        

        //JSON.parse()
    }

    update(doc: TextDocument) 
    {
        let newDialogPath = LuaParser.getDialogDirectory(doc);

        // check if there is new path
        if (this.dialogPath !== newDialogPath)
        {
            this.dialogPath = newDialogPath;
            this.newDialogFiles = true;
        }

        if (newDialogPath !== undefined)
        {
            // check if `dialog.json` have changed
            stat(this.dialogPath + Dialog.JSON_FILENAME, (err, stats) => {
                if (err)
                {
                    throw err;
                }

                if (this.newDialogFiles === true || this.dialogJsonMTime.getTime() !== stats.mtime.getTime())
                {
                    console.log("Update json");

                    this.dialogJsonMTime = stats.mtime;
                }
            });

            // check if `dialog.txt` have changed
            stat(this.dialogPath + Dialog.TXT_FILENAME, (err, stats) => {
                if (err)
                {
                    throw err;
                }

                if (this.newDialogFiles === true || this.dialogTxtMTime.getTime() !== stats.mtime.getTime())
                {
                    console.log("Update txt");

                    this.dialogTxtMTime = stats.mtime;
                }
            });

            this.newDialogFiles = false;
        }
    }

    static getInstance() : Dialog
    {
        if (this.instance === undefined)
        {
            this.instance = new Dialog();
        }

        return this.instance;
    }
}
