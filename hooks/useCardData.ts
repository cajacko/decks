import { useEditCardContext } from "@/context/EditCard";
import { useAppSelector } from "@/store/hooks";
import { selectCard, Card } from "@/store/slices/cards";

interface CardData {
  store: Card | null;
  edit: Partial<Card>;
}

export default function useCardData(props: { cardId: string }) {
  const store = useAppSelector((state) => selectCard(state, props));
  const edit = useEditCardContext();

  return {
    store,
    edit,
  };
}
