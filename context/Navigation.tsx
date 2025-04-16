import React from "react";
import { Platform } from "react-native";

export type ScreenProps =
  | {
      name: "marketing";
      deckId?: undefined;
    }
  | {
      name: "decks";
      deckId?: undefined;
    }
  | {
      name: "deck";
      deckId: string;
    }
  | {
      name: "play";
      deckId: string;
    };

export type NavigationContext = {
  screen: ScreenProps;
  preloadDeckId: string | null;
  navigate: (screen: ScreenProps) => void;
};

const initialScreen: ScreenProps = {
  name: Platform.OS === "web" ? "marketing" : "decks",
};

const Context = React.createContext<NavigationContext>({
  screen: initialScreen,
  preloadDeckId: null,
  navigate: () => undefined,
});

export const useNavigation = (): NavigationContext => {
  const context = React.useContext(Context);

  return context;
};

export function NavigationProvider(props: {
  children: React.ReactNode;
}): React.ReactElement {
  const [screen, setScreen] =
    React.useState<NavigationContext["screen"]>(initialScreen);
  const [preloadDeckId, setPreloadDeckId] = React.useState<string | null>(null);

  const navigate = React.useCallback((screen: ScreenProps) => {
    setScreen(screen);

    if (screen.name === "deck" || screen.name === "play") {
      setPreloadDeckId(screen.deckId);
    }
  }, []);

  const value = React.useMemo(
    (): NavigationContext => ({
      screen,
      preloadDeckId,
      navigate,
    }),
    [screen, preloadDeckId, navigate],
  );

  return <Context.Provider value={value}>{props.children}</Context.Provider>;
}
