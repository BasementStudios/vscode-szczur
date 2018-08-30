import { TextDocument } from "vscode";
import { readFileSync, statSync } from "fs";
import { DialogTxtParser } from "./parser/dialogTxtParser";

import { LuaParser } from "./parser/luaParser";

import * as jsonData from "./data/dialogJsonData";
import * as txtData  from "./data/dialogTxtData";

export interface DialogLine
{
    jsonSegment : jsonData.Segment;
    txtSegment : txtData.Segment;
}

export class Dialog
{
/// static
    static instance : Dialog | undefined;

    public static JSON_FILENAME = "/dialog.json";
    public static TXT_FILENAME = "/dialog.txt";

/// fields

    private dialogPath: string | undefined;

    private dialogJsonMTime : Date = new Date();
    private dialogTxtMTime : Date = new Date();

    private dialogLines: Map<string, DialogLine> = new Map<string, DialogLine>();

    private dialogJsonData: jsonData.DialogJsonData | undefined;
    private dialogTxtData: txtData.DialogTxtData | undefined;

    private newDialogFiles : boolean = true;

/// public methods

    public update(doc: TextDocument) 
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
            {
                let stats = statSync(this.dialogPath + Dialog.JSON_FILENAME);
                
                if (stats)
                {
                    if (this.newDialogFiles === true || this.dialogJsonMTime.getTime() !== stats.mtime.getTime())
                    {
                        // load and parse json data
                        this.readDialogJson();

                        this.dialogJsonMTime = stats.mtime;
                    }           
                }
            }
 

            // check if `dialog.txt` have changed
            {
                let stats = statSync(this.dialogPath + Dialog.TXT_FILENAME);
            
                if (stats)
                {
                    if (this.newDialogFiles === true || this.dialogTxtMTime.getTime() !== stats.mtime.getTime())
                    {
                        // load and parse txt data
                        this.readDialogTxt();

                        this.dialogTxtMTime = stats.mtime;
                    }
                }
            }
            
            this.newDialogFiles = false;

            // update dialog lines
            this.updateDialogLines();
        }
    }

    public getDialogLine(id: string) { return this.dialogLines.get(id); }

    public getDialogPath() { return this.dialogPath; }

/// private methods

    private readDialogJson()
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

    private readDialogTxt()
    {
        this.dialogTxtData = DialogTxtParser.parse(this.dialogPath + Dialog.TXT_FILENAME);
    }

    private updateDialogLines()
    {
        // reset all dialog lines
        this.dialogLines.clear();

        if (this.dialogTxtData !== undefined && this.dialogJsonData !== undefined)
        {
            let dialogJsonData = this.dialogJsonData;

            this.dialogTxtData.segments.forEach(txtSegment => {

                let jsonSegment = dialogJsonData.segments.find((segment : jsonData.Segment) => { return segment.ID === txtSegment.ID; });

                if (jsonSegment !== undefined)
                {
                    let dialogLine = <DialogLine> {};
                    dialogLine.txtSegment = txtSegment;
                    dialogLine.jsonSegment = jsonSegment;

                    this.dialogLines.set(txtSegment.ID, dialogLine);
                }
            });
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
