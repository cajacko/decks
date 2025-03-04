import React from "react";
import { InteractionManager } from "react-native";
import { useNavigation } from "@react-navigation/native";
import useFlag from "./useFlag";

export default function useScreenSkeleton(key: string) {
  const navigation = useNavigation();
  const featureDisabled = useFlag("SKELETON_LOADER") === "disabled";
  const [skeleton, setSkeleton] = React.useState(true);

  React.useEffect(() => {
    if (featureDisabled) return;

    function waitToSetSkeleton(showSkeleton: boolean) {
      InteractionManager.runAfterInteractions(() => {
        setSkeleton(showSkeleton);
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
  }, [navigation, key, featureDisabled]);

  return featureDisabled ? false : skeleton;
}
