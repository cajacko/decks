import { alert } from "@/components/overlays/Alert";
import React from "react";
import { BackHandler, Platform } from "react-native";
import text from "@/constants/text";

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
  goBack?: () => void;
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

const homeScreen = "decks";

export function NavigationProvider(props: {
  children: React.ReactNode;
}): React.ReactElement {
  const [screen, setScreen] =
    React.useState<NavigationContext["screen"]>(initialScreen);
  const [preloadDeckId, setPreloadDeckId] = React.useState<string | null>(null);
  const isHomeScreen = screen.name === homeScreen;

  const navigate = React.useCallback((screen: ScreenProps) => {
    setScreen(screen);

    if (screen.name === "deck" || screen.name === "play") {
      setPreloadDeckId(screen.deckId);
    }
  }, []);

  const goBack = React.useMemo(() => {
    if (isHomeScreen) return undefined;

    return () => {
      setScreen({ name: homeScreen });
    };
  }, [isHomeScreen]);

  const value = React.useMemo(
    (): NavigationContext => ({
      screen,
      preloadDeckId,
      navigate,
      goBack,
    }),
    [screen, preloadDeckId, navigate, goBack],
  );

  React.useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (!goBack) {
          alert(({ onRequestClose }) => {
            return {
              title: text["alert.back.exit.title"],
              buttons: [
                {
                  text: text["general.cancel"],
                  onPress: onRequestClose,
                },
                {
                  text: text["general.exit"],
                  style: "destructive",
                  onPress: () => {
                    onRequestClose();
                    BackHandler.exitApp();
                  },
                },
              ],
            };
          });

          return true;
        }

        goBack();

        return true;
      },
    );

    return subscription.remove;
  }, [goBack]);

  return <Context.Provider value={value}>{props.children}</Context.Provider>;
}
