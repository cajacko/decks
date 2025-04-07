import React from "react";
import { Toolbar } from "@/context/Toolbar";
import useDeckName from "@/hooks/useDeckName";
import { appHome } from "@/constants/links";
import { useEditDeckModal } from "../editDeck/EditDeckModal";

interface DeckToolbarProps {
  deckId: string;
  loading: boolean;
}

export default function DeckToolbar(props: DeckToolbarProps): React.ReactNode {
  const title = useDeckName(props.deckId);
  const { component, open } = useEditDeckModal(props.deckId);

  return (
    <>
      {component}
      <Toolbar
        backPath={appHome}
        logoVisible={false}
        title={title}
        loading={props.loading}
        onPressTitle={open}
      />
    </>
  );
}
