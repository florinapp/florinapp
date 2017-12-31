// @flow
import { push } from "react-router-redux";
import * as actionCreators from "./creators";
import Account from "../models/Account";
import * as transactionService from "../services/transactionService";
import * as accountService from "../services/accountService";
import * as categoryService from "../services/categoryService";
import type FetchOptions from "../services/FetchOptions";

export const fetchAccounts = () => async dispatch => {
  dispatch(actionCreators.fetchAccountsRequested());
  try {
    const accounts = await accountService.fetch();
    dispatch(actionCreators.fetchAccountsSucceeded(accounts));
  } catch (err) {
    dispatch(
      actionCreators.showErrorNotification("Cannot fetch accounts", err)
    );
    dispatch(actionCreators.fetchAccountsFailed(err));
  }
};

export const deleteAccount = (accountId: string) => async dispatch => {
  dispatch(actionCreators.deleteAccountRequested(accountId));
  try {
    await accountService.del(accountId);
    dispatch(actionCreators.showSuccessNotification("The account was deleted"));
    dispatch(actionCreators.deleteAccountSucceeded(accountId));
  } catch (err) {
    dispatch(
      actionCreators.showErrorNotification("Cannot delete account", err)
    );
    dispatch(actionCreators.deleteAccountFailed(err));
  }
};

export const createAccount = (accountData: Account) => async dispatch => {
  try {
    const account = await accountService.create(accountData);
    dispatch(actionCreators.createAccountSucceeded(account));
    dispatch(push("/accounts"));
    dispatch(actionCreators.showSuccessNotification("Account created"));
  } catch (err) {
    dispatch(
      actionCreators.showErrorNotification("Account creation failed", err)
    );
    dispatch(actionCreators.createAccountFailed(err));
  }
};

export const fetchAccountById = (accountId: string) => async dispatch => {
  try {
    const account = await accountService.fetchById(accountId);
    dispatch(actionCreators.fetchAccountByIdSucceeded(account));
  } catch (err) {
    dispatch(
      actionCreators.showErrorNotification("Failed to get account", err)
    );
  }
};

export const updateAccount = (
  accountId: string,
  accountData: Account
) => async dispatch => {
  try {
    const account = await accountService.update(accountId, accountData);
    dispatch(actionCreators.updateAccountSucceeded(account));
    dispatch(push("/accounts"));
    dispatch(actionCreators.showSuccessNotification("Account updated"));
  } catch (err) {
    dispatch(
      actionCreators.showErrorNotification("Account update failed", err)
    );
    dispatch(actionCreators.updateAccountFailed(err));
  }
};

export const showGlobalModal = modalConfig => dispatch => {
  dispatch(actionCreators.showGlobalModal(modalConfig));
};

export const hideGlobalModal = () => dispatch => {
  dispatch(actionCreators.hideGlobalModal());
};

export const importAccountStatement = (
  account: Account,
  statementFile: File
) => async dispatch => {
  dispatch(actionCreators.importAccountStatementRequested());
  try {
    const {
      numImported,
      numSkipped
    } = await transactionService.importAccountStatement(account, statementFile);
    dispatch(actionCreators.importAccountStatementSucceeded());
    dispatch(
      actionCreators.showSuccessNotification(
        "Statement import succeeded",
        `Imported: ${numImported}. Skipped ${numSkipped}`
      )
    );
  } catch (err) {
    dispatch(
      actionCreators.showErrorNotification("Statement import failed", err)
    );
    dispatch(actionCreators.importAccountStatementFailed(err));
  }
};

export const fetchTransactions = (options: FetchOptions) => async dispatch => {
  dispatch(actionCreators.fetchTransactionsRequested());
  try {
    const transactions = await transactionService.fetch(options);
    dispatch(
      actionCreators.fetchTransactionsSucceeded(transactions)
    );
  } catch (err) {
    dispatch(
      actionCreators.showErrorNotification("Cannot fetch transactions", err)
    );
    dispatch(actionCreators.fetchTransactionsFailed(err));
  }
};

export const fetchCategories = () => async dispatch => {
  dispatch(actionCreators.fetchCategoriesRequested());
  try {
    const categories = await categoryService.fetch();
    dispatch(
      actionCreators.fetchCategoriesSucceeded(categories)
    );
  } catch (err) {
    dispatch(
      actionCreators.showErrorNotification("Cannot fetch categories", err)
    );
    dispatch(actionCreators.fetchCategoriesFailed(err));
  }
}

export const updateTransactionCategory = (transactionId: string, categoryId: string) => async dispatch => {
  dispatch(actionCreators.updateTransactionCategoryRequested(transactionId, categoryId));
  try {
    await transactionService.updateCategory(transactionId, categoryId);
    dispatch(actionCreators.updateTransactionCategorySucceeded(transactionId, categoryId));
  } catch (err) {
    dispatch(actionCreators.updateTransactionCategoryFailed(transactionId, categoryId));
  }
}