import React from "react";

type CacheItem<T = unknown> = {
  deps: React.DependencyList;
  value: T;
};

/**
 * Mimics React's dependency comparison algorithm for useMemo/useEffect.
 * Loose equality check with referential equality for objects/arrays.
 */
function areDepsEqual(
  prevDeps: React.DependencyList,
  nextDeps: React.DependencyList,
) {
  if (prevDeps.length !== nextDeps.length) return false;

  for (let i = 0; i < prevDeps.length; i++) {
    if (Object.is(prevDeps[i], nextDeps[i])) continue;

    return false;
  }

  return true;
}

/**
 * Stores the cached values outside of the component, and returns the same reference if the props
 * are the same, no matter if the component is unmounted and remounted. This is useful in our
 * templates which can be costly to use handlebars etc too often. So this allows us to return the
 * same references for the optimisations the template component does.
 */
export default function withUseExternalMemo<T>() {
  const cache = new Map<string, CacheItem<T>>();

  function useExternalMemo(
    factory: () => T,
    deps: React.DependencyList,
    cacheKey: string,
  ): T {
    return React.useMemo<T>((): T => {
      const cacheItem = cache.get(cacheKey);

      if (cacheItem) {
        if (areDepsEqual(cacheItem.deps, deps)) {
          return cacheItem.value;
        }
      }

      // Compute new value and store it in the cache
      const value = factory();
      cache.set(cacheKey, { deps, value });

      return value;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, cacheKey]);
  }

  return { useExternalMemo };
}
