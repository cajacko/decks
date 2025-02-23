import React from "react";
import { TemplateContext, Data } from "./Template.types";

const Context = React.createContext<TemplateContext<Data> | null>(null);

function getIsTemplateData<D extends Data>(data: Data): data is D {
  return true;
}

export function useTemplateDataItem<D extends Data>(key: keyof D): D[keyof D] {
  const context = React.useContext(Context);

  if (!context) {
    throw new Error("Template context is not set up, use the provider");
  }

  if (!getIsTemplateData<D>(context.data)) {
    throw new Error("Template data is not valid");
  }

  return context.data[key];
}

export function TemplateProvider<D extends Data>({
  data,
  children,
}: {
  data: D;
  children: React.ReactNode;
}): JSX.Element {
  const value = React.useMemo<TemplateContext<D>>(() => ({ data }), [data]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
