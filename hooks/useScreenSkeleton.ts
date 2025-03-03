import React from "react";
import { InteractionManager } from "react-native";
import { useNavigation } from "@react-navigation/native";

// let interaction;

export default function useScreenSkeleton(key: string) {
  const navigation = useNavigation();
  const [skeleton, setSkeleton] = React.useState(true);

  React.useEffect(() => {
    function waitToSetSkeleton(newValue: boolean) {
      InteractionManager.runAfterInteractions(() => {
        if (navigation.isFocused() === newValue) return;

        setSkeleton(newValue);
      });
    }

    const unsubscribeFocus = navigation.addListener("focus", () => {
      waitToSetSkeleton(false);
    });

    const unsubscribeBlur = navigation.addListener("blur", () => {
      waitToSetSkeleton(true);
    });

    waitToSetSkeleton(false);

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation, key]);

  return skeleton;
}
