import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import * as serviceWorker from "./serviceWorker";
import "antd/dist/antd.css";

import CustomRoutes from "./routes/routes";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import rootStore from "./store/store";

ReactDOM.render(
  <Provider store={rootStore().store}>
    <PersistGate loading={null} persistor={rootStore().persistor}>
      <CustomRoutes />
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
