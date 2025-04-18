import AppError from "@/classes/AppError";
import React from "react";
import { LayoutChangeEvent, StyleProp, ViewStyle, View } from "react-native";
import { createContext, useContextSelector } from "use-context-selector";

type Size = {
  width: number;
  height: number;
};

const Context = createContext<Size | null>(null);

export function useContainerWidth(): number | undefined {
  return useContextSelector<Size | null, number | undefined>(
    Context,
    (context) => context?.width,
  );
}

export function useRequiredContainerWidth(): number {
  const width = useContainerWidth();

  if (width === undefined) {
    throw new AppError(
      `Container width is not defined. Make sure to wrap your component with ContainerSizeProvider.`,
    );
  }

  return width;
}

export function useContainerHeight(): number | undefined {
  return useContextSelector<Size | null, number | undefined>(
    Context,
    (context) => context?.height,
  );
}

export function useRequiredContainerHeight(): number {
  const height = useContainerHeight();

  if (height === undefined) {
    throw new AppError(
      `Container height is not defined. Make sure to wrap your component with ContainerSizeProvider.`,
    );
  }

  return height;
}

export function useContainerSize(): Partial<Size> {
  const width = useContainerWidth();
  const height = useContainerHeight();

  return { width, height };
}

export function useRequiredContainerSize(): Size {
  const width = useRequiredContainerWidth();
  const height = useRequiredContainerHeight();

  return { width, height };
}

export function ContainerSizeProvider({
  children,
  style,
  hideUntilLoaded = false,
  onLoad: _onLoad,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  hideUntilLoaded?: boolean;
  onLoad?: (size: Size) => void;
}): React.ReactElement {
  const [size, setSize] = React.useState<Size>({ width: 0, height: 0 });
  const hasCalledOnLoad = React.useRef(false);
  // Ensure's it's only called the once on first load. Passing new instances of onLoad won't
  // retrigger the effect.
  const onLoad = React.useRef(_onLoad);
  onLoad.current = _onLoad;

  const onLayout = React.useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;

    setSize({ width, height });
  }, []);

  React.useEffect(() => {
    if (!size) return;
    if (hasCalledOnLoad.current) return;

    hasCalledOnLoad.current = true;

    onLoad.current?.(size);
  }, [size]);

  return (
    <Context.Provider value={size}>
      <View style={style} onLayout={onLayout}>
        {hideUntilLoaded && !size ? null : children}
      </View>
    </Context.Provider>
  );
}
