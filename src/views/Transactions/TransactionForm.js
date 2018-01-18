import React, { Component } from "react";
import { Label, FormFeedback, Col, FormGroup, Button } from "reactstrap";
import InputField from "../../components/InputField/InputField";
import { Field } from "redux-form";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../../actions";
import { DropdownList, DateTimePicker } from "react-widgets";

const CategoryField = ({
  input,
  categories,
  label,
  meta: { touched, error }
}) => {
  const options = touched ? { ...input, valid: !error } : { ...input };
  return (
    <div className="form-group">
      <FormGroup row>
        <Col md="3">
          <Label htmlFor="{input.name}">{label}</Label>
        </Col>
        <Col xs="12" md="9">
          <DropdownList
            data={categories}
            filter="contains"
            textField="name"
            valueField="_id"
            groupBy="type"
            {...options}
          />
          <FormFeedback>{error}</FormFeedback>
        </Col>
      </FormGroup>
    </div>
  );
};

const DateField = ({ input, label, meta: { touched, error } }) => {
  let options = touched ? { ...input, valid: !error } : { ...input };
  return (
    <div className="form-group">
      <FormGroup row>
        <Col md="3">
          <Label htmlFor="{input.name}">{label}</Label>
        </Col>
        <Col xs="12" md="9">
          <DateTimePicker date={true} time={false} {...options} />
          <FormFeedback>{error}</FormFeedback>
        </Col>
      </FormGroup>
    </div>
  );
};

const AccountField = ({ input, label, accounts, meta: { touched, error } }) => {
  let options = touched ? { ...input, valid: !error } : { ...input };
  console.log(options);
  return (
    <div className="form-group">
      <FormGroup row>
        <Col md="3">
          <Label htmlFor="{input.name}">{label}</Label>
        </Col>
        <Col xs="12" md="9">
          <DropdownList
            data={accounts}
            filter="contains"
            textField="name"
            valueField="_id"
            groupBy="financialInstitution"
            {...options}
          />
          <FormFeedback>{error}</FormFeedback>
        </Col>
      </FormGroup>
    </div>
  );
};

const validAmount = value => {
  return undefined;
};

const required = value => (value ? undefined : "This field is required");

class TransactionForm extends Component {
  componentDidMount() {
    this.props.fetchCategories();
    this.props.fetchAccounts();
  }

  render() {
    const { editMode, handleSubmit, onSubmit, reset } = this.props;
    const { accounts, categories } = this.props;

    return (
      <form className="form-horizontal" onSubmit={handleSubmit(onSubmit)}>
        <Field
          name="date"
          label="Date (*)"
          component={DateField}
        />
        <Field
          name="accountId"
          label="Account (*)"
          component={AccountField}
          accounts={accounts}
          validate={[required]}
          parse={(value, name) => value ? value._id : undefined }
        />
        <Field
          name="name"
          label="Name (*)"
          component={InputField}
          validate={[required]}
        />
        <Field
          name="memo"
          label="Memo"
          type="textarea"
          component={InputField}
        />
        <Field
          name="amount"
          label="Amount (*)"
          component={InputField}
          validate={[required, validAmount]}
        />
        <Field
          name="categoryId"
          label="Category"
          component={CategoryField}
          categories={categories}
          parse={(value, name) => value ? value._id : undefined }
        />
        <Field
          name="info"
          label="Info (Note)"
          type="textarea"
          component={InputField}
        />

        {/* <Field
          name="linked"
          label="Linked Transaction"
          component={InputField}
        /> */}

        <Button type="submit" color="primary">
          {editMode ? "Save" : "Create"}
        </Button>
        <Button color="secondary" onClick={reset}>
          {editMode ? "Reset" : "Clear"}
        </Button>
        <Link to="/transactions">
          <Button color="danger">{editMode ? "Cancel" : "Discard"}</Button>
        </Link>
      </form>
    );
  }
}

const mapStateToProps = ({ accounts, categories }) => {
  categories = categories.categories;
  accounts = accounts.accounts;
  return {
    categories,
    accounts
  };
};

export default connect(mapStateToProps, actions)(TransactionForm);
