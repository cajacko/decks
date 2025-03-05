import React from "react";
import { useNavigation } from "expo-router";
import { useIsFocused } from "@react-navigation/native";

export function useHeaderRight({
  headerRight,
  useParent,
}: {
  headerRight: null | (() => React.ReactNode);
  useParent?: boolean;
}) {
  const isFocused = useIsFocused();
  let navigation = useNavigation();

  const headerNavigation = React.useMemo(
    () => (useParent ? navigation.getParent() : navigation),
    [navigation, useParent],
  );

  React.useEffect(() => {
    function setHeaderRight(component: null | (() => React.ReactNode)) {
      // NOTE: headerRight on re-renders when this effect changes, so we can't dynamically get redux
      // state inside the header component
      headerNavigation?.setOptions({
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
  }, [navigation, headerRight, isFocused, headerNavigation]);
}

export default function useParentHeaderRight(
  headerRight: null | (() => React.ReactNode),
) {
  return useHeaderRight({
    headerRight,
    useParent: true,
  });
}
