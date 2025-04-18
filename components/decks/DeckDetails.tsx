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
import Skeleton from "../ui/Skeleton";

export interface DeckDetailsProps {
  deckId: string;
}

const titleType = "h1";
const descriptionType = "body1";

export function DeckDetailsSkeleton() {
  return (
    <View style={styles.container}>
      <Skeleton style={styles.name} variant="text" width="50%" />
      <View style={styles.description}>
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="90%" textSpacingVertical />
        <Skeleton variant="text" width="40%" />
      </View>
    </View>
  );
}

export default function DeckDetails(props: DeckDetailsProps): React.ReactNode {
  const dispatch = useAppDispatch();
  const canEditDeck = useAppSelector((state) =>
    selectCanEditDeck(state, { deckId: props.deckId }),
  );
  const deck = useAppSelector((state) =>
    selectDeck(state, { deckId: props.deckId }),
  );

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
  }, [props.deckId]);

  const hasChanges = deck?.name !== title || deck?.description !== description;

  const save = React.useCallback(() => {
    dispatch(
      setDeckDetails({
        deckId: props.deckId,
        name: title,
        description,
        date: dateToDateString(new Date()),
      }),
    );
  }, [title, description, dispatch, props.deckId]);

  useAutoSave({
    hasChanges,
    save,
    autoSave: !canEditDeck ? false : true,
  });

  return (
    <View style={styles.container}>
      {canEditDeck ? (
        <>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder={text["deck.edit.title.placeholder"]}
            style={styles.name}
            textVariant={titleType}
            variant="display"
            multiline
          />
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder={text["deck.edit.description.placeholder"]}
            style={styles.description}
            textVariant={descriptionType}
            variant="display"
            multiline
          />
        </>
      ) : (
        <>
          <ThemedText type={titleType} style={styles.name}>
            {title}
          </ThemedText>
          <ThemedText type={descriptionType} style={styles.description}>
            {description}
          </ThemedText>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  name: {
    marginBottom: 20,
    marginTop: 20,
  },
  description: {},
});
