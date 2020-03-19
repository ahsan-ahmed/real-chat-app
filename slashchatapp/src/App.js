import React from "react";
import "./App.scss";
import ChatDashboard from "./components/ChatDashboard/ChatDashboard";

export default class App extends React.Component {
  render() {
    return (
      <div className="app-container">
        <ChatDashboard history={this.props.history} />
      </div>
    );
  }
}
