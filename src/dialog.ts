import { LuaParser } from "./parser/luaParser";
import { DialogJsonData, Segment } from "./data/dialogJsonData";
import { DialogTxtData } from "./data/dialogTxtData";

import { TextDocument } from "vscode";
import { stat, readFileSync } from "fs";
import { DialogTxtParser } from "./parser/dialogTxtParser";


export interface DialogLine
{
    dialogJsonData : DialogJsonData;
    dialogTxtData : DialogTxtData;
}

export class Dialog
{
    static instance : Dialog | undefined;

    public static JSON_FILENAME = "/dialog.json";
    public static TXT_FILENAME = "/dialog.txt";


    dialogPath: string | undefined;

    dialogJsonMTime : Date = new Date();
    dialogTxtMTime : Date = new Date();

    dialogLines: Map<string, DialogLine> = new Map<string, DialogLine>();

    dialogJsonData: DialogJsonData | undefined;
    dialogTxtData: DialogTxtData | undefined;

    newDialogFiles : boolean = true;

    readDialogJson()
    {
        let data = readFileSync(this.dialogPath + Dialog.JSON_FILENAME).toString();

        if (data)
        {
            this.dialogJsonData = JSON.parse(data);
        }
        else
        {
            this.dialogJsonData = undefined;
        }
    }

    readDialogTxt()
    {
        this.dialogTxtData = DialogTxtParser.parse(this.dialogPath + Dialog.TXT_FILENAME);
    }

    updateDialogLines()
    {
       
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
                    // load and parse json data
                    this.readDialogJson();

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
                    // load and parse txt data
                    this.readDialogTxt();

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
