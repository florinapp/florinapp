import React, { Component } from "react";
import { Route } from 'react-router-dom';
import AccountList from "./AccountList.js";

const AccountNew = () => {
  return <h2>New</h2>
}

export default class Accounts extends Component {
  render() {
    return <div className="animated fadeIn">
      <Route exact path="/accounts" component={AccountList} />
      <Route exact path="/accounts/new" component={AccountNew} />
    </div>
  }
}
