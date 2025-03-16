import { Templates } from "@/store/types";
import front from "./front";
import back from "./back";
import playingCards from "./playingCards";
import { registerBuiltInState } from "@/store/utils/withBuiltInState";

export * as playingCards from "./playingCards";
export * as front from "./front";
export * as back from "./back";

const builtInTemplates = {
  front,
  back,
  playingCards,
} satisfies Record<string, Templates.Props>;

export type BuiltInTemplateKey = keyof typeof builtInTemplates;

export const builtInTemplatesById: Templates.State["templatesById"] =
  Object.fromEntries(
    Object.values(builtInTemplates).map((template) => [
      template.templateId,
      template,
    ]),
  );

registerBuiltInState({
  templates: {
    templatesById: builtInTemplatesById,
  },
});

export default builtInTemplates;
