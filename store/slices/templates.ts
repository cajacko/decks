import { createSlice } from "@reduxjs/toolkit";
import { Templates, RootState, SliceName } from "../types";
import flags from "@/config/flags";
import devInitialState from "../dev/devInitialState";
import templatesById from "@/config/templatesById";
import { builtInTemplatesById } from "@/config/builtInTemplates";

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
  state[templatesSlice.name].templatesById[props.templateId] ??
  builtInTemplatesById[props.templateId] ??
  null;

export const selectTemplateSchemaItem = (
  state: RootState,
  props: {
    templateId: Templates.TemplateId;
    templateSchemaItemId: Templates.DataItemId;
  },
): Templates.LooseDataItem | null =>
  selectTemplate(state, props)?.schema[props.templateSchemaItemId] ?? null;

export default templatesSlice;
