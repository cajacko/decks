import { useEffect, useState } from "react";
import { Dimensions } from "react-native";

interface DeviceSize {
  width: number;
  height: number;
}

export default function useDeviceSize(props?: {
  listenTo?: { width?: boolean; height?: boolean };
}): DeviceSize {
  const [width, setWidth] = useState(Dimensions.get("window").width);
  const [height, setHeight] = useState(Dimensions.get("window").height);

  useEffect(() => {
    if (!props?.listenTo?.width && !props?.listenTo?.height) return;

    const handler = (dimensions: {
      window: { width: number; height: number };
    }) => {
      if (props.listenTo?.width) {
        setWidth(dimensions.window.width);
      }

      if (props.listenTo?.height) {
        setHeight(dimensions.window.height);
      }
    };

    const subscription = Dimensions.addEventListener("change", handler);

    return () => {
      subscription.remove();
    };
  }, [props?.listenTo?.width]);

  return { height, width };
}
