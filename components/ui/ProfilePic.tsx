import React from "react";
import { View, StyleProp, ViewStyle, StyleSheet } from "react-native";
import { useAuthentication } from "@/context/Authentication";
import Image, { ImageProps } from "@/components/ui/Image";
import IconSymbol, { IconSymbolName } from "./IconSymbol";
import AppError from "@/classes/AppError";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  TouchableOpacity,
  TouchableOpacityProps,
} from "@/components/ui/Pressables";

export interface ProfilePicProps
  extends Pick<TouchableOpacityProps, "onPress"> {
  style?: StyleProp<ViewStyle>;
  size?: number;
  fallbackIcon?: IconSymbolName;
  loggedOutIcon?: IconSymbolName;
  loadingBehaviour?:
    | "fallback-icon"
    | "nothing"
    | "profile-icon"
    | "profile-loading";
}

const _fallbackIcon: IconSymbolName = "face";

export default function ProfilePic({
  size = 50,
  style: styleProp,
  loadingBehaviour = "profile-loading",
  ...props
}: ProfilePicProps): React.ReactNode {
  const auth = useAuthentication();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<AppError | undefined>(undefined);
  const uri = auth.user?.picture;
  const borderColor = useThemeColor("inputOutline");

  let renderImage: boolean;
  let renderFallbackIcon: boolean;
  let renderLoading: boolean;
  let showImage: boolean;
  let fallbackIcon: IconSymbolName = _fallbackIcon;

  if (uri) {
    renderImage = true;

    if (loading) {
      showImage = false;
      renderLoading = false;

      switch (loadingBehaviour) {
        case "fallback-icon": {
          renderFallbackIcon = true;
          break;
        }
        case "nothing": {
          renderFallbackIcon = false;
          break;
        }
        case "profile-icon": {
          renderFallbackIcon = true;
          fallbackIcon = _fallbackIcon;
          break;
        }
        case "profile-loading": {
          renderLoading = true;
          renderFallbackIcon = false;
          break;
        }
      }
    } else if (error) {
      showImage = false;
      renderLoading = false;
      renderFallbackIcon = true;
    } else {
      showImage = true;
      renderLoading = false;
      renderFallbackIcon = false;
    }
  } else {
    showImage = false;
    renderImage = false;
    renderFallbackIcon = true;
    renderLoading = false;
  }

  const source = React.useMemo(
    () => ({
      uri,
    }),
    [uri],
  );

  const style = React.useMemo(
    () => StyleSheet.flatten([{ height: size, width: size }, styleProp]),
    [size, styleProp],
  );

  const onError = React.useCallback<NonNullable<ImageProps["onError"]>>(
    (event) => {
      setError(
        new AppError(
          `${ProfilePic.name} encountered an error loading the image`,
          event.error,
        ),
      );
    },
    [],
  );

  const onLoad = React.useCallback<NonNullable<ImageProps["onLoad"]>>(() => {
    setError(undefined);
  }, []);

  const onLoadEnd = React.useCallback<
    NonNullable<ImageProps["onLoadEnd"]>
  >(() => {
    setLoading(false);
  }, []);

  const onLoadStart = React.useCallback<
    NonNullable<ImageProps["onLoadStart"]>
  >(() => {
    setLoading(true);
    setError(undefined);
  }, []);

  const imageStyle = React.useMemo(
    () => [
      styles.image,
      showImage ? styles.loaded : styles.hide,
      {
        // Border colour ensures we have something to show even if the users profile is just a black
        // image or something
        borderColor,
        height: size,
        width: size,
        borderRadius: size / 2,
      },
    ],
    [size, showImage, borderColor],
  );

  const loadingStyle = React.useMemo(
    () => [
      styles.loading,
      {
        // Border colour ensures we have something to show even if the users profile is just a black
        // image or something
        borderColor,
        height: size,
        width: size,
        borderRadius: size / 2,
      },
    ],
    [size, borderColor],
  );

  const children = (
    <>
      {renderImage && (
        <Image
          source={source}
          style={imageStyle}
          contentFit="cover"
          onError={onError}
          onLoad={onLoad}
          onLoadEnd={onLoadEnd}
          onLoadStart={onLoadStart}
          cachePolicy="memory-disk"
        />
      )}

      {renderFallbackIcon && <IconSymbol size={size} name={fallbackIcon} />}
      {renderLoading && <View style={loadingStyle} />}
    </>
  );

  if (!props.onPress) {
    return <View style={style}>{children}</View>;
  }

  return (
    <TouchableOpacity onPress={props.onPress} vibrate style={style}>
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  loaded: {
    opacity: 1,
  },
  loading: {},
  hide: {
    opacity: 0,
    position: "absolute",
  },
  image: {
    borderWidth: 1,
  },
});
