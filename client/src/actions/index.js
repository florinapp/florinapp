import { push } from "react-router-redux";
import * as actionCreators from "./creators";
import db from "../db";
import Account from "../models/Account";

export const fetchAccounts = () => async dispatch => {
  dispatch(actionCreators.fetchAccountsRequested());
  try {
    const response = await db.find({selector: { "metadata.type": "Account" }})
    dispatch(
      actionCreators.fetchAccountsSucceeded(response.docs)
    );
  } catch (err) {
    dispatch(
      actionCreators.showErrorNotification("Cannot fetch accounts", err)
    );
    dispatch(actionCreators.fetchAccountsFailed(err));
  }
};

export const deleteAccount = accountId => async dispatch => {
  dispatch(actionCreators.deleteAccountRequested(accountId));
  try {
    const doc = await db.get(accountId);
    await db.remove(doc);
    dispatch(actionCreators.showSuccessNotification("The account was deleted"));
    dispatch(actionCreators.deleteAccountSucceeded(accountId));
  } catch (err) {
    dispatch(
      actionCreators.showErrorNotification("Cannot delete account", err)
    );
    dispatch(actionCreators.deleteAccountFailed(err));
  }
};

export const createAccount = accountData => async dispatch => {
  try {
    const doc = {
      metadata: {
        type: "Account"
      },
      ...accountData
    };
    const response = await db.post(doc);
    dispatch(actionCreators.createAccountSucceeded(response.account));
    dispatch(push("/accounts"));
    dispatch(actionCreators.showSuccessNotification("Account created"));
  } catch (err) {
    dispatch(
      actionCreators.showErrorNotification("Account creation failed", err)
    );
    dispatch(actionCreators.createAccountFailed(err));
  }
};

export const fetchAccountById = accountId => async dispatch => {
  try {
    const account = await db.get(accountId);
    dispatch(actionCreators.fetchAccountByIdSucceeded(account));
  } catch (err) {
    dispatch(actionCreators.showErrorNotification("Failed to get account", err));
  }
};

export const updateAccount = (accountId, accountData) => async dispatch => {
  try {
    const account = {
      ...await db.get(accountId),
      ...accountData
    }
    db.put(account);
    dispatch(actionCreators.updateAccountSucceeded());
    dispatch(push("/accounts"));
    dispatch(actionCreators.showSuccessNotification("Account updated"));
  } catch (err) {
    dispatch(actionCreators.showErrorNotification("Account update failed", err));
    dispatch(actionCreators.updateAccountFailed(err));
  }
};

export const showGlobalModal = modalConfig => dispatch => {
  dispatch(actionCreators.showGlobalModal(modalConfig));
};

export const hideGlobalModal = () => dispatch => {
  dispatch(actionCreators.hideGlobalModal());
};
