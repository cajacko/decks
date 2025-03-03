import React from "react";
import { StyleSheet, View } from "react-native";
import TextInput from "./TextInput";
import { selectDeck, setDeckDetails } from "@/store/slices/decks";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import useAutoSave from "@/hooks/useAutoSave";
import text from "@/constants/text";

export interface DeckDetailsProps {
  deckId: string;
}

export default function DeckDetails(props: DeckDetailsProps): React.ReactNode {
  const dispatch = useAppDispatch();
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
    autoSave: true,
  });

  return (
    <View style={styles.container}>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder={text["deck.edit.title.placeholder"]}
        style={styles.name}
      />
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder={text["deck.edit.description.placeholder"]}
        style={styles.description}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 10,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
  },
  description: {
    fontSize: 20,
  },
});
