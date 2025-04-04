import { createSlice } from "@reduxjs/toolkit";
import { Templates, SliceName } from "../types";
// import { setState, syncState } from "../combinedActions/sync";
// import { mergeMap } from "../utils/mergeData";

const initialState: Templates.State = {
  templatesById: {},
};

export const templatesSlice = createSlice({
  name: SliceName.Templates,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // builder.addCase(setState, (state, actions) => {
    //   state.templatesById =
    //     actions.payload.state[SliceName.Templates].templatesById;
    // });
    // builder.addCase(syncState, (state, actions) => {
    //   mergeMap(
    //     state.templatesById,
    //     actions.payload.state[SliceName.Templates].templatesById,
    //   );
    // });
  },
});

export default templatesSlice;
