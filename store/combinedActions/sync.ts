import { createAction } from "@reduxjs/toolkit";
import { RootState, DateString } from "../types";

export const setState = createAction<{
  state: RootState;
  dateSaved: DateString;
  date: DateString;
  lastSyncSize: string;
}>("setState");

export const syncState = createAction<{
  state: RootState;
  dateSaved: DateString;
  date: DateString;
  removeAllDeletedBefore: DateString | null;
  lastSyncSize: string;
}>("syncState");

export const removeDeletedContent = createAction<{
  removeAllDeletedBefore: DateString;
  date: DateString;
}>("syncRemoveDeletedContent");
