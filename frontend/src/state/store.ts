// src/state/store.ts
import { configureStore, combineReducers, createAction } from "@reduxjs/toolkit";
import { authReducer, adFormReducer, loadingReducer, themeReducer, userReducer , workspaceReducer  } from "./slices";

// Action to reset all states
export const resetState = createAction("resetState");

const appReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  adForm: adFormReducer,
  loading: loadingReducer,
  theme: themeReducer,
  workspace: workspaceReducer,
});

// Root reducer with reset logic
const rootReducer = (state: any, action: any) => {
  if (action.type === resetState.type) {
    state = undefined; 
  }
  return appReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
