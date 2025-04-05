import { createAction } from "@reduxjs/toolkit";
import { RootState, DateString } from "../types";

export const setState = createAction<{
  state: RootState;
  dateSaved: DateString;
  date: DateString;
}>("setState");

export const syncState = createAction<{
  state: RootState;
  dateSaved: DateString;
  date: DateString;
}>("syncState");
