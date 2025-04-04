import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";

interface ContextState {
  height: number;
  width: number;
  initializing: boolean;
}

const getDefaultContext = (): ContextState => ({
  height: Dimensions.get("window").height,
  width: Dimensions.get("window").width,
  initializing: true,
});

const Context = React.createContext<ContextState>(getDefaultContext());

export function useScreenContentLayout() {
  return React.useContext(Context);
}

export function ScreenContentLayoutProvider(props: {
  children: React.ReactNode;
}) {
  const [dimensions, setDimensions] = React.useState(getDefaultContext);

  const onLayout = React.useCallback(
    (event: { nativeEvent: { layout: { width: number; height: number } } }) => {
      const { width, height } = event.nativeEvent.layout;

      setDimensions({ width, height, initializing: false });
    },
    [],
  );

  return (
    <Context.Provider value={dimensions}>
      <View style={styles.container} onLayout={onLayout}>
        {props.children}
      </View>
    </Context.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
});
