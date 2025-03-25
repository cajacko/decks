import React from "react";
import Toolbar from "../ui/Toolbar";
import { useSetDrawerProps } from "@/context/Drawer";

export default function DecksToolbar(): React.ReactNode {
  useSetDrawerProps();

  return <Toolbar />;
}
