import { useEffect, useState } from "react";
import { formatDistanceToNow, isValid } from "date-fns";

export default function useRelativeTimeText(date: Date | null): string | null {
  const [relativeTime, setRelativeTime] = useState<string | null>(() => {
    if (!date || !isValid(date)) return null;

    return formatDistanceToNow(date, { addSuffix: true });
  });

  useEffect(() => {
    if (!date || !isValid(date)) return;

    const update = () => {
      setRelativeTime(formatDistanceToNow(date, { addSuffix: true }));
    };

    update();

    const getNextInterval = () => {
      const secondsAgo = Math.floor((Date.now() - date.getTime()) / 1000);
      if (secondsAgo < 60) return 1000; // Update every second for <1 minute
      if (secondsAgo < 3600) return 60 * 1000; // Update every minute for <1 hour
      return 60 * 60 * 1000; // Update hourly after that
    };

    const interval = getNextInterval();
    const timer = setTimeout(update, interval);

    return () => clearTimeout(timer);
  }, [date, relativeTime]);

  return relativeTime;
}
