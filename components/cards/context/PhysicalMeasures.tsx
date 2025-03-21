import AppError from "@/classes/AppError";
import React from "react";
import {
  useCardSizeConstraints,
  CardSizeConstraints,
} from "./CardSizeConstraints";
import {
  useCardsPhysicalSize,
  UseCardsPhysicalSizeProps,
  CardPhysicalSize,
} from "./CardPhysicalSize";

export interface Scale {
  mmDistance: number;
  dpDistance: number;
}

export type MmToDp = (
  mm: number,
  options?: {
    min?: number;
    max?: number;
    roundToNumberOfDecimals?: number;
  },
) => number;

type WithMmToDp = (scale: Scale) => (
  mm: number,
  options?: {
    min?: number;
    max?: number;
    roundToNumberOfDecimals?: number;
  },
) => number;

export const withMmToDp: WithMmToDp =
  (scale) =>
  (mm, options = {}) => {
    const { max, min, roundToNumberOfDecimals = 1 } = options;

    let value = (mm / scale.mmDistance) * scale.dpDistance;

    if (roundToNumberOfDecimals) {
      value =
        Math.round(value * 10 ** roundToNumberOfDecimals) /
        10 ** roundToNumberOfDecimals;
    }

    if (min) {
      value = Math.max(value, min);
    }

    if (max) {
      value = Math.min(value, max);
    }

    return value;
  };

type ContextState = Scale;

interface UseScaleFromConstraintsProps
  extends Omit<UseCardsPhysicalSizeProps, "debugLocation"> {
  constraints?: CardSizeConstraints;
}

export interface UseMmToDpProps extends UseScaleFromConstraintsProps {
  scale?: Scale;
}

const Context = React.createContext<ContextState | null>(null);

const defaultScale: Scale = {
  dpDistance: 3,
  mmDistance: 1,
};

export function getCardScaleFromConstraints(props: {
  constraints: CardSizeConstraints;
  physicalSize: CardPhysicalSize;
}): Scale | null {
  const physicalSize = props.physicalSize;

  const { constraints } = props;
  const { height, maxHeight, maxWidth, width } = constraints;

  if (width) {
    return { dpDistance: width, mmDistance: physicalSize.mmWidth };
  }

  if (height) {
    return { dpDistance: height, mmDistance: physicalSize.mmHeight };
  }

  // Maintain aspect ratio from mmHeight and mmWidth. So
  if (maxHeight && maxWidth) {
    const scaleFromHeight = {
      dpDistance: maxHeight,
      mmDistance: physicalSize.mmHeight,
    };
    const dpWidth = withMmToDp(scaleFromHeight)(physicalSize.mmWidth);

    if (dpWidth <= maxWidth) {
      return scaleFromHeight;
    }

    return { dpDistance: maxWidth, mmDistance: physicalSize.mmWidth };
  }

  if (maxHeight) {
    return { dpDistance: maxHeight, mmDistance: physicalSize.mmHeight };
  }

  if (maxWidth) {
    return { dpDistance: maxWidth, mmDistance: physicalSize.mmWidth };
  }

  return null;
}

function useScaleFromConstraints({
  constraints: constraintsProp,
  ...props
}: UseScaleFromConstraintsProps): Scale | null {
  const constraints = useCardSizeConstraints(constraintsProp);
  const physicalSize = useCardsPhysicalSize({
    debugLocation: useScaleFromConstraints.name,
    ...props,
  });

  return React.useMemo(() => {
    const scale = getCardScaleFromConstraints({ constraints, physicalSize });

    return scale;
  }, [constraints, physicalSize]);
}

export function useMmToDp({ scale, ...props }: UseMmToDpProps = {}): MmToDp {
  const context = React.useContext(Context);
  const constraintsScale = useScaleFromConstraints(props);

  return React.useMemo<MmToDp>((): MmToDp => {
    // Most specific, we passed something to use
    if (scale) {
      return withMmToDp(scale);
    }

    // Setting the context is more specific that figuring it out from constraints
    if (context) {
      return withMmToDp(context);
    }

    if (constraintsScale) {
      return withMmToDp(constraintsScale);
    }

    new AppError(
      `${useMmToDp.name} could not find a scale from props of context, using default`,
      {
        scale,
        context,
        constraintsScale,
      },
    ).log("warn");

    return withMmToDp(defaultScale);
  }, [scale, context, constraintsScale]);
}

export interface PhysicalMeasuresProviderProps extends Scale {
  children: React.ReactNode;
}

export function PhysicalMeasuresProvider({
  children,
  dpDistance,
  mmDistance,
}: PhysicalMeasuresProviderProps) {
  const value = React.useMemo<ContextState>(
    () => ({ dpDistance, mmDistance }),
    [dpDistance, mmDistance],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
