import sinon from "sinon";
import { FlushThunks, Thunk } from "redux-testkit";
import { createStore, applyMiddleware } from "redux";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import db from "../db";
import reset from "../db/reset";
import * as actionCreators from "./creators";
import * as actionTypes from "./types";
import * as actions from "./index";
import Account from "../models/Account";
import Transaction from "../models/Transaction";
import reducer from "../reducers";
import { fetchAccounts } from "./index";

const mockStore = configureMockStore([thunk]);

const setup = async () => {
  await reset();
  const flushThunks = FlushThunks.createMiddleware();
  const store = createStore(reducer, applyMiddleware(flushThunks, thunk));
  return store;
};

describe("Account", () => {
  let store;

  beforeEach(async () => {
    store = await setup();
  });

  describe("fetchAccounts", () => {
    it("should set state to empty accounts when no accounts are loaded", async () => {
      await store.dispatch(actions.fetchAccounts());
      const { accounts } = store.getState();
      expect(accounts.accounts.length).toBe(0);
    });

    it("should load the accounts", async () => {
      await db.post(
        new Account({
          name: "TEST",
          financialInstitution: "TEST_FI",
          type: "CHECKING"
        })
      );
      await store.dispatch(actions.fetchAccounts());
      const { accounts } = store.getState();
      expect(accounts.accounts.length).toBe(1);
      expect(accounts.accounts[0].name).toEqual("TEST");
      expect(accounts.accounts[0].financialInstitution).toEqual("TEST_FI");
      expect(accounts.accounts[0].type).toEqual("CHECKING");
    });

    it("should signal failure when db.find fails", async () => {
      const mockDb = sinon.stub(db, "find");
      mockDb.throws();
      await store.dispatch(actions.fetchAccounts());
      const { accounts } = store.getState();
      expect(accounts.accounts.length).toBe(0);
      expect(accounts.failed).toBe(true);
      mockDb.restore();
    });
  });

  describe("deleteAccount", () => {
    it("should signal failure when account to delete does not exist", async () => {
      await store.dispatch(actions.deleteAccount("nonexistent"));
      const { notifications, accounts } = store.getState();
      expect(accounts.accounts.length).toBe(0);
      expect(notifications.length).toBe(1);
      expect(notifications[0].title).toEqual("Cannot delete account");
    });

    it("should delete the account from the store", async () => {
      const response = await db.post(
        new Account({
          name: "TEST",
          financialInstitution: "TEST_FI",
          type: "CHECKING"
        })
      );
      await store.dispatch(actions.deleteAccount(response.id));
      const { notifications, accounts } = store.getState();
      expect(accounts.accounts.length).toBe(0);
      expect(notifications.length).toBe(1);
      expect(notifications[0].title).toEqual("The account was deleted");
    });
  });

  describe("createAccount", () => {
    it("should create account", async () => {
      await store.dispatch(
        actions.createAccount(
          new Account({
            name: "TEST",
            financialInstitution: "FI",
            type: "CHECKING"
          })
        )
      );
      const { notifications } = store.getState();
      expect(notifications.length).toBe(1);
      expect(notifications[0].title).toEqual("Account created");
    });
  });

  describe("udpateAccount", () => {
    it("should update account", async () => {
      let result = await db.post(
        new Account({
          name: "TEST",
          financialInstitution: "TEST_FI",
          type: "CHECKING"
        })
      );

      await store.dispatch(
        actions.updateAccount(
          result.id,
          new Account({
            name: "TEST",
            financialInstitution: "TEST_FI",
            type: "INVESTMENT"
          })
        )
      );
      const { notifications } = store.getState();
      expect(notifications.length).toBe(1);
      expect(notifications[0].title).toEqual("Account updated");
      result = await db.get(result.id);
      expect(result.type).toEqual("INVESTMENT");
      expect(result.name).toEqual("TEST");
      expect(result.financialInstitution).toEqual("TEST_FI");
    });
  });

  describe("fetchAccountById", () => {
    it("should fetch account by id", async () => {
      const result = await db.post(
        new Account({
          name: "TEST",
          financialInstitution: "TEST_FI",
          type: "CHECKING"
        })
      );
      await store.dispatch(actions.fetchAccountById(result.id));
      const { currentAccount } = store.getState();
      expect(currentAccount.name).toEqual("TEST");
      expect(currentAccount.financialInstitution).toEqual("TEST_FI");
      expect(currentAccount.type).toEqual("CHECKING");
    });

    it("should return error when account not found", async () => {
      await store.dispatch(actions.fetchAccountById("nonexistent"));
      const { currentAccount, notifications } = store.getState();
      expect(currentAccount).toBe(null);
      expect(notifications.length).toBe(1);
      expect(notifications[0].title).toBe("Failed to get account");
    });
  });
});

describe("Transactions", () => {
  let store;

  beforeEach(async () => {
    store = await setup();
  });

  describe("fetchTransactions", async () => {
    it("should return empty when there's no transactions", async () => {
      await store.dispatch(actions.fetchTransactions());
      const { transactions } = store.getState();
      expect(transactions.transactions).toEqual([]);
    });

    it("should signal failure when db.find fails", async () => {
      const mockDb = sinon.stub(db, "find");
      mockDb.throws();
      await store.dispatch(actions.fetchTransactions());
      const { transactions } = store.getState();
      expect(transactions.loading).toBe(false);
      expect(transactions.failed).toBe(true);
      mockDb.restore();
    });

    it("should fetch associated account when possible", async () => {
      const account = await db.post(new Account());
      await db.post(
        new Transaction({
          _id: "txn1",
          date: "2017-01-01",
          accountId: account.id
        })
      );
      await db.post(new Transaction({ _id: "txn2", date: "2017-05-05" }));
      await store.dispatch(
        actions.fetchTransactions({
          orderBy: ["date", "asc"],
          pagination: { perPage: 999, page: 1 },
          filters: {}
        })
      );
      const { transactions, loading, failed } = store.getState().transactions;
      expect(loading).toBe(false);
      expect(failed).toBe(false);
      expect(transactions.length).toBe(2);
      expect(transactions[0]._id).toEqual("txn1");
      expect(transactions[0].account._id).toEqual(account.id);
      expect(transactions[1]._id).toEqual("txn2");
      expect(transactions[1].account).toBe(undefined);
    });
  });
});
