import { readFileSync } from "fs";
import { DialogTxtData, Segment, Text } from "../data/dialogTxtData";

export class DialogTxtParser
{
    private static parseSegments(data: string, dialogTxtData: DialogTxtData) : DialogTxtData
    {
        // create regex
        const regex = /\{(.*)\}/g;

        let result;

        dialogTxtData.segments = Array<Segment>();

        // find every dialog option
        while ((result = regex.exec(data)) !== null) 
        {
            // This is necessary to avoid infinite loops with zero-width matches
            if (result.index === regex.lastIndex) 
            {
                regex.lastIndex++;
            }

            // create segment
            let segment = <Segment> {};
            segment.ID = result[1];
            segment.index = result.index;
            segment.texts = Array<Text>();

            // index is for parsing texts

            // add segment to segments
            dialogTxtData.segments.push(segment);
        }

        return dialogTxtData;
    }

    private static parseTexts(data: string, dialogTxtData: DialogTxtData) : DialogTxtData
    {
        for (let i = 0; i < dialogTxtData.segments.length; i++)
        {
            let segment = dialogTxtData.segments[i];

            // console.log("Parsing for: " + segment.ID);

            // create regex
            const regex = /\[([\d>])*\][\t ]*(.*)/g;

            let segemntData = data.substring(segment.index);

            let result;

            // find every dialog option
            while ((result = regex.exec(segemntData)) !== null) 
            {
                // This is necessary to avoid infinite loops with zero-width matches
                if (result.index === regex.lastIndex) 
                {
                    regex.lastIndex++;
                }

                // if parsing texts in next segment
                if (i < dialogTxtData.segments.length - 1 && 
                    (result.index + segment.index) > dialogTxtData.segments[i + 1].index)
                {
                    break;
                }

                var text = <Text> {};
                text.ID = result[1];
                text.text = result[2];

                // console.log(" [" + text.ID + "] " + text.text);

                segment.texts.push(text);
            }

        }

        return dialogTxtData;
    }

    static parseData(data: string) : DialogTxtData
    {
        let dialogTxtData = <DialogTxtData> {};

        dialogTxtData = this.parseSegments(data, dialogTxtData);
        dialogTxtData = this.parseTexts(data, dialogTxtData);

        return dialogTxtData;
    }

    public static parse(path: string) : DialogTxtData | undefined
    {
        // read data from file
        let data = readFileSync(path);

        // if data isn't empty
        if (data)
        {
            // then parse and return DialogTxtData
            return this.parseData(data.toString());
        }

        return undefined;
    }
}