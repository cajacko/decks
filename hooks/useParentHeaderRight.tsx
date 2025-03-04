import React from "react";
import { useNavigation } from "expo-router";
import { useIsFocused } from "@react-navigation/native";

export default function useParentHeaderRight(
  headerRight: null | (() => React.ReactNode),
  key: string,
) {
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  React.useEffect(() => {
    function setHeaderRight(component: null | (() => React.ReactNode)) {
      // NOTE: headerRight on re-renders when this effect changes, so we can't dynamically get redux
      // state inside the header component
      navigation.getParent()?.setOptions({
        headerRight: component,
      });
    }

    if (navigation.isFocused()) {
      setHeaderRight(headerRight);
    }

    const blur = navigation.addListener("blur", (state) => {
      setHeaderRight(null);
    });

    const focus = navigation.addListener("focus", (state) => {
      setHeaderRight(headerRight);
    });

    return () => {
      blur();
      focus();
    };
  }, [navigation, headerRight, isFocused]);
}
