import AppError from "@/classes/AppError";
import React from "react";
import { LayoutChangeEvent, StyleProp, ViewStyle, View } from "react-native";
import { createContext, useContextSelector } from "use-context-selector";

type Size = {
  width: number;
  height: number;
};

const Context = createContext<Size | null>(null);

export function useContainerSize(): Partial<Size> {
  const width = useContextSelector<Size | null, number | undefined>(
    Context,
    (context) => context?.width,
  );

  const height = useContextSelector<Size | null, number | undefined>(
    Context,
    (context) => context?.height,
  );

  return { width, height };
}

export function useRequiredContainerSize(): Size {
  const { height, width } = useContainerSize();

  if (height === undefined || width === undefined) {
    throw new AppError(
      `Container size is not defined. Make sure to wrap your component with ContainerSizeProvider.`,
    );
  }

  return { height, width };
}

export function ContainerSizeProvider({
  children,
  style,
  hideUntilLoaded = false,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  hideUntilLoaded?: boolean;
}): React.ReactElement {
  const [size, setSize] = React.useState<Size>({ width: 0, height: 0 });

  const onLayout = React.useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;

    setSize({ width, height });
  }, []);

  return (
    <Context.Provider value={size}>
      <View style={style} onLayout={onLayout}>
        {hideUntilLoaded && !size ? null : children}
      </View>
    </Context.Provider>
  );
}
