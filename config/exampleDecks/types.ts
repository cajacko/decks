export interface ExampleCard {
  title?: string;
  description?: string;
}

export interface ExampleDeck {
  name: string;
  description: string;
  cards: ExampleCard[];
}
