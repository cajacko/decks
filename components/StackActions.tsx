import React from "react";
import FieldSet, { FieldSetProps } from "./FieldSet";
import Picker, { PickerItem } from "./Picker";
import { selectStackIds } from "@/store/slices/tabletop";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import Field from "./Field";
import Button from "./Button";
import {
  setStackOrder,
  changeCardState,
  moveCard,
  MoveCardInstanceMethod,
} from "@/store/slices/tabletop";
import uuid from "@/utils/uuid";
import text from "@/constants/text";
import { generateSeed } from "@/utils/seededShuffle";

export interface StackActionsProps extends FieldSetProps {
  tabletopId: string;
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
        }),
      ),
    [dispatch, tabletopId, selectedStackId],
  );

  const flipFaceDown = React.useCallback(
    () =>
      dispatch(
        changeCardState({
          tabletopId,
          target: { stackId: selectedStackId },
          side: "back",
        }),
      ),
    [dispatch, tabletopId, selectedStackId],
  );

  const flipFaceDownUp = React.useCallback(
    () =>
      dispatch(
        changeCardState({
          tabletopId,
          target: { stackId: selectedStackId },
          side: "front",
        }),
      ),
    [dispatch, tabletopId, selectedStackId],
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
        }),
      ),
    [tabletopId, selectedStackId, moveToTarget, dispatch],
  );

  const moveBottom = React.useCallback(
    () =>
      dispatch(
        moveCard({
          method: MoveCardInstanceMethod.bottomNoChange,
          tabletopId,
          moveTarget: { stackId: selectedStackId },
          toTarget: moveToTarget,
        }),
      ),
    [tabletopId, selectedStackId, moveToTarget, dispatch],
  );

  const reverseStack = React.useCallback(
    () =>
      dispatch(
        setStackOrder({
          tabletopId,
          stackId: selectedStackId,
          method: { type: "reverse" },
          allCardInstancesState: "noChange",
        }),
      ),
    [tabletopId, selectedStackId, dispatch],
  );

  const selectedStackName = stackName(stackIds, selectedStackId);
  const selectedMoveToStackName = stackName(stackIds, selectedMoveToStackId);

  return (
    <FieldSet title="Stack Actions" {...fieldSetProps}>
      <Field subLabel="The stack to apply the action to">
        <Picker
          selectedValue={selectedStackId}
          onValueChange={setSelectedStackId}
          iosButtonTitle={stackName(stackIds, selectedStackId)}
        >
          <PickerItem label="All Stacks" value={null} />
          {stackIds?.map((stackId) => (
            <PickerItem
              key={stackId}
              label={stackName(stackIds, stackId)}
              value={stackId}
            />
          ))}
        </Picker>
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
          <Picker
            selectedValue={selectedMoveToStackId}
            onValueChange={setSelectedMoveToStackId}
            iosButtonTitle={stackName(stackIds, selectedMoveToStackId)}
          >
            {stackIds
              ?.filter((stackId) => stackId !== selectedStackId)
              ?.map((stackId) => (
                <PickerItem
                  key={stackId}
                  label={stackName(stackIds, stackId)}
                  value={stackId}
                />
              ))}
            <PickerItem
              label={moveNewStackText.end}
              value={moveNewStackText.end}
            />
            <PickerItem
              label={moveNewStackText.start}
              value={moveNewStackText.start}
            />
          </Picker>
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
