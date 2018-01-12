import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Container, ButtonGroup, Collapse, Row, Col } from "reactstrap";
import Currency from "../../components/Currency/Currency";
import Date from "../../components/Date/Date";
import ListActionButton from "../../components/ListActionButton/ListActionButton";
import DeleteButton from "../../components/ListActionButton/DeleteButton";
import { reduxForm } from "redux-form";
import { connect } from "react-redux";
import * as actions from "../../actions";
import * as links from "../../models/links";
import CategorySelector from "./CategorySelector";

const TransactionAccount = ({ transaction, location }) => {
  const newLink = links.createTransactionLink(location, (queryParams) => {
    return {
      ...queryParams,
      "filters.accountId": transaction.accountId,
      page: 1
    }
  });
  return (
    <div>
      <Link to={newLink}>
        {transaction.account.name}
      </Link>{" "}
      <Link to={`/accounts/${transaction.account._id}/view`}>
        <ListActionButton
          id={`btn-openaccount-${transaction._id}`}
          icon="fa-external-link"
          outline={true}
          tooltip="Open account page"
        />
      </Link>
    </div>
  );
};

const _TransactionDetailForm = ({ transaction }) => {
  return (
    <Container fluid style={{ backgroundColor: "e0e1e2", height: "100px" }}>
      <Row>
        <Col xs="9" lg="9">
          <form className="form-horizontal">
            Transaction Detail Form (TODO)
          </form>
        </Col>
      </Row>
    </Container>
  );
};

const TransactionDetailForm = ({ transaction }) => {
  const F = reduxForm({ form: `txnForm${transaction._id}` })(
    _TransactionDetailForm
  );
  return <F transaction={transaction} />;
};

class TransactionRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: false
    };
  }
  render() {
    const {
      location,
      fetchOptions,
      transaction,
      categories,
      disabledCategories,
      updateTransactionCategory,
      openLinkTransactionsDialog,
      fetchCategorySummaries
    } = this.props;
    const { isExpanded } = this.state;
    return (
      <tbody>
        <tr>
          <td>
            <ButtonGroup>
              <ListActionButton
                id={`btn-expand-${transaction._id}`}
                color="primary"
                icon={
                  this.state.isExpanded
                    ? "fa-angle-double-up"
                    : "fa-angle-double-down"
                }
                tooltip="Expand"
                onClick={() => {
                  this.setState({
                    isExpanded: !isExpanded
                  });
                }}
              />
              <ListActionButton
                id={`btn-split-${transaction._id}`}
                color="primary"
                icon="fa-code-fork"
                tooltip="Split this transaction"
                onClick={() => {
                  console.log("TODO");
                }}
              />
              <ListActionButton
                id={`btn-link-${transaction._id}`}
                color="primary"
                icon="fa-link"
                tooltip="Link this transaction"
                onClick={() => {
                  openLinkTransactionsDialog(transaction);
                }}
              />
              <DeleteButton
                objectId={transaction._id}
                onClick={() => {
                  console.log("TODO");
                }}
              />
            </ButtonGroup>
          </td>
          <td>
            <Date date={transaction.date} />
          </td>
          <td>
            <TransactionAccount transaction={transaction} location={location} />
          </td>
          <td>{transaction.name}</td>
          <td>{transaction.memo}</td>
          <td style={{ textAlign: "right" }}>
            <Currency
              amount={transaction.amount}
              code={transaction.account.currency}
            />
          </td>
          <td>
            <CategorySelector
              categories={categories}
              value={transaction.categoryId}
              disabled={disabledCategories}
              onChange={c => {
                updateTransactionCategory(transaction._id, c._id);
                fetchCategorySummaries(fetchOptions.filters);
              }}
            />
          </td>
        </tr>
        <tr>
          <td colSpan="7" style={{ padding: 0, marginTop: 0, border: 0 }}>
            <Collapse isOpen={isExpanded}>
              <TransactionDetailForm transaction={transaction} />
            </Collapse>
          </td>
        </tr>
      </tbody>
    );
  }
}

const mapStateToProps = ({ transactions, router }) => {
  const { location } = router;
  return { fetchOptions: transactions.fetchOptions, location };
};
export default connect(mapStateToProps, actions)(TransactionRow);
