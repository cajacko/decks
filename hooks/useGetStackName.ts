import { useAppSelector } from "@/store/hooks";
import { selectStackIds } from "@/store/selectors/tabletops";
import React from "react";

function stackName(
  orderedStackIds: string[] | null,
  stackId: string | null,
): string {
  if (!stackId) return "All Stacks";

  if (!orderedStackIds) return stackId;

  const stackNumber = orderedStackIds.indexOf(stackId) + 1;

  // The stack is not in the list of ordered stacks it's probably moveNewStackText.start or
  // moveNewStackText.end so we return it as is
  if (stackNumber <= 0) return stackId;

  return `Stack ${stackNumber}`;
}

export default function useGetStackName(tabletopId: string) {
  const stackIds = useAppSelector((state) =>
    selectStackIds(state, { tabletopId }),
  );

  return React.useCallback(
    (stackId: string | null) => stackName(stackIds, stackId),
    [stackIds],
  );
}
