import React from "react";
import { StyleSheet, View } from "react-native";
import TextInput from "../forms/TextInput";
import { selectDeck, selectCanEditDeck } from "@/store/selectors/decks";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import useAutoSave from "@/hooks/useAutoSave";
import text from "@/constants/text";
import { setDeckDetails } from "@/store/slices/decks";
import ThemedText from "../ui/ThemedText";
import { dateToDateString } from "@/utils/dates";
import ContentWidth from "../ui/ContentWidth";
import FieldSet from "../forms/FieldSet";
import Field from "../forms/Field";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import IconButton from "../forms/IconButton";
import { iconSize } from "../editCard/EditCardForm";
import useFlag from "@/hooks/useFlag";
import useDeleteWarning from "@/hooks/useDeleteWarning";
import { deleteDeckHelper } from "@/store/actionHelpers/decks";
import { useRouter } from "expo-router";
import { appHome } from "@/constants/links";

export interface DeckDetailsProps {
  deckId: string;
  onDelete?: () => void;
}

const titleType = "h1";
const descriptionType = "body1";

export default function EditDeckDetails({
  deckId,
  onDelete,
}: DeckDetailsProps): React.ReactNode {
  const { navigate } = useRouter();
  const dispatch = useAppDispatch();
  const canEditDeck = useAppSelector((state) =>
    selectCanEditDeck(state, { deckId }),
  );
  const deck = useAppSelector((state) => selectDeck(state, { deckId }));
  const saveAnimation = useSharedValue(1);
  const performanceMode = useFlag("PERFORMANCE_MODE") === "enabled";

  const titleRef = React.useRef(deck?.name);
  const descriptionRef = React.useRef(deck?.description);

  titleRef.current = deck?.name;
  descriptionRef.current = deck?.description;

  const [title, setTitle] = React.useState(deck?.name ?? "");
  const [description, setDescription] = React.useState(deck?.description ?? "");

  // Reset on deck id change
  React.useEffect(() => {
    setTitle(titleRef.current ?? "");
    setDescription(descriptionRef.current ?? "");
  }, [deckId]);

  const hasChanges = deck?.name !== title || deck?.description !== description;

  const animateOnSave = React.useCallback(() => {
    if (performanceMode) return;

    const duration = 500;

    saveAnimation.value = withSequence(
      withTiming(0.5, { duration }),
      withTiming(1, { duration }),
    );
  }, [saveAnimation, performanceMode]);

  const save = React.useCallback(() => {
    animateOnSave();

    dispatch(
      setDeckDetails({
        deckId,
        name: title,
        description,
        date: dateToDateString(new Date()),
      }),
    );
  }, [title, description, dispatch, deckId, animateOnSave]);

  useAutoSave({
    hasChanges,
    save,
    autoSave: !canEditDeck ? false : true,
  });

  const animationStyle = useAnimatedStyle(() => {
    return {
      opacity: saveAnimation.value,
    };
  });

  const saveStyle = React.useMemo(
    () => [styles.iconButton, animationStyle],
    [animationStyle],
  );

  const deleteCard = React.useCallback(() => {
    onDelete?.();
    navigate(appHome);
    dispatch(deleteDeckHelper({ deckId }));
  }, [deckId, dispatch, onDelete, navigate]);

  const { open, component } = useDeleteWarning({
    handleDelete: deleteCard,
    title: text["deck.delete.title"],
    message: text["deck.delete.message"],
  });

  return (
    <ContentWidth style={styles.container} padding="standard">
      {component}
      {canEditDeck ? (
        <>
          <View style={styles.buttonContainer}>
            <IconButton
              icon="delete"
              size={iconSize}
              style={styles.iconButton}
              onPress={open}
              variant="transparent"
              vibrate
            />
            <Animated.View style={saveStyle}>
              <IconButton
                icon="save"
                size={iconSize}
                onPress={save}
                variant="transparent"
                vibrate
              />
            </Animated.View>
          </View>

          <FieldSet>
            <Field label={text["deck.edit.title.label"]}>
              <TextInput value={title} onChangeText={setTitle} />
            </Field>
            <Field
              label={text["deck.edit.instructions.label"]}
              subLabel={text["deck.edit.instructions.helper"]}
            >
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder={text["deck.edit.description.placeholder"]}
                multiline
              />
            </Field>
          </FieldSet>
        </>
      ) : (
        <>
          <ThemedText type={titleType}>{title}</ThemedText>
          <ThemedText type={descriptionType}>{description}</ThemedText>
        </>
      )}
    </ContentWidth>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 60,
  },
  buttonContainer: {
    marginBottom: 20,
    flexDirection: "row",
  },
  iconButton: {
    flex: 1,
    alignItems: "center",
  },
});
