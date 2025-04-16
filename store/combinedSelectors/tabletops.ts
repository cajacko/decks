import { createCachedSelector } from "re-reselect";
import {
  selectTabletop,
  selectDoesTabletopHaveCardInstances,
} from "../selectors/tabletops";
import { RootState, Decks, Tabletops } from "../types";
import { selectFlags } from "../selectors/flags";

type TabletopProps = { tabletopId: Tabletops.Id };

export const selectTabletopAvailableDeckCards = createCachedSelector(
  (state: RootState, props: TabletopProps) =>
    selectTabletop(state, props)?.availableDecks,
  (state: RootState) => state.decks.decksById,
  (availableDecks, decksById): Decks.Card[] | null => {
    if (!availableDecks) return null;

    const cards: Decks.Card[] = [];

    availableDecks.forEach((deckId) => {
      const deck = decksById[deckId];

      if (!deck) return;

      deck.cards.forEach((card) => {
        cards.push(card);
      });
    });

    return cards;
  },
)((_, props) => props.tabletopId);

export const selectDoesTabletopHaveAvailableCards = createCachedSelector(
  selectTabletopAvailableDeckCards,
  (cards): boolean | null => {
    return cards && cards.length > 0;
  },
)((_, props) => props.tabletopId);

export const selectTabletopNeedsResetting = createCachedSelector(
  selectDoesTabletopHaveCardInstances,
  selectDoesTabletopHaveAvailableCards,
  (hasCardInstances, hasAvailableCards) => {
    if (hasCardInstances) {
      return false;
    }

    if (hasAvailableCards) {
      return true;
    }

    return false;
  },
)((_, props) => props.tabletopId);

export const selectTabletopSettings = createCachedSelector(
  (state: RootState, props: TabletopProps) =>
    selectTabletop(state, props)?.settings,
  (state: RootState) =>
    selectFlags(state, { keys: ["GLOBAL_NEAT_STACK_BEHAVIOUR"] }),
  (settings, { GLOBAL_NEAT_STACK_BEHAVIOUR }): Tabletops.Settings => {
    return {
      ...settings,
      preferNeatStacks:
        GLOBAL_NEAT_STACK_BEHAVIOUR === "user-choice"
          ? settings?.preferNeatStacks
          : true,
    };
  },
)((_, props) => props.tabletopId);
