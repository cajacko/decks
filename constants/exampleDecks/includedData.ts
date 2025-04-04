import json from "./includedData.json";
import { Deck } from "@/api/dex/includedData";
import * as Store from "@/store/types";

// Can safely cast as any of these if necessary
export type ApiData = Deck[];
export type ReduxData = Store.IncludedData.Data;
export type FileData = Store.IncludedData.Decks;
export type IncludedData = ApiData | ReduxData | FileData;

const includedData =
  json satisfies ApiData satisfies ReduxData satisfies FileData;

export default includedData;
