import React from "react";
import CardContainer, { CardContainerProps } from "./CardContainer";
import { StyleSheet } from "react-native";

// type CardSpacerProps = CardSize &
//   Pick<CardContainerProps, "backgroundColor" | "style" | "borderRadius">;

type InjectedProps = Pick<
  CardContainerProps,
  "backgroundColor" | "style" | "borderRadius"
> & {
  shadow?: unknown;
};

type CardSpacerProps<P extends InjectedProps> = P & Partial<InjectedProps>;

export function withCardSpacer<P extends InjectedProps>(
  Component: React.ComponentType<P>,
) {
  return function CardSpacer(props: CardSpacerProps<P>): React.ReactNode {
    const style: P["style"] = React.useMemo<P["style"]>(
      () => StyleSheet.flatten([styles.container, props.style]),
      [props.style],
    );

    return (
      <Component
        {...props}
        style={style}
        backgroundColor={null}
        shadow={undefined}
        borderRadius={0}
      />
    );
  };
}

const styles = StyleSheet.create({
  container: {
    opacity: 0,
    zIndex: -1,
    position: "relative",
  },
});

export default withCardSpacer<CardContainerProps>(CardContainer);
