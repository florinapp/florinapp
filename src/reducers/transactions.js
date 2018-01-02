// @flow
import * as actionTypes from "../actions/types";
import { defaultFetchOptions } from "../services/transactionService";
import * as queryString from "query-string";

const initState = {
  fetchOptions: defaultFetchOptions,
  transactions: [],
  total: null,
  loading: false,
  failed: false
};

const createFiltersFromQueryParams = (queryParams) => {
  let filters = {};
  if (queryParams["filters.dateFrom"] && queryParams["filters.dateTo"]) {
    filters["dateFrom"] = queryParams["filters.dateFrom"];
    filters["dateTo"] = queryParams["filters.dateTo"];
  } else {
    filters = defaultFetchOptions.filters;
  }
  return filters;
};

export default (state = initState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_TRANSACTIONS_SUCCEEDED:
      return {
        ...state,
        transactions: action.payload.result,
        total: action.payload.total,
        loading: false,
        failed: false
      };
    case actionTypes.FETCH_TRANSACTIONS_REQUESTED:
      return {
        ...state,
        loading: true,
        failed: false
      };
    case actionTypes.FETCH_TRANSACTIONS_FAILED:
      return {
        ...state,
        loading: false,
        failed: true
      };
    case actionTypes.UPDATE_TRANSACTION_CATEGORY_SUCCEEDED:
      const { transactionId, categoryId } = action;
      const newTransactions = [];
      state.transactions.forEach(t => {
        if (t._id === transactionId) {
          t.categoryId = categoryId;
        }
        newTransactions.push(t);
      });
      return {
        ...state,
        transactions: newTransactions
      };
    case actionTypes.DATERANGE_CHANGE_SUCCEEDED:
      const { dateRange } = action;
      return {
        ...state,
        fetchOptions: {
          ...state.fetchOptions,
          filters: {
            ...state.fetchOptions.filters,
            dateFrom: dateRange.start.format("YYYY-MM-DD"),
            dateTo: dateRange.end.format("YYYY-MM-DD")
          }
        }
      };
    case "@@router/LOCATION_CHANGE":
      const routerPayload = action.payload;
      const queryParams = queryString.parse(routerPayload.search);
      const page = parseInt(queryParams.page || "1", 10);
      const filters = createFiltersFromQueryParams(queryParams);
      return {
        ...state,
        fetchOptions: {
          ...state.fetchOptions,
          pagination: {
            ...state.fetchOptions.pagination,
            page
          },
          filters
        }
      };
    default:
      return state;
  }
};
