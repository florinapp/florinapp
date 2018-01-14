import React, { Component } from "react";
import { Route } from "react-router-dom";
import CategoryList from "./CategoryList";
import CategoryNew from "./CategoryNew";

export default class Categories extends Component {
  render() {
    return (
      <div className="animated fadeIn">
        <Route exact path="/settings/categories" component={CategoryList} />
        <Route exact path="/settings/categories/new" component={CategoryNew} />
      </div>
    );
  }
}
