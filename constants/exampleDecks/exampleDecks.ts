import _exampleDecks from "./exampleDecks.json";

type ExampleCard = {
  title?: string;
  description?: string;
  emoji?: string;
  devOnly?: boolean;
};

type ExampleDeck = {
  title: string;
  description: string;
  devOnly?: boolean;
  gid?: string;
  cards?: ExampleCard[];
  key: string;
  color?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  backTextSize?: string;
};

const exampleDecks: ExampleDeck[] = _exampleDecks;

export default exampleDecks;
