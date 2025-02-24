import React from "react";
import { TemplateContext, Values } from "./Template.types";

const Context = React.createContext<TemplateContext | null>(null);

export function useTemplateDataItem() {
  const context = React.useContext(Context);

  if (!context) {
    throw new Error("Template context is not set up, use the provider");
  }

  return context;
}

export function TemplateProvider({
  children,
  values,
}: {
  values: Values;
  children: React.ReactNode;
}): JSX.Element {
  return <Context.Provider value={values}>{children}</Context.Provider>;
}
