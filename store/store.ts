import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { enablePatches } from "immer";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "./storage";
import cardsSlice from "./slices/cards";
import tabletopsSlice from "./slices/tabletop";
import decksSlice from "./slices/decks";
import userSettingsSlice from "./slices/userSettings";
import { RootState as VersionRootState } from "./versions/latest";
import migrations from "./versions/migrations";
import { version } from "./versions/latest";
// import { HistoryTransform } from "./transforms";

const rootReducer = combineReducers({
  [cardsSlice.name]: cardsSlice.reducer,
  [tabletopsSlice.name]: tabletopsSlice.reducer,
  [decksSlice.name]: decksSlice.reducer,
  [userSettingsSlice.name]: userSettingsSlice.reducer,
});

const persistedReducer = persistReducer(
  {
    key: "root",
    version,
    storage,
    migrate: migrations,
    // stateReconciler // remove history from persisted state
    whitelist: [
      userSettingsSlice.name,
      tabletopsSlice.name,
      decksSlice.name,
      cardsSlice.name,
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
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// Quickly reset the store to initial values and remove persisted data
// persistor.purge();

enablePatches();

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
