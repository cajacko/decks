import { createSlice } from "@reduxjs/toolkit";
import { Templates, RootState, SliceName } from "../types";
import flags from "@/config/flags";
import devInitialState from "../dev/devInitialState";
import templatesById from "@/config/templatesById";

const initialState: Templates.State = flags.USE_DEV_INITIAL_REDUX_STATE
  ? devInitialState.templates
  : {
      templatesById,
    };

export const templatesSlice = createSlice({
  name: SliceName.Templates,
  initialState,
  reducers: {},
});

export const selectTemplate = (
  state: RootState,
  props: { templateId: Templates.TemplateId },
): Templates.Props | null =>
  state[templatesSlice.name].templatesById[props.templateId] ?? null;

export default templatesSlice;
