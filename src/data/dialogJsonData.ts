export interface Text
{
    ID: number;
    timestamp: number;
    duration: number;
    color: string;
}

export interface Sound
{
    timestamp: number;
    duration: number;
    sourceTimestamp: number;
    sourceDuration: number;
    dB: number;
}

export interface Emotion
{
    timestamp: number;
    duration: number;
    type: string;
    intennsity: number;
    fadeIn: string;
}

export interface Character
{
    name: string;
    ID: string;
    textDefaultFont: string;
    texts: Text[];
    sounds: Sound[];
    emotions: Emotion[];
}

export interface Event
{
    timestamp: number;
    name: string;
}

export interface Segment
{
    ID: string;
    textDefaultColor: string;
    characters: Character[];
    optionIcon: string;
    events: Event[];
}

export interface DialogJsonData
{
    soundDefaultSource: string;
    segments: Segment[];
}
