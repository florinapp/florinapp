import React, { Component } from "react";
import { Card, Row, Col, CardHeader, CardBody } from "reactstrap";
import { connect } from "react-redux";
import AccountForm from "./AccountForm";
import * as actions from "../../actions";
import { reduxForm } from "redux-form";
import Account from "../../models/Account";

const ViewAccountForm = connect(({ currentAccount }) => {
  return {
    initialValues: currentAccount
  };
}, null)(reduxForm({ form: "viewAccount" })(AccountForm));

class AccountDetails extends Component {
  componentWillMount() {
    const { accountId } = this.props.match.params;
    this.props.fetchAccountById(accountId);
  }

  render() {
    const { accountId } = this.props.match.params;
    const { updateAccount } = this.props;
    return (
      <Row>
        <Col xs="12" lg="12">
          <Card>
            <CardHeader>
              <strong>Account Details</strong>
            </CardHeader>
            <CardBody>
              <ViewAccountForm
                editMode
                onSubmit={props => updateAccount(accountId, new Account(props))}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default connect(null, actions)(AccountDetails);
