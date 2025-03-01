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
    // Multiple routes can load when animating/ performance optimisations, so we need to check here
    if (!isFocused) return;

    // NOTE: headerRight on re-renders when this effect changes, so we can't dynamically get redux
    // state inside the header component
    navigation.getParent()?.setOptions({
      headerRight: headerRight ? headerRight : undefined,
    });

    // Do not unset on cleanup, there can be a race condition here, so just let the new route
    // override this. This means all routes need to call this
  }, [navigation, headerRight, isFocused]);
}
