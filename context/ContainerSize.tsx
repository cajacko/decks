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

interface ContainerSizeProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  hideUntilLoaded?: boolean;
  onLoad?: () => void;
}

function HideUntilLoad({
  children,
  hideUntilLoaded = false,
  onLoad,
}: Pick<ContainerSizeProps, "children" | "onLoad" | "hideUntilLoaded">) {
  const hasSize = useContextSelector(Context, (context) => !!context);
  const hasCalledOnLoad = React.useRef(false);
  // // Ensure's it's only called the once on first load. Passing new instances of onLoad won't
  // // retrigger the effect.

  React.useEffect(() => {
    if (!hasSize) return;
    if (hasCalledOnLoad.current) return;

    hasCalledOnLoad.current = true;

    onLoad?.();
  }, [hasSize, onLoad]);

  if (hideUntilLoaded && !hasSize) return null;

  return children;
}

export function ContainerSizeProvider({
  children,
  style,
  ...props
}: ContainerSizeProps): React.ReactElement {
  const [size, setSize] = React.useState<Size | null>(null);

  const onLayout = React.useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;

    if (width === 0 || height === 0) return;

    setSize({ width, height });
  }, []);

  return (
    <Context.Provider value={size}>
      <View style={style} onLayout={onLayout}>
        <HideUntilLoad {...props}>{children}</HideUntilLoad>
      </View>
    </Context.Provider>
  );
}
