import React from "react";
import { Image as ExpoImage, ImageProps as ExpoImageProps } from "expo-image";

export interface ImageProps extends ExpoImageProps {
  children?: React.ReactNode;
}

export default function Image(props: ImageProps): React.ReactNode {
  return <ExpoImage {...props} />;
}
