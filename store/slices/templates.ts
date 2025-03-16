import { createSlice } from "@reduxjs/toolkit";
import { Templates, RootState, SliceName } from "../types";
import { getFlag } from "@/utils/flags";
import devInitialState from "../dev/devInitialState";
import withBuiltInState from "../utils/withBuiltInState";
import { builtInTemplatesById } from "@/constants/builtInTemplates";

const initialState: Templates.State = getFlag(
  "USE_DEV_INITIAL_REDUX_STATE",
  null,
)
  ? devInitialState.templates
  : {
      templatesById: {},
    };

export const templatesSlice = createSlice({
  name: SliceName.Templates,
  initialState,
  reducers: {},
});

export const selectTemplate = withBuiltInState(
  (
    state: RootState,
    props: { templateId: Templates.Id },
  ): Templates.Props | undefined =>
    state[templatesSlice.name].templatesById[props.templateId] ??
    builtInTemplatesById[props.templateId],
);

export const selectTemplateSchemaItem = (
  state: RootState,
  props: {
    templateId: Templates.Id;
    templateDataId: Templates.DataId;
  },
): Templates.DataItem | null =>
  selectTemplate(state, props)?.schema[props.templateDataId] ?? null;

export default templatesSlice;
