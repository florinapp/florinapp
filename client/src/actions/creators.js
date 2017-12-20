import * as actionTypes from "./types";

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