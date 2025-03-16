import { StyleSheet } from "react-native";
import { WithSpringConfig } from "react-native-reanimated";

const borderRadius = 20;
export const dragOverlap = 20;
export const dragBuffer = 10;
const dragHeaderHeight = Math.max(30, borderRadius);
export const dragHeight = dragHeaderHeight + dragOverlap + dragBuffer;

export const autoAnimateConfig: WithSpringConfig = {
  damping: 20,
  stiffness: 100,
};

export default StyleSheet.create({
  dragBar: {
    position: "absolute",
    top: -(dragOverlap + dragBuffer),
    width: "100%",
    height: dragHeight,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: dragBuffer,
    cursor: "pointer",
  },
  dragBox: {
    alignItems: "center",
    justifyContent: "center",
    height: dragOverlap * 2,
    paddingHorizontal: 20,
    borderRadius: 10,
    zIndex: 2,
    position: "relative",
    cursor: "pointer",
  },
  dragHeader: {
    marginTop: -dragOverlap,
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
    height: dragHeaderHeight,
    width: "100%",
    zIndex: 1,
    position: "relative",
    cursor: "pointer",
  },
  dragIcon: {
    fontSize: 20,
    cursor: "pointer",
  },
  drawer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  drawerContainer: {
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
    flex: 1,
    width: "100%",
  },
  content: {
    flex: 1,
    marginTop: dragHeight - dragOverlap - dragBuffer,
  },
});
