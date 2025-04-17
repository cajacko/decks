import React from "react";
import { getFlag } from "@/store/selectors/flags";
import useFlag from "@/hooks/useFlag";

type TrackTimeOptions = {
  note?: string;
  tags?: string[];
};

type TrackTime = (options?: TrackTimeOptions) => void;
type StartTime = (startTag: string, options?: TrackTimeOptions) => void;
type EndTime = (startTag: string, options?: TrackTimeOptions) => void;

export const trackTime: TrackTime = () => {};
export const startTime: StartTime = () => {};
export const endTime: EndTime = () => {};

interface ContextState {
  trackTime: TrackTime;
  startTime: StartTime;
  endTime: EndTime;
}

const Context = React.createContext<ContextState>({
  trackTime: () => undefined,
  endTime: () => undefined,
  startTime: () => undefined,
});

export function usePerformanceMonitor(
  options: TrackTimeOptions & {
    Component: string;
  },
): ContextState {
  const debugPerformance = useFlag("DEBUG_PERFORMANCE");
  const { endTime, startTime, trackTime } = React.useContext(Context);

  const optionsRef = React.useRef<TrackTimeOptions>(options);

  optionsRef.current = {
    ...options,
    tags: [...(options?.tags ?? []), options.Component],
  };

  const context = React.useMemo((): ContextState => {
    if (!getFlag("DEBUG_PERFORMANCE")) {
      return {
        endTime: () => undefined,
        trackTime: () => undefined,
        startTime: () => undefined,
      };
    }

    function mergeOptions(options?: TrackTimeOptions): TrackTimeOptions {
      return {
        ...optionsRef.current,
        ...options,
        tags: [...(options?.tags ?? []), ...(optionsRef.current.tags ?? [])],
      };
    }

    return {
      endTime: (tag, options) => {
        endTime(tag, mergeOptions(options));
      },
      trackTime: (options) => {
        trackTime(mergeOptions(options));
      },
      startTime: (tag, options) => {
        startTime(tag, mergeOptions(options));
      },
    };
  }, [startTime, endTime, trackTime]);

  if (debugPerformance) {
    context.trackTime({
      tags: ["render"],
    });
  }

  React.useEffect(() => {
    if (!getFlag("DEBUG_PERFORMANCE")) return;

    context.trackTime({
      tags: ["mount"],
    });
  }, [context]);

  return context;
}

type Entry = TrackTimeOptions & { date: number };

function csvSafe(value: string): string {
  return value.includes(",") ? `"${value}"` : value;
}

export function PerformanceMonitorProvider(props: {
  children: React.ReactNode;
}) {
  const ref = React.useRef<
    Record<string, { start: number; entries: Entry[] } | undefined>
  >({});

  const trackTime = React.useCallback<TrackTime>((options) => {
    Object.values(ref.current).forEach((value) => {
      if (!value) return;

      const { entries } = value;

      const entry: Entry = {
        ...options,
        date: Date.now(),
      };

      entries.push(entry);
    });
  }, []);

  const value = React.useMemo(
    (): ContextState => ({
      endTime: (tag, options) => {
        trackTime({
          ...options,
          tags: [...(options?.tags ?? []), tag, "end"],
        });

        const start = ref.current[tag];

        if (!start) {
          // eslint-disable-next-line no-console
          console.warn(`PerformanceMonitorProvider - ${tag} - start not found`);
          return;
        }

        delete ref.current[tag];

        const { start: startTime, entries } = start;

        const endTime = Date.now();
        const duration = endTime - startTime;

        // eslint-disable-next-line no-console
        console.log(`${tag} - ${duration}ms`);
        // eslint-disable-next-line no-console
        console.log(
          "\n\nDate,From Start,Diff,Tags,Note\n" +
            entries
              .map(({ date, note, tags }, i) => {
                const prevEntry = entries[i - 1];
                const diff = prevEntry ? date - prevEntry.date : 0;
                const fromStart = date - startTime;

                return `${date},${fromStart},${diff},${csvSafe((tags ?? []).join(", "))},${note ?? ""}`;
              })
              .join("\n"),
        );
      },
      trackTime,
      startTime: (tag, options) => {
        ref.current[tag] = {
          start: Date.now(),
          entries: [],
        };

        trackTime({
          ...options,
          tags: [...(options?.tags ?? []), tag, "start"],
        });
      },
    }),
    [trackTime],
  );

  return <Context.Provider value={value}>{props.children}</Context.Provider>;
}
