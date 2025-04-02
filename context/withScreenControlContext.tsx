import React from "react";
import uuid from "@/utils/uuid";
import { useFocusEffect, useNavigation } from "expo-router";

type Options = {
  resetOnUnmount?: boolean;
};

type OnPropsChange<Props> = (
  props: {
    id: string;
    props: Props;
    isScreenFocussed: boolean;
  },
  options: Options | undefined,
) => void;

type OnUnmount = (id: string, options: Options | undefined) => void;

function _resolveOptions(
  ...options: (Options | undefined)[]
): Options | undefined {
  let resolvedOptions: Options | undefined = undefined;

  for (const option of options) {
    if (!option) continue;

    if (!resolvedOptions) {
      resolvedOptions = option;
    } else {
      resolvedOptions = {
        ...option,
        // Prefer early options
        // @ts-ignore
        ...resolvedOptions,
      };
    }
  }

  return resolvedOptions;
}

function useResolvedOptions(...options: (Options | undefined)[]): {
  options: Options | undefined;
  resolveOptions: (options?: Options) => Options | undefined;
} {
  const resolvedOptions = React.useMemo(
    () => _resolveOptions(...options),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    options,
  );

  const resolveOptions = React.useCallback(
    (options: Options | undefined) => _resolveOptions(options, resolvedOptions),
    [resolvedOptions],
  );

  return {
    options: resolvedOptions,
    resolveOptions: resolveOptions,
  };
}

export type ContextState<Props = unknown> = {
  props: Props;
  onPropsChange: OnPropsChange<Props>;
  onUnmount: OnUnmount;
};

function withUseScreenControlContext<
  Props,
  ContextType extends ContextState<Props> | null,
>(Context: React.Context<ContextType>, parentOptions?: Options) {
  return function useScreenControlContext(props: Props, options?: Options) {
    const context = React.useContext(Context);
    const { onPropsChange, onUnmount } = context ?? {};
    const id = React.useMemo(uuid, []);
    const navigation = useNavigation();
    const [isScreenFocussed, setIsScreenFocussed] = React.useState(
      navigation.isFocused,
    );
    const { options: resolvedOptions } = useResolvedOptions(
      options,
      parentOptions,
    );

    useFocusEffect(
      React.useCallback(() => {
        setIsScreenFocussed(true);

        return () => {
          setIsScreenFocussed(false);
        };
      }, []),
    );

    React.useEffect(() => {
      onPropsChange?.(
        {
          id,
          props,
          isScreenFocussed,
        },
        resolvedOptions,
      );
    }, [onPropsChange, isScreenFocussed, id, props, resolvedOptions]);

    React.useEffect(
      () => () => onUnmount?.(id, resolvedOptions),
      [onUnmount, id, resolvedOptions],
    );

    return context;
  };
}

function withUseScreenControlProvider<Props>(
  defaultProps: Props,
  parentOptions?: Options,
) {
  return function useScreenControlProvider(hookOptions?: Options) {
    const { resolveOptions } = useResolvedOptions(hookOptions, parentOptions);
    const [{ id, props }, setProps] = React.useState<{
      id: string | null;
      props: Props;
    }>({
      id: null,
      props: defaultProps,
    });

    const idRef = React.useRef(id);
    idRef.current = id;

    const onPropsChange = React.useCallback<OnPropsChange<Props>>(
      ({ isScreenFocussed, props: newProps, id }, options) => {
        const resolvedOptions = resolveOptions(options);

        if (!isScreenFocussed) {
          if (idRef.current !== id) return;

          if (resolvedOptions?.resetOnUnmount) {
            setProps({ id: null, props: defaultProps });
          }

          return;
        }

        setProps({ id, props: newProps });
      },
      [resolveOptions],
    );

    const onUnmount = React.useCallback<OnUnmount>(
      (id, options) => {
        const resolvedOptions = resolveOptions(options);

        if (idRef.current !== id) return;

        if (!resolvedOptions?.resetOnUnmount) return;

        setProps({ id: null, props: defaultProps });
      },
      [resolveOptions],
    );

    return {
      onPropsChange,
      onUnmount,
      props,
      setProps,
    };
  };
}

export default function withScreenControlContext<
  Props,
  ContextType extends ContextState<Props> | null,
>(initialContext: ContextType, defaultProps: Props, options?: Options) {
  const Context = React.createContext<ContextType>(initialContext);

  return {
    Context,
    useScreenControlContext: withUseScreenControlContext<Props, ContextType>(
      Context,
      options,
    ),
    useScreenControlProvider: withUseScreenControlProvider<Props>(
      defaultProps,
      options,
    ),
  };
}
