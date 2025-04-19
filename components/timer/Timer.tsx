import React from "react";
import { TouchableScale } from "@/components/ui/Pressables";

export interface TimerProps {
  toggle: () => void;
  stop: () => void;
  children: React.ReactNode;
}

export default React.memo<TimerProps>(function Timer({
  children,
  toggle,
  stop,
}) {
  return (
    <TouchableScale onPress={toggle} onLongPress={stop} vibrate>
      {children}
    </TouchableScale>
  );
});
