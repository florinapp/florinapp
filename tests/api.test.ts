import { Response } from "express";
import app from "../index";
import { db, reset } from "../db";
import * as supertest from "supertest";
import * as assert from "assert";
import { newCategory } from "../db/Category";
import { newAccount, AccountType } from "../db/Account";
import CategoryDTO from "../dtos/Category";

beforeEach(async () => {
  await reset();
});

describe("Test health endpoint", () => {
  test("health endpoint should return 200", () => {
    const request = supertest(app);
    request.get("/api/v2/healthz").expect(200, { health: "ok" });
  });
});

describe("Test seeding", () => {
  test("seeding is successful", () => {
    const request = supertest(app);
    request.post("/api/v2/seed").expect(200);
  });
});

describe("Category endpoints", () => {
  test("GET /categories: No categories", async () => {
    const request = supertest(app);
    const response = await request.get("/api/v2/categories").expect(200);
    expect(response.body).toEqual({ total: 0, result: [] });
  });

  test("GET /categories: Single category", async () => {
    db.post(newCategory("sample", "Sample Category"));
    const request = supertest(app);
    const response = await request.get("/api/v2/categories").expect(200);
    expect(response.body.total).toBe(1);
    expect(response.body.result[0].id).toBe("sample");
  });

  test("GET /categories: Nested categories", async () => {
    db.post(newCategory("automobile", "Automobile"));
    db.post(
      newCategory("automobile-insurance", "Automobile::Insurance", "automobile")
    );
    db.post(newCategory("bills", "Bills"));
    db.post(newCategory("bills-hydro", "Bills::Hydro", "bills"));
    db.post(newCategory("bills-internet", "Bills::Internet", "bills"));
    db.post(newCategory("mortgage", "Mortgage"));

    const request = supertest(app);
    const response = await request.get("/api/v2/categories").expect(200);
    const expected = [
      {
        id: "automobile",
        name: "Automobile",
        type: "EXPENSE",
        allowTransactions: true,
        subCategories: [
          {
            id: "automobile-insurance",
            name: "Automobile::Insurance",
            type: "EXPENSE",
            allowTransactions: true,
            subCategories: []
          }
        ]
      },
      {
        id: "bills",
        name: "Bills",
        type: "EXPENSE",
        allowTransactions: true,
        subCategories: [
          {
            id: "bills-hydro",
            name: "Bills::Hydro",
            type: "EXPENSE",
            allowTransactions: true,
            subCategories: []
          },
          {
            id: "bills-internet",
            name: "Bills::Internet",
            type: "EXPENSE",
            allowTransactions: true,
            subCategories: []
          }
        ]
      },
      {
        id: "mortgage",
        name: "Mortgage",
        type: "EXPENSE",
        allowTransactions: true,
        subCategories: []
      }
    ];
    expect(response.body.result).toEqual(expected);
  });
});

describe("Account endpoints", () => {
  test("GET /accounts: No accounts", async () => {
    const request = supertest(app);
    const response = await request.get("/api/v2/accounts").expect(200);
    expect(response.body).toEqual({ total: 0, result: [] });
  });

  test("GET /accounts: Multiple accounts", async () => {
    db.post(newAccount("Checking account", "TD", AccountType.CHECKING));
    db.post(newAccount("Credit card", "Tangerine", AccountType.CREDIT_CARD));
    const request = supertest(app);
    const response = await request.get("/api/v2/accounts").expect(200);
    expect(response.body.total).toEqual(2);
    expect(response.body.result.map((r: any) => r.name).sort()).toEqual([
      "Checking account",
      "Credit card"
    ]);
  });

  test("POST /accounts: minimum fields", async () => {
    const request = supertest(app);
    const response = await request
      .post("/api/v2/accounts")
      .set("Accept", "application/json")
      .send({
        name: "Awesome checking account",
        financialInstitution: "Awesome Bank",
        type: "CHECKING"
      });
    expect(response.status).toEqual(201);
    const account = response.body.result;
    expect(account).toBeDefined();
    delete account.id;
    expect(account).toEqual({
      name: "Awesome checking account",
      financialInstitution: "Awesome Bank",
      type: "CHECKING"
    });
  });

  test("POST /accounts: invalid account type", async () => {
    const request = supertest(app);
    const response = await request
      .post("/api/v2/accounts")
      .set("Accept", "application/json")
      .send({
        name: "Awesome checking account",
        financialInstitution: "Awesome Bank",
        type: "CHEQUING"
      });
    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
      type: "INVALID_ACCOUNT_TYPE",
      message: "CHEQUING is not a valid account type"
    });
  });

  test("DELETE /accounts/<id>: invalid account id", async () => {
    console.log("here");
    const request = supertest(app);
    const response = await request.delete("/api/v2/accounts/nonexistent");
    expect(response.status).toEqual(404);
    expect(response.body).toEqual({
      type: "ACCOUNT_NOT_FOUND",
      message: "Account nonexistent does not exist"
    });
  });

  test("DELETE /accounts/<id>: removes account from the database", async () => {
    await db.post(newAccount("Checking account", "TD", AccountType.CHECKING));
    const id = (await db.post(newAccount("Credit card", "Tangerine", AccountType.CREDIT_CARD))).id;
    const request = supertest(app);
    const response = await request.delete(`/api/v2/accounts/${id}`);
    expect(response.status).toEqual(200);
  });
});
