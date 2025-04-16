import React from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import FieldSet, {
  FieldSetProps,
  useLeftAdornmentSize,
} from "../forms/FieldSet";
import text from "@/constants/text";
import Button from "@/components/forms/Button";
import useDeleteWarning from "@/hooks/useDeleteWarning";
import { selectCanEditDeck, selectDeck } from "@/store/selectors/decks";
import deckNameWithFallback from "@/utils/deckNameWithFallback";
import {
  resetTabletopHelper,
  addMissingTabletopCardsHelper,
} from "@/store/actionHelpers/tabletop";
import SwitchField from "../forms/SwitchField";
import StackActions from "../stacks/StackActions";
import useTabletopHistory, {
  UseTabletopHistoryOptions,
} from "@/hooks/useTabletopHistory";
import { setTabletopSetting } from "@/store/slices/tabletop";
import { selectTabletopSettings } from "@/store/combinedSelectors/tabletops";
import { dateToDateString } from "@/utils/dates";
import IconSymbol from "../ui/IconSymbol";
import useFlag from "@/hooks/useFlag";

const titleProps = { type: "h2" } as const;

export interface SettingsTabletopProps
  extends FieldSetProps,
    UseTabletopHistoryOptions {
  deckId: string;
  tabletopId: string;
}

export default function SettingsTabletop({
  deckId,
  tabletopId,
  ...props
}: SettingsTabletopProps): React.ReactNode {
  const dispatch = useAppDispatch();
  const hideNeatStackOption =
    useFlag("GLOBAL_NEAT_STACK_BEHAVIOUR") === "force-neat";
  const canEdit = useAppSelector((state) =>
    selectCanEditDeck(state, { deckId }),
  );
  const { undo, redo } = useTabletopHistory(tabletopId, props);
  const deckName = deckNameWithFallback(
    useAppSelector((state) => selectDeck(state, { deckId })?.name),
  );
  const settings =
    useAppSelector((state) => selectTabletopSettings(state, { tabletopId })) ??
    {};

  const resetTabletop = React.useCallback(() => {
    dispatch(resetTabletopHelper({ tabletopId }));
  }, [tabletopId, dispatch]);

  const resetTabletopModal = useDeleteWarning({
    handleDelete: resetTabletop,
    title: text["tabletop.reset.title"],
    message: text["tabletop.reset.message"],
    deleteButtonText: text["tabletop.reset.button"],
  });

  const onChangeIsNeat = React.useCallback(
    (value: boolean) => {
      dispatch(
        setTabletopSetting({
          tabletopId,
          key: "preferNeatStacks",
          value: value,
          date: dateToDateString(new Date()),
        }),
      );
    },
    [dispatch, tabletopId],
  );

  const onChangeHideCardCount = React.useCallback(
    (value: boolean) => {
      dispatch(
        setTabletopSetting({
          tabletopId,
          key: "hideCardCount",
          value: value,
          date: dateToDateString(new Date()),
        }),
      );
    },
    [dispatch, tabletopId],
  );

  const onChangeDefaultFaceUp = React.useCallback(
    (value: boolean) => {
      dispatch(
        setTabletopSetting({
          tabletopId,
          key: "defaultCardSide",
          value: value ? "front" : "back",
          date: dateToDateString(new Date()),
        }),
      );
    },
    [dispatch, tabletopId],
  );

  const onChangeNewCardsOnTop = React.useCallback(
    (value: boolean) => {
      dispatch(
        setTabletopSetting({
          tabletopId,
          key: "newCardsGoToTopOfStack",
          value: value,
          date: dateToDateString(new Date()),
        }),
      );
    },
    [dispatch, tabletopId],
  );

  const onChangeDoNotAddNewCardsAutomatically = React.useCallback(
    (value: boolean) => {
      dispatch(
        setTabletopSetting({
          tabletopId,
          key: "doNotAddNewCardsAutomatically",
          value: value,
          date: dateToDateString(new Date()),
        }),
      );

      // We're indicating that we want to auto add new cards, so do a check now
      if (value === false) {
        dispatch(addMissingTabletopCardsHelper({ tabletopId }));
      }
    },
    [dispatch, tabletopId],
  );

  const iconSize = useLeftAdornmentSize({ titleProps });

  return (
    <>
      {resetTabletopModal.component}
      <FieldSet
        title={text["settings.tabletop.title"]}
        titleProps={titleProps}
        subTitle={`(${deckName})`}
        initialCollapsed
        collapsible
        leftAdornment={<IconSymbol name="play-arrow" size={iconSize} />}
        {...props}
      >
        <StackActions tabletopId={tabletopId} collapsible initialCollapsed />
        <FieldSet
          title={text["settings.tabletop.all_title"]}
          collapsible
          initialCollapsed
        >
          <Button
            title={text["general.undo"]}
            onPress={undo}
            variant="outline"
            style={{ opacity: undo ? 1 : 0.5 }}
            vibrate
          />
          <Button
            title={text["general.redo"]}
            onPress={redo}
            variant="outline"
            style={{ opacity: redo ? 1 : 0.5 }}
            vibrate
          />
          <Button
            title={text["tabletop.reset.title"]}
            onPress={resetTabletopModal.open}
            variant="outline"
          />
          {!hideNeatStackOption && (
            <SwitchField
              label={text["settings.neat_stack"]}
              value={!!settings.preferNeatStacks}
              onValueChange={onChangeIsNeat}
              FieldProps={{
                subLabel: text["settings.neat_stack.helper"],
              }}
            />
          )}
          <SwitchField
            label={text["settings.tabletop.card_count"]}
            value={!!settings.hideCardCount}
            onValueChange={onChangeHideCardCount}
            FieldProps={{
              subLabel: text["settings.tabletop.card_count.helper"],
            }}
          />
          {/* Some settings don't make sense if it's a prebuilt deck, specifically things that 
          affect how the tabletop resets */}
          {canEdit && (
            <>
              <SwitchField
                label={text["settings.default_face_up_cards"]}
                value={settings.defaultCardSide !== "back"}
                onValueChange={onChangeDefaultFaceUp}
                FieldProps={{
                  subLabel: text["settings.default_face_up_cards.helper"],
                }}
              />
              <SwitchField
                label={text["settings.new_cards_join_top"]}
                value={settings.newCardsGoToTopOfStack === true}
                onValueChange={onChangeNewCardsOnTop}
                FieldProps={{
                  subLabel: text["settings.new_cards_join_top.helper"],
                }}
              />
            </>
          )}
          <SwitchField
            label={text["settings.do_not_add_new_cards"]}
            value={!!settings.doNotAddNewCardsAutomatically}
            onValueChange={onChangeDoNotAddNewCardsAutomatically}
            FieldProps={{
              subLabel: text["settings.do_not_add_new_cards.helper"],
            }}
          />
        </FieldSet>
      </FieldSet>
    </>
  );
}
