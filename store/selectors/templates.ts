import { Templates, RootState } from "../types";
import withBuiltInState from "../utils/withBuiltInState";
import { builtInTemplatesById } from "@/constants/builtInTemplates";

export const selectTemplate = withBuiltInState(
  (
    state: RootState,
    props: { templateId: Templates.Id },
  ): Templates.Props | undefined =>
    state.templates.templatesById[props.templateId] ??
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
