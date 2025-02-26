import React from "react";
import { TemplateContext, Values } from "./Template.types";
import AppError from "@/classes/AppError";

const Context = React.createContext<TemplateContext | null>(null);

export function useTemplateDataItem() {
  const context = React.useContext(Context);

  if (!context) {
    new AppError(
      `${useTemplateDataItem.name}: Template context is not set up, use ${TemplateProvider.name}`,
    ).log("error");
  }

  return context;
}

export function TemplateProvider({
  children,
  values,
}: {
  values: Values | null;
  children: React.ReactNode;
}): JSX.Element {
  return <Context.Provider value={values}>{children}</Context.Provider>;
}
