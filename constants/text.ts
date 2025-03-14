import json from "./text.json";

const text = json satisfies Record<string, string>;

export type TextKey = keyof typeof text;

export default text;
