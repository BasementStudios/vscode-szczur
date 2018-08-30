export interface Text
{
    ID: string;
    text: string;
}

export interface Segment
{
    ID: string;
    texts: Text[];
    index: number;
}

export interface DialogTxtData
{
    segments: Segment[];
}