import React from "react";
import { StyleSheet, View } from "react-native";
import TextInput from "./TextInput";
import { selectDeck, setDeckDetails } from "@/store/slices/decks";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import useAutoSave from "@/hooks/useAutoSave";
import text from "@/constants/text";
import { selectCanEditDeck } from "@/store/slices/decks";
import ThemedText from "./ThemedText";

export interface DeckDetailsProps {
  deckId: string;
  skeleton?: boolean;
}

const titleType = "h1";
const descriptionType = "body1";

export default function DeckDetails(props: DeckDetailsProps): React.ReactNode {
  const dispatch = useAppDispatch();
  const canEditDeck = useAppSelector((state) =>
    selectCanEditDeck(state, { deckId: props.deckId }),
  );
  const deck = useAppSelector((state) =>
    selectDeck(state, { deckId: props.deckId }),
  );

  const [title, setTitle] = React.useState(deck?.name ?? "");
  const [description, setDescription] = React.useState(deck?.description ?? "");

  const hasChanges = deck?.name !== title || deck?.description !== description;

  const save = React.useCallback(() => {
    dispatch(
      setDeckDetails({ deckId: props.deckId, name: title, description }),
    );
  }, [title, description, dispatch, props.deckId]);

  useAutoSave({
    hasChanges,
    save,
    autoSave: props.skeleton || !canEditDeck ? false : true,
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
    padding: 10,
    marginBottom: 10,
  },
  name: {
    marginBottom: 20,
    marginTop: 20,
  },
  description: {},
});
