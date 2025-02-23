import React from "react";

interface EditCardContext {}

const Context = React.createContext<EditCardContext | null>(null);

export function useEditCardContext() {
  const context = React.useContext(Context);

  return context;
}

export const EditCardProvider: React.FC<{
  children?: React.ReactNode;
  cardId: string;
}> = ({ children }) => {
  return <Context.Provider value={{}}>{children}</Context.Provider>;
};
