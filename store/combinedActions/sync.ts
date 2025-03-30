import { createAction } from "@reduxjs/toolkit";
import { RootState } from "../types";

export const syncState = createAction<{
  state: RootState;
  dateSaved: string;
}>("syncState");
