import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { enablePatches } from "immer";
import { persistStore, persistReducer } from "redux-persist";
import storage from "./storage";
import { RootState as VersionRootState } from "./versions/latest";
import migrations from "./versions/migrations";
import { version } from "./versions/latest";
import cardsSlice from "./slices/cards";
import tabletopsSlice from "./slices/tabletop";
import decksSlice from "./slices/decks";
import userSettingsSlice from "./slices/userSettings";
import templatesSlice from "./slices/templates";
// import { HistoryTransform } from "./transforms";

enablePatches();

const rootReducer = combineReducers({
  [cardsSlice.name]: cardsSlice.reducer,
  [tabletopsSlice.name]: tabletopsSlice.reducer,
  [decksSlice.name]: decksSlice.reducer,
  [userSettingsSlice.name]: userSettingsSlice.reducer,
  [templatesSlice.name]: templatesSlice.reducer,
});

const persistedReducer = persistReducer(
  {
    key: "root",
    version,
    storage,
    migrate: migrations,
    // stateReconciler // remove history from persisted state
    whitelist: [
      tabletopsSlice.name,
      decksSlice.name,
      cardsSlice.name,
      // TODO: Add these when we're done in dev
      // userSettingsSlice.name,
      // templatesSlice.name,
    ],
    // Enable to not persist history, currently we're invalidating it during migration instead,
    // which allows us to persist history until we change the state which is nice if it works
    // transforms: [HistoryTransform],
  },
  rootReducer,
);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

export const persistor = persistStore(store);

// Quickly reset the store to initial values and remove persisted data
// persistor.purge();

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

// This checks our latest version of the RootState against the current RootState from the store
// This is a type check to ensure that the latest version of the RootState is compatible with the
// current RootState
type RootStateValidator<T extends VersionRootState> = T;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ValidateRootState = RootStateValidator<RootState>;
