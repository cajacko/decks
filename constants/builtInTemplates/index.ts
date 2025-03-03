import front from "./front";
import back from "./back";
import { Templates } from "@/store/types";

const builtInTemplates = {
  front,
  back,
} satisfies Record<string, Templates.Props>;

export const builtInTemplatesById: Templates.State["templatesById"] =
  Object.fromEntries(
    Object.values(builtInTemplates).map((template) => [
      template.templateId,
      template,
    ]),
  );

export default builtInTemplates;
