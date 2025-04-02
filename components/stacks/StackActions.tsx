import React from "react";
import FieldSet, { FieldSetProps } from "../forms/FieldSet";
import Picker from "../forms/Picker";
import { selectStackIds } from "@/store/slices/tabletop";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import Field from "../forms/Field";
import Button from "../forms/Button";
import {
  setStackOrder,
  changeCardState,
  moveCard,
  MoveCardInstanceMethod,
} from "@/store/slices/tabletop";
import uuid from "@/utils/uuid";
import text from "@/constants/text";
import { generateSeed } from "@/utils/seededShuffle";
import { StackListRef } from "./StackList";
import { dateToDateString } from "@/utils/dates";

export interface StackActionsProps extends FieldSetProps {
  tabletopId: string;
  stackListRef?: React.RefObject<StackListRef>;
}

const moveNewStackText = {
  start: text["settings.stack_actions.move.new_stack_start"],
  end: text["settings.stack_actions.move.new_stack_end"],
};

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

const defaultSelectedMoveToStackId = moveNewStackText.end;

function getDefaultSelectedMoveToStackId(
  stackIds: string[] | null,
  selectedStackId: string | null,
) {
  if (!stackIds) return defaultSelectedMoveToStackId;

  for (const stackId of stackIds) {
    if (stackId !== selectedStackId) {
      return stackId;
    }
  }

  return defaultSelectedMoveToStackId;
}

