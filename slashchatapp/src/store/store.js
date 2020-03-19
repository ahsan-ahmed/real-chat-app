// configureStore.js
import { combineReducers } from "redux";
import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import IsUserLoginReducer from "../Reducers/isUserLoginReducer/isUserLoginReducer";
import BackUpUserRoomReducer from "../Reducers/backUpUserRoomReducer/backUpUserRoomReducer";
import NewGroupCreatedReducer from "../Reducers/newGroupCreatedReducer/newGroupCreatedReducer";

const persistConfig = {
  key: "root",
  storage,
  // blacklist: ["NewGroupCreatedReducer"]
};

const rootReducer = combineReducers({
  IsUserLoginReducer,
  BackUpUserRoomReducer,
  NewGroupCreatedReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
  let store = createStore(persistedReducer);
  let persistor = persistStore(store);
  return { store, persistor };
};
