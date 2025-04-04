import slice from "../decks";
import { Cards, Decks } from "@/store/types";
import { dateToDateString } from "@/utils/dates";
import { syncState } from "@/store/combinedActions/sync";
import { initialState } from "../test/initialState";

const testDate = dateToDateString(new Date("2023-01-01"));

function createTestDeck(
  deckId: string,
  props?: Partial<Decks.Props>,
): Decks.Props {
  return {
    dateDeleted: null,
    dateCreated: testDate,
    dateUpdated: testDate,
    name: "Test Deck",
    description: "Test Description",
    dataSchema: {},
    defaultTabletopId: "",
    id: deckId,
    templates: {
      back: {
        dataTemplateMapping: {},
        templateId: "template1",
      },
      front: {
        dataTemplateMapping: {},
        templateId: "template2",
      },
    },
    canEdit: true,
    cards: [],
    cardSize: Cards.Size.Poker,
    ...props,
  };
}

const deck1 = createTestDeck("deck1");
const deck2 = createTestDeck("deck2");

const initialTestState: Decks.State = {
  decksById: {
    [deck1.id]: deck1,
  },
};

describe("decks slice", () => {
  it("works", () => {
    expect(
      slice.reducer(
        initialTestState,
        syncState({
          date: testDate,
          state: {
            ...initialState,
            decks: {
              ...initialState.decks,
              decksById: {
                ...initialState.decks.decksById,
                [deck2.id]: deck2,
              },
            },
          },
          dateSaved: testDate,
        }),
      ),
    ).toEqual({
      ...initialTestState,
      decksById: {
        ...initialTestState.decksById,
        [deck1.id]: deck1,
        [deck2.id]: deck2,
      },
    });
  });
});
