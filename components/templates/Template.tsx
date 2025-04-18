import React from "react";
import { TemplateProps } from "./Template.types";
import { MarkupChildren } from "./MarkupNode";
import { TemplateProvider } from "./TemplateContext";
import uuid from "@/utils/uuid";
import { usePerformanceMonitor } from "@/context/PerformanceMonitor";

const objectIdMap = new WeakMap<object, string>();

function getObjectId(obj: object): string {
  if (!objectIdMap.has(obj)) {
    objectIdMap.set(obj, uuid());
  }

  return objectIdMap.get(obj)!;
}

function getCacheKey(objA?: object | null, objB?: object | null): string {
  return `${objA ? getObjectId(objA) : ""}-${objB ? getObjectId(objB) : ""}`;
}

export default React.memo<TemplateProps>(function Template({ values, markup }) {
  const cacheKey = getCacheKey(values, markup);

  usePerformanceMonitor({
    Component: Template.name,
  });

  return (
    <TemplateProvider values={values ?? null}>
      <MarkupChildren nodes={markup} cacheKey={cacheKey} />
    </TemplateProvider>
  );
});
