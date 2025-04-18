import { StyleSheet } from "react-native";

export const _contentHeight = 50;
export const imageHeight = _contentHeight - 10;
export const iconSize = _contentHeight - 20;
export const horizontalPadding = 16;

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderBottomWidth: 1,
    top: 0,
    right: 0,
    left: 0,
    zIndex: 3,
  },
  contentWidth: {
    height: _contentHeight,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  title: {
    textOverflow: "ellipsis",
  },
  trimmedContent: {
    flex: 1,
    overflow: "hidden",
  },
  rightContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  settings: {
    marginLeft: horizontalPadding,
  },
  backButton: {
    marginRight: horizontalPadding,
  },
  action: {
    marginHorizontal: horizontalPadding,
  },
  progress: {
    height: 3,
    position: "absolute",
    bottom: -2,
    zIndex: 500,
    borderRadius: 3,
  },
});
