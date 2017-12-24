import * as actionTypes from "./types";
import { success, error } from "react-notification-system-redux";

export const showSuccessNotification = (msg) => {
  return success({
    title: msg,
    autoDismiss: 5
  });
};

export const showErrorNotification = (msg, err) => {
  return error({
    title: msg,
    message: `${err.toString()}`,
    autoDismiss: 0
  });
};

export const showGlobalModal = modalConfig => {
  // For available modalConfig keys see reducers/ui.js
  // TODO: extract modalConfig as a class
  return {
    type: actionTypes.SHOW_GLOBAL_MODAL,
    config: modalConfig
  };
};

export const hideGlobalModal = () => {
  return {
    type: actionTypes.HIDE_GLOBAL_MODAL
  };
};

export const fetchAccountsRequested = () => {
  return {
    type: actionTypes.FETCH_ACCOUNTS_REQUESTED
  };
};

export const fetchAccountsSucceeded = payload => {
  return {
    type: actionTypes.FETCH_ACCOUNTS_SUCCEEDED,
    payload
  };
};

export const fetchAccountsFailed = error => {
  return {
    type: actionTypes.FETCH_ACCOUNTS_FAILED,
    error
  };
};

export const deleteAccountRequested = accountId => {
  return {
    type: actionTypes.DELETE_ACCOUNT_REQUESTED,
    accountId
  };
};

export const deleteAccountSucceeded = accountId => {
  return {
    type: actionTypes.DELETE_ACCOUNT_SUCCEEDED,
    accountId
  };
};

export const deleteAccountFailed = error => {
  return {
    type: actionTypes.DELETE_ACCOUNT_FAILED,
    error
  };
};

export const createAccountSucceeded = account => {
  return {
    type: actionTypes.CREATE_ACCOUNT_SUCCEEDED,
    account
  };
};

export const createAccountFailed = error => {
  return {
    type: actionTypes.CREATE_ACCOUNT_FAILED,
    error
  }
}

export const fetchAccountByIdSucceeded = account => {
  return {
    type: actionTypes.FETCH_ACCOUNT_BY_ID_SUCCEEDED,
    account
  }
}

export const updateAccountSucceeded = () => {
  return {
    type: actionTypes.UPDATE_ACCOUNT_SUCCEEDED
  }
};

export const updateAccountFailed = () => {
  return {
    type: actionTypes.UPDATE_ACCOUNT_FAILED,
    error
  }
}