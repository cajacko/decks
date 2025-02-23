import React from "react";
import { View, Text, TextInput } from "react-native";
// import useCardData from "@/hooks/useCardData";

export interface EditCardFormProps {
  cardId: string;
}

export default function EditCardForm(
  props: EditCardFormProps,
): React.ReactNode {
  // const card = useCardData(props);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20 }}>Title</Text>
      <TextInput value="Title" style={{ fontSize: 16 }} />
    </View>
  );
}
