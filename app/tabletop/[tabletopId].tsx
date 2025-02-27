import { StyleSheet } from "react-native";
import Tabletop from "@/components/Tabletop/Tabletop";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import AppError from "@/classes/AppError";

export const paramKeys = {
  tabletopId: "tabletopId",
};

export default function TabletopScreen() {
  const params = useLocalSearchParams();
  const tabletopId = params[paramKeys.tabletopId];

  if (typeof tabletopId !== "string") {
    throw new AppError(`${TabletopScreen.name} tabletopId must be a string`);
  }

  return <Tabletop tabletopId={tabletopId} style={styles.tabletop} />;
}

const styles = StyleSheet.create({
  tabletop: {
    flex: 1,
  },
});
