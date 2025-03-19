import { withSpring } from "react-native-reanimated";
import { defaultProps, BottomDrawerProps } from "./BottomDrawer.types";
import { dragBuffer, dragHeight, dragOverlap } from "./bottomDrawer.style";
import React from "react";
import { ScrollViewProps, Keyboard, Platform } from "react-native";
import debugLog from "./debugLog";
import AppError from "@/classes/AppError";
import { autoAnimateConfig } from "./bottomDrawer.style";

function useIosKeyboardHeight() {
  const [iosKeyboardHeight, setIosKeyboardHeight] = React.useState(0);

  React.useEffect(() => {
    if (Platform.OS !== "ios") {
      return;
    }

    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        setIosKeyboardHeight(event.endCoordinates.height);
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIosKeyboardHeight(0);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return iosKeyboardHeight;
}

/**
 * Handles the height constraints for the drawer
 */
export default function useHeightConstraints(
  props: Pick<BottomDrawerProps, "maxHeight" | "minHeight" | "height">,
) {
  const { maxHeight: maxHeightProp, minHeight: minHeightProp, height } = props;
  // Null means we're waiting on it
  const [drawerContentHeight, setDrawerContentHeight] = React.useState<
    number | null
  >(null);

  /**
   * If the max customMaxHeight is null, it means we're pending setting the max height (normally
   * waiting for an onLayoutChange event in the parent)
   */
  const customMaxHeight: number | null =
    maxHeightProp === undefined ? defaultProps.maxHeight : maxHeightProp;

  const iosKeyboardHeight = useIosKeyboardHeight();

  const { minHeight, maxHeight, maxAutoHeight, hasGotMaxHeight } =
    React.useMemo(() => {
      const minHeight: number =
        (minHeightProp ?? defaultProps.minHeight) + iosKeyboardHeight;
      let maxHeight: number;
      let maxAvailableSpace: number | null;
      let maxHeightForContent: number | null;
      let maxAutoHeight: number;
      let hasGotMaxHeight: boolean;

      if (customMaxHeight === null) {
        maxAvailableSpace = null;
      } else {
        maxAvailableSpace = customMaxHeight - dragOverlap - dragBuffer;
      }

      if (drawerContentHeight === null) {
        maxHeightForContent = null;

        if (maxAvailableSpace === null) {
          // We have nothing to go off, so just use the default
          maxHeight = defaultProps.maxHeight;
          hasGotMaxHeight = false;
        } else {
          // We have a max height, but no content height, so just use the max height
          maxHeight = maxAvailableSpace;
          hasGotMaxHeight = false;
        }
      } else {
        maxHeightForContent = drawerContentHeight + dragHeight;

        if (maxAvailableSpace === null) {
          // We have content, but no max height, so just use the content height
          maxHeight = maxHeightForContent;
          hasGotMaxHeight = false;
        } else {
          // We have both, so use the smallest of the two
          maxHeight = Math.min(maxAvailableSpace, maxHeightForContent);
          hasGotMaxHeight = true;
        }
      }

      if (maxHeight < minHeight) {
        new AppError(
          `BottomDrawer ${useHeightConstraints.name} maxHeight is smaller than minHeight, how did this happen?`,
          {
            maxAvailableSpace,
            maxHeightForContent,
            maxHeight,
            minHeight,
          },
        ).log("error");

        maxHeight = minHeight;
      }

      if (maxAvailableSpace !== null) {
        maxAutoHeight = maxAvailableSpace / 2;
      } else if (maxHeightForContent !== null) {
        maxAutoHeight = maxHeightForContent;
      } else {
        maxAutoHeight = maxHeight;
      }

      // Just double check it's not out of bounds
      if (maxAutoHeight > maxHeight) {
        maxAutoHeight = maxHeight;
      }

      if (maxAutoHeight < minHeight) {
        maxAutoHeight = maxHeight;
      }

      debugLog(`calculate height constraints:
maxHeight: ${Math.round(maxHeight)}
minHeight: ${Math.round(minHeight)}
maxAutoHeight: ${Math.round(maxAutoHeight)}`);

      return {
        maxHeight,
        minHeight,
        maxAutoHeight,
        hasGotMaxHeight,
      };
    }, [
      customMaxHeight,
      drawerContentHeight,
      minHeightProp,
      iosKeyboardHeight,
    ]);

  // Gets the drawer content size, as we don't need to show a bottom drawer higher than this
  const onContentLayout = React.useCallback<
    Required<ScrollViewProps>["onLayout"]
  >((event) => {
    debugLog(
      `set state.drawerContentHeight: ${Math.round(event.nativeEvent.layout.height)} (onContentLayout)`,
    );

    setDrawerContentHeight(event.nativeEvent.layout.height);
  }, []);

  // Sync our shared values with the props
  React.useEffect(() => {
    const changeHeight = (newHeight: number, reason: string) => {
      debugLog(`set height.value: ${Math.round(newHeight)} (${reason})`);

      height.value = withSpring(newHeight, autoAnimateConfig);
    };

    debugLog(
      `constraints changed, checking height: ${Math.round(height.value)} (useEffect)`,
    );

    if (height.value > maxHeight) {
      changeHeight(maxHeight, "height.value > maxHeight");
    } else if (height.value < minHeight) {
      changeHeight(minHeight, "height.value < minHeight");
    }
  }, [minHeight, maxHeight, maxAutoHeight, height]);

  return {
    hasGotMaxHeight,
    onContentLayout,
    maxAutoHeight,
    minHeight,
    maxHeight,
  };
}
