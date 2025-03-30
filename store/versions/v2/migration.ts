import createMigration from "../createMigration";
import { RootState as V1 } from "../v1/types";
import { RootState as V2 } from "../v2/types";
import { dateToDateString } from "@/utils/dates";

export default createMigration<V1, V2>({
  fromVersion: 1,
  toVersion: 2,
  migration: (props) => {
    if (!props.validState) return undefined;

    const dateCreated = dateToDateString(new Date());
    const dateUpdated = dateCreated;

    const cards: V2["cards"] = {
      cardsById: {},
    };

    Object.values(props.validState.cards.cardsById).forEach((card) => {
      if (!card) return;

      const newCard = {
        ...card,
        dateCreated,
        dateUpdated,
      };

      cards.cardsById[newCard.cardId] = newCard;
    });

    const decks: V2["decks"] = {
      deckIds: props.validState.decks.deckIds,
      decksById: {},
    };

    Object.values(props.validState.decks.decksById).forEach((deck) => {
      if (!deck) return;

      const newDeck = {
        ...deck,
        dateCreated,
        dateUpdated,
      };

      decks.decksById[newDeck.id] = newDeck;
    });

    const tabletops: V2["tabletops"] = {
      tabletopsById: {},
    };

    Object.values(props.validState.tabletops.tabletopsById).forEach(
      (tabletop) => {
        if (!tabletop) return;

        const newTabletop = {
          ...tabletop,
          dateCreated,
          dateUpdated,
        };

        tabletops.tabletopsById[newTabletop.id] = newTabletop;
      },
    );

    const userSettings: V2["userSettings"] = {
      settings: {
        ...props.validState.userSettings,
        dateCreated,
        dateUpdated,
      },
    };

    const templates: V2["templates"] = {
      templatesById: {},
    };

    Object.values(props.validState.templates.templatesById).forEach(
      (template) => {
        if (!template) return;

        const newTemplate = {
          ...template,
          dateCreated,
          dateUpdated,
        };

        templates.templatesById[template.templateId] = newTemplate;
      },
    );

    const state: V2 = {
      // Spreading the previous means we have to manually copy over the properties. Which is good
      // type safety, we won't miss out any properties that need changing
      ...props.validState,
      cards,
      decks,
      tabletops,
      userSettings,
      templates,
    };

    return state;
  },
});
