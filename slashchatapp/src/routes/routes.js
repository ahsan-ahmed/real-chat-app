import React from "react";
import { Router, Route } from "react-router-dom";
import { createBrowserHistory } from "history";
import App from "../App";
import LoginForm from "../screens/Signin/Signin";
import SignupForm from "../screens/Signup/Signup";

const customHistory = createBrowserHistory();

class CustomRoutes extends React.Component {
  render() {
    return (
      <Router history={customHistory}>
        <>
          <Route exact path="/" component={App} />
          <Route path="/login" component={LoginForm} />
          <Route path="/signup" component={SignupForm} />
        </>
      </Router>
    );
  }
}

export default CustomRoutes;
