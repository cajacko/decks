import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, IncludedData, SliceName } from "../types";
import includedData from "@/constants/exampleDecks/includedData";

const initialState: IncludedData.State = {
  data: includedData,
  dateFetched: null,
};

export const slice = createSlice({
  name: SliceName.IncludedData,
  initialState,
  reducers: {
    updateIncludedData: (state, actions: PayloadAction<IncludedData.State>) => {
      state.data = actions.payload.data;
      state.dateFetched = actions.payload.dateFetched;
    },
    resetIncludedData: (state) => {
      state.data = initialState.data;
      state.dateFetched = initialState.dateFetched;
    },
  },
});

export const { updateIncludedData, resetIncludedData } = slice.actions;

export const selectIncludedData = (state: RootState): IncludedData.State =>
  state[SliceName.IncludedData];

export default slice;
