import React from "react";
import { TemplateContext, Data, Values } from "./Template.types";

const Context = React.createContext<TemplateContext<Data> | null>(null);

function getIsTemplateData<D extends Data>(data: Data): data is D {
  return true;
}

export function useTemplateDataItem<D extends Data>() {
  const context = React.useContext(Context);

  if (!context) {
    throw new Error("Template context is not set up, use the provider");
  }

  if (!getIsTemplateData<D>(context.data)) {
    throw new Error("Template data is not valid");
  }

  return context;
}

export function TemplateProvider<D extends Data>({
  data,
  children,
}: {
  data: D;
  children: React.ReactNode;
}): JSX.Element {
  const value = React.useMemo<TemplateContext<D>>(() => {
    const init: Values = {};

    const values = Object.entries(data).reduce((acc, [key, value]) => {
      acc[key] = value.value?.value;

      return acc;
    }, init);

    return { data, values };
  }, [data]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
