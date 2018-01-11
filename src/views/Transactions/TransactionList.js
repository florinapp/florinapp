import React, { Component } from "react";
import {
  Container,
  Badge,
  Row,
  Col,
  ButtonGroup
} from "reactstrap";
import { connect } from "react-redux";
import * as actions from "../../actions";
import TransactionTable from "./TransactionTable";
import RefreshButton from "../../components/RefreshButton/RefreshButton";
import Switch from "../../components/Switch/Switch";

class TransactionList extends Component {
  componentDidUpdate(nextProps, nextState) {
    const fetchOptionsChanged =
      JSON.stringify(nextProps.transactionsState.fetchOptions) !==
      JSON.stringify(this.props.transactionsState.fetchOptions);
    if (!fetchOptionsChanged) {
      return;
    }
    const { fetchOptions } = this.props.transactionsState;
    this.props.fetchTransactions(fetchOptions);
    this.props.fetchIncomeExpensesStats(fetchOptions.filters);
    this.props.fetchCategorySummaries(fetchOptions.filters);
  }

  componentDidMount() {
    this.props.fetchCategories();
    const { fetchOptions } = this.props.transactionsState;
    this.props.fetchTransactions(fetchOptions);
    this.props.fetchIncomeExpensesStats(fetchOptions.filters);
    this.props.fetchCategorySummaries(fetchOptions.filters);
  }

  render() {
    const {
      location,
      fetchTransactions,
      transactionsState,
      categoriesState
    } = this.props;
    const { fetchOptions } = transactionsState;
    return (
      <Container fluid>
        <Row>
          <Col xs="12" lg="12">
            <h3 className="float-left">Transactions</h3>
            <ButtonGroup style={{ marginLeft: 5 }}>
              <RefreshButton
                withCaption={false}
                onClick={() => {
                  fetchTransactions(this.props.transactionsState.fetchOptions);
                }}
              />
            </ButtonGroup>
          </Col>
        </Row>
        <Row>
          <Col xs="12" lg="12">
            <Badge color="primary" pill>
              {" "}
              Date: from {fetchOptions.filters.dateFrom} to{" "}
              {fetchOptions.filters.dateTo}{" "}
            </Badge>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col xs="12" lg="12">
            <Switch
              text="Include Account Transfers"
              tooltipId="switch-show-internaltransfer"
              tooltipText="Show/Hide account transfer transactions"
              onChange={() => {
                this.props.changeShowAccountTransfers(
                  !transactionsState.fetchOptions.filters.showAccountTransfers,
                  location
                );
              }}
              defaultChecked={fetchOptions.filters.showAccountTransfers}
            />
            <Switch
              text="Show only uncategorized"
              tooltipId="switch-show-uncategorized"
              tooltipText="Only show transactions that need categorization"
              onChange={() => {
                this.props.changeShowOnlyUncategorized(
                  !transactionsState.fetchOptions.filters.showOnlyUncategorized,
                  location
                );
              }}
              defaultChecked={fetchOptions.filters.showOnlyUncategorized}
            />
          </Col>
        </Row>
        <hr />
        <Row>
          <Col xs="12" lg="12">
            <TransactionTable
              transactionsState={transactionsState}
              categoriesState={categoriesState}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  const transactionsState = state.transactions;
  const categoriesState = state.categories;
  const location = state.router.location;
  return {
    categoriesState,
    transactionsState,
    location
  };
};

export default connect(mapStateToProps, actions)(TransactionList);
