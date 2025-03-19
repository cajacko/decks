import React from "react";
import { View, StyleSheet } from "react-native";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { selectCardTemplate } from "@/store/combinedSelectors/cards";
import { useSaveEditCard } from "@/context/EditCard";
import { Target } from "@/utils/cardTarget";
import EditCardSideForm from "@/components/EditCardSideForm";
import { deleteCardHelper } from "@/store/actionHelpers/cards";
import useDeleteWarning from "@/hooks/useDeleteWarning";
import text from "@/constants/text";
import IconButton from "./IconButton";
import { Cards } from "@/store/types";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import useFlag from "@/hooks/useFlag";
import ContentWidth from "./ContentWidth";

export type EditCardFormProps = Target & {
  flipSide: () => void;
  onDelete?: () => void;
  handleClose?: () => void;
  activeSide: Cards.Side;
};

const iconSize = 30;

export default function EditCardForm({
  flipSide,
  id,
  type,
  onDelete,
  handleClose,
  activeSide,
}: EditCardFormProps): React.ReactNode {
  const dispatch = useAppDispatch();
  const saveAnimation = useSharedValue(1);
  const performanceMode = useFlag("PERFORMANCE_MODE") === "enabled";

  const backTemplate = useAppSelector((state) =>
    selectCardTemplate(state, { id, type, side: "back" }),
  );

  const frontTemplate = useAppSelector((state) =>
    selectCardTemplate(state, { id, type, side: "front" }),
  );

  const animateOnSave = React.useCallback(() => {
    if (performanceMode) return;

    const duration = 500;

    saveAnimation.value = withSequence(
      withTiming(0.5, { duration }),
      withTiming(1, { duration }),
    );
  }, [saveAnimation, performanceMode]);

  const { save } = useSaveEditCard({
    autoSave: true,
    onAutoSave: animateOnSave,
  });

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

  const animationStyle = useAnimatedStyle(() => {
    return {
      opacity: saveAnimation.value,
    };
  });

  const onSave = React.useCallback(() => {
    animateOnSave();

    save();
    handleClose?.();
  }, [save, handleClose, animateOnSave]);

  const saveStyle = React.useMemo(
    () => [styles.iconButton, animationStyle],
    [animationStyle],
  );

  return (
    <ContentWidth padding="standard" contentContainerStyle={styles.container}>
      {component}
      <View style={styles.buttonContainer}>
        <IconButton
          icon="flip"
          size={iconSize}
          style={styles.iconButton}
          onPress={flipSide}
          variant="transparent"
        />
        <IconButton
          icon="delete"
          size={iconSize}
          style={styles.iconButton}
          onPress={open}
          variant="transparent"
        />
        <Animated.View style={saveStyle}>
          <IconButton
            icon="save"
            size={iconSize}
            onPress={onSave}
            variant="transparent"
          />
        </Animated.View>
      </View>
      {frontTemplate && activeSide === "front" && (
        <EditCardSideForm
          id={id}
          type={type}
          side="front"
          templateId={frontTemplate.templateId}
          title={!!backTemplate ? text["card.templates.front.title"] : null}
        />
      )}
      {backTemplate && activeSide === "back" && (
        <EditCardSideForm
          id={id}
          type={type}
          side="back"
          templateId={backTemplate.templateId}
          title={!!frontTemplate ? text["card.templates.back.title"] : null}
        />
      )}
    </ContentWidth>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
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
