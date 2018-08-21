import { readFileSync } from "fs";

export class Option
{
    public major:string;
    public minor:string;

    public title:string;

    constructor(major:string, minor:string, title:string) 
    {
        this.major = major;
        this.minor = minor;
        this.title = title;
    }

    public isEqual(major:string, minor:string) : boolean
    {
        return (this.major === major && this.minor === minor);
    }
}

export class DlgParser
{
    public options:Option[] = [];

    public getOptions(fileData: string)
    {
        // reset array
        this.options = [];

        // create regex
        const regex = /\[(\d+)\]\[(\d+)\]\[.*\]\[(.*)\]/g;

        let result;

        // find every dialog option
        while ((result = regex.exec(fileData)) !== null) 
        {
            // This is necessary to avoid infinite loops with zero-width matches
            if (result.index === regex.lastIndex) 
            {
                regex.lastIndex++;
            }
            
            // create option
            let option = new Option(result[1], result[2], result[3]);

            // add option to array
            this.options.push(option);
        }

        return this.options;
    }

    public parseFile(filePath: string)
    {
        let buffer = readFileSync(filePath);

        return this.getOptions(buffer.toString());
    }
}