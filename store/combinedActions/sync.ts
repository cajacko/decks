import { createAction } from "@reduxjs/toolkit";
import { RootState } from "../types";

export const setState = createAction<{
  state: RootState;
  dateSaved: string;
}>("setState");

export const syncState = createAction<{
  state: RootState;
  dateSaved: string;
}>("syncState");
