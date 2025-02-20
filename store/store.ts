import { configureStore } from "@reduxjs/toolkit";
import cardsSlice from "./slices/cards";
import stacksSlice from "./slices/stacks";
import tabletopsSlice from "./slices/tabletop";
import decksSlice from "./slices/decks";
import userSettingsSlice from "./slices/userSettings";

export const store = configureStore({
  reducer: {
    [cardsSlice.name]: cardsSlice.reducer,
    [stacksSlice.name]: stacksSlice.reducer,
    [tabletopsSlice.name]: tabletopsSlice.reducer,
    [decksSlice.name]: decksSlice.reducer,
    [userSettingsSlice.name]: userSettingsSlice.reducer,
  },
});

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
