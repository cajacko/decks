import React from "react";
import { View, Button, StyleSheet } from "react-native";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectCardTemplate } from "@/store/combinedSelectors/cards";
import { useSaveEditCard } from "@/context/EditCard";
import { Target } from "@/utils/cardTarget";
import EditCardSideForm from "@/components/EditCardSideForm";
import { deleteCardHelper } from "@/store/actionHelpers/cards";
import useDeleteWarning from "@/hooks/useDeleteWarning";
import text from "@/config/text";

export type EditCardFormProps = Target & {
  flipSide: () => void;
  onDelete?: () => void;
};

export default function EditCardForm({
  flipSide,
  id,
  type,
  onDelete,
}: EditCardFormProps): React.ReactNode {
  const dispatch = useAppDispatch();

  const backTemplate = useAppSelector((state) =>
    selectCardTemplate(state, { id, type, side: "back" }),
  );

  const frontTemplate = useAppSelector((state) =>
    selectCardTemplate(state, { id, type, side: "front" }),
  );

  useSaveEditCard(true);

  const cardId = type === "card" ? id : null;

  const deleteCard = React.useCallback(() => {
    onDelete?.();

    if (cardId) {
      dispatch(deleteCardHelper({ cardId }));
    }
  }, [cardId, dispatch, onDelete]);

  const { open, component } = useDeleteWarning({
    handleDelete: deleteCard,
    title: text["card.delete.title"],
    message: text["card.delete.message"],
  });

  return (
    <View style={styles.container}>
      {component}
      <View style={styles.buttonContainer}>
        <View style={styles.buttonLeft}>
          <Button title={text["card.action.flip"]} onPress={flipSide} />
        </View>
        <View style={styles.buttonRight}>
          <Button title={text["general.delete"]} onPress={open} />
        </View>
      </View>
      {frontTemplate && (
        <EditCardSideForm
          id={id}
          type={type}
          side="front"
          templateId={frontTemplate.templateId}
          title={!!backTemplate ? text["card.templates.front.title"] : null}
        />
      )}
      {backTemplate && (
        <EditCardSideForm
          id={id}
          type={type}
          side="back"
          templateId={backTemplate.templateId}
          title={!!frontTemplate ? text["card.templates.back.title"] : null}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  buttonContainer: {
    marginBottom: 20,
    flexDirection: "row",
  },
  buttonLeft: {
    flex: 1,
    marginRight: 10,
  },
  buttonRight: {
    flex: 1,
    marginLeft: 10,
  },
});
