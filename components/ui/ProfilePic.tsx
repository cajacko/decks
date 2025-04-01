import React from "react";
import { View, StyleProp, ViewStyle, StyleSheet } from "react-native";
import { useAuthentication } from "@/context/Authentication";
import { Image } from "expo-image";
import IconSymbol from "./IconSymbol";

export interface ProfilePicProps {
  style?: StyleProp<ViewStyle>;
  size?: number;
}

export default function ProfilePic({
  size = 50,
  style,
}: ProfilePicProps): React.ReactNode {
  const auth = useAuthentication();
  const uri = auth.user?.picture;
  // const uri = null;

  const imageStyle = React.useMemo(
    () => ({
      height: size,
      width: size,
      borderRadius: size / 2,
    }),
    [size],
  );

  return (
    <View style={style}>
      {uri ? (
        <Image
          source={{ uri }}
          style={[styles.profilePic, imageStyle]}
          contentFit="cover"
        />
      ) : (
        <IconSymbol size={size} name="sentiment-satisfied" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  profilePic: {},
});
