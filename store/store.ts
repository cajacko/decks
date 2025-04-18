import {
  configureStore,
  combineReducers,
  StateFromReducersMapObject,
  ActionFromReducersMapObject,
  Middleware,
} from "@reduxjs/toolkit";
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
import sync from "./slices/sync";
import includedData from "./slices/includedData";
import AppError from "@/classes/AppError";
// import { HistoryTransform } from "./transforms";

enablePatches();

const reducerMap = {
  [cardsSlice.name]: cardsSlice.reducer,
  [tabletopsSlice.name]: tabletopsSlice.reducer,
  [decksSlice.name]: decksSlice.reducer,
  [userSettingsSlice.name]: userSettingsSlice.reducer,
  [templatesSlice.name]: templatesSlice.reducer,
  [sync.name]: sync.reducer,
  [includedData.name]: includedData.reducer,
};

const appReducer = combineReducers(reducerMap);

type AppState = StateFromReducersMapObject<typeof reducerMap>;
type AppAction = ActionFromReducersMapObject<typeof reducerMap>;

const resetStoreAction = { type: "root/resetStore" };

const rootReducer = (state: AppState | undefined, action: AppAction) => {
  if (action.type === resetStoreAction.type) {
    state = undefined; // This will reset the entire store
  }
  return appReducer(state, action);
};

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
      userSettingsSlice.name,
      sync.name,
      includedData.name,
    ],
    writeFailHandler: (error) => {
      AppError.getError(
        error,
        "Redux persist encountered an error persisting the store",
      ).log("error");
    },
    // Enable to not persist history, currently we're invalidating it during migration instead,
    // which allows us to persist history until we change the state which is nice if it works
    // transforms: [HistoryTransform],
  },
  rootReducer,
);

// NOTE: Useful for mobile debugging
const logStoreType = false;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const loggerMiddleware: Middleware = (_) => (next) => (action: any) => {
  if (logStoreType) {
    // eslint-disable-next-line no-console
    console.log(action.type);
  }

  return next(action);
};

export const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(loggerMiddleware), // Add loggerMiddleware here
});

export function resetStore() {
  store.dispatch(resetStoreAction);
}

export const persistor = persistStore(store);

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