export default function StackActions({
  tabletopId,
  stackListRef,
  ...fieldSetProps
}: StackActionsProps): React.ReactNode {
  const dispatch = useAppDispatch();
  const stackIds = useAppSelector((state) =>
    selectStackIds(state, { tabletopId }),
  );

  const [selectedStackId, _setSelectedStackId] = React.useState<string | null>(
    null,
  );

  const [selectedMoveToStackId, setSelectedMoveToStackId] =
    React.useState<string>(() =>
      getDefaultSelectedMoveToStackId(stackIds, selectedStackId),
    );

  const setSelectedStackId = React.useCallback(
    (newValue: string | null) => {
      _setSelectedStackId(newValue);

      if (newValue !== selectedMoveToStackId) return;

      setSelectedMoveToStackId(
        getDefaultSelectedMoveToStackId(stackIds, newValue),
      );
    },
    [selectedMoveToStackId, stackIds],
  );

  const shuffle = React.useCallback(
    () =>
      dispatch(
        setStackOrder({
          tabletopId,
          stackId: selectedStackId,
          method: { type: "shuffle", seed: generateSeed() },
          allCardInstancesState: "noChange",
          date: dateToDateString(new Date()),
          operation: {
            type: "SHUFFLE",
            payload: {
              scrollOffset: stackListRef?.current?.getScrollOffset() ?? null,
            },
          },
        }),
      ),
    [dispatch, tabletopId, selectedStackId, stackListRef],
  );

  const flipFaceDown = React.useCallback(
    () =>
      dispatch(
        changeCardState({
          tabletopId,
          target: { stackId: selectedStackId },
          side: "back",
          date: dateToDateString(new Date()),
          operation: {
            type: selectedStackId
              ? "FLIP_STACK_FACE_DOWN"
              : "FLIP_ALL_FACE_DOWN",
            payload: {
              scrollOffset: stackListRef?.current?.getScrollOffset() ?? null,
            },
          },
        }),
      ),
    [dispatch, tabletopId, selectedStackId, stackListRef],
  );

  const flipFaceDownUp = React.useCallback(
    () =>
      dispatch(
        changeCardState({
          tabletopId,
          target: { stackId: selectedStackId },
          side: "front",
          date: dateToDateString(new Date()),
          operation: {
            type: selectedStackId ? "FLIP_STACK_FACE_UP" : "FLIP_ALL_FACE_UP",
            payload: {
              scrollOffset: stackListRef?.current?.getScrollOffset() ?? null,
            },
          },
        }),
      ),
    [dispatch, tabletopId, selectedStackId, stackListRef],
  );

  const moveToTarget = React.useMemo((): {
    stackId: string;
    newStackDirection?: "start" | "end";
  } => {
    if (selectedMoveToStackId === moveNewStackText.start) {
      return { stackId: uuid(), newStackDirection: "start" };
    }
    if (selectedMoveToStackId === moveNewStackText.end) {
      return { stackId: uuid(), newStackDirection: "end" };
    }
    return { stackId: selectedMoveToStackId };
  }, [selectedMoveToStackId]);

  const moveTop = React.useCallback(
    () =>
      dispatch(
        moveCard({
          method: MoveCardInstanceMethod.topNoChange,
          tabletopId,
          moveTarget: { stackId: selectedStackId },
          toTarget: moveToTarget,
          date: dateToDateString(new Date()),
          operation: {
            type: selectedStackId
              ? "MOVE_STACK_CARDS_TO_TOP"
              : "MOVE_ALL_CARDS_TO_TOP",
            payload: {
              scrollOffset: stackListRef?.current?.getScrollOffset() ?? null,
            },
          },
        }),
      ),
    [tabletopId, selectedStackId, moveToTarget, dispatch, stackListRef],
  );

  const moveBottom = React.useCallback(
    () =>
      dispatch(
        moveCard({
          method: MoveCardInstanceMethod.bottomNoChange,
          tabletopId,
          moveTarget: { stackId: selectedStackId },
          toTarget: moveToTarget,
          date: dateToDateString(new Date()),
          operation: {
            type: selectedStackId
              ? "MOVE_STACK_CARDS_TO_BOTTOM"
              : "MOVE_ALL_CARDS_TO_BOTTOM",
            payload: {
              scrollOffset: stackListRef?.current?.getScrollOffset() ?? null,
            },
          },
        }),
      ),
    [tabletopId, selectedStackId, moveToTarget, dispatch, stackListRef],
  );

  const reverseStack = React.useCallback(
    () =>
      dispatch(
        setStackOrder({
          tabletopId,
          stackId: selectedStackId,
          method: { type: "reverse" },
          allCardInstancesState: "noChange",
          date: dateToDateString(new Date()),
          operation: {
            type: selectedStackId ? "REVERSE_ALL_CARDS" : "REVERSE_STACK",
            payload: {
              scrollOffset: stackListRef?.current?.getScrollOffset() ?? null,
            },
          },
        }),
      ),
    [tabletopId, selectedStackId, dispatch, stackListRef],
  );

  const selectedStackName = stackName(stackIds, selectedStackId);
  const selectedMoveToStackName = stackName(stackIds, selectedMoveToStackId);

  return (
    <FieldSet title="Stack Actions" {...fieldSetProps}>
      <Field subLabel="The stack to apply the action to">
        <Picker
          selectedValue={selectedStackId}
          onValueChange={setSelectedStackId}
          items={[
            { label: "All Stacks", value: null, key: "all-stacks" },
            ...(stackIds ?? []).map((stackId) => ({
              key: stackId,
              label: stackName(stackIds, stackId),
              value: stackId,
            })),
          ]}
        />
      </Field>
      <Button
        title={`Shuffle ${selectedStackName}`}
        variant="outline"
        onPress={shuffle}
        vibrate
      />
      <Button
        title={`Reverse ${selectedStackName}`}
        variant="outline"
        onPress={reverseStack}
        vibrate
      />
      <Button
        title={`Flip ${selectedStackName} Face Down`}
        variant="outline"
        onPress={flipFaceDown}
        vibrate
      />
      <Button
        title={`Flip ${selectedStackName} Face Up`}
        variant="outline"
        onPress={flipFaceDownUp}
        vibrate
      />

      <FieldSet
        title={`Move Cards From ${selectedStackName}`}
        titleProps={{ type: "h4" }}
        collapsible
        initialCollapsed
      >
        <Field label="To Stack:">
          <Picker<string>
            selectedValue={selectedMoveToStackId}
            onValueChange={setSelectedMoveToStackId}
            items={[
              ...(stackIds
                ?.filter((stackId) => stackId !== selectedStackId)
                .map((stackId) => ({
                  key: stackId,
                  label: stackName(stackIds, stackId),
                  value: stackId,
                })) ?? []),
              {
                label: moveNewStackText.end,
                value: moveNewStackText.end,
              },
              {
                label: moveNewStackText.start,
                value: moveNewStackText.start,
              },
            ]}
          />
        </Field>
        <Field
          subLabel={
            selectedStackId === null
              ? `Takes the first stack, puts it on top of the one after it, puts all that on top of the one after that etc (ignoring ${selectedMoveToStackName}). And then places all these cards on top of ${selectedMoveToStackName}`
              : undefined
          }
        >
          <Button
            title={`Move ${selectedStackName} on top of ${selectedMoveToStackName}`}
            variant="outline"
            onPress={moveTop}
            vibrate
          />
        </Field>
        <Field
          subLabel={
            selectedStackId === null
              ? `Takes the first stack, puts it on top of the one after it, puts all that on top of the one after that etc (ignoring ${selectedMoveToStackName}). And then places all these cards below ${selectedMoveToStackName}`
              : undefined
          }
        >
          <Button
            title={`Move ${selectedStackName} below ${selectedMoveToStackName}`}
            variant="outline"
            onPress={moveBottom}
            vibrate
          />
        </Field>
      </FieldSet>
    </FieldSet>
  );
}
