import { db } from "../db";
import SearchResponse from "../dtos/SearchResponse";
import PostResponse from "../dtos/PostResponse";
import DeleteResponse from "../dtos/DeleteResponse";
import AccountDTO from "../dtos/Account";
import { Account, AccountType, newAccount } from "../db/Account";

export class AccountSearchRequest {}
export const search = async (
  req: AccountSearchRequest
): Promise<SearchResponse<AccountDTO>> => {
  const result = await (<any>db).find({
    selector: { "metadata.docType": "account" }
  });

  const accountDtos = result.docs.map(
    (account: Account) => new AccountDTO(account)
  );
  return new SearchResponse<AccountDTO>(accountDtos);
};

export class AccountPostRequest {
  name: string;
  financialInstitution: string;
  type: AccountType;
  constructor(name: string, financialInstitution: string, type: AccountType) {
    this.name = name;
    this.financialInstitution = financialInstitution;
    this.type = type;
  }

  validate() {
    ["type", "financialInstitution", "name"].forEach((field: string) => {
      // @ts-ignore
      if (this[field] === undefined) {
        throw { type: "REQUIRED_FIELD", message: `${field} is a required field` };
      }
    });
    if (!(this.type in AccountType)) {
      throw {
        type: "INVALID_ACCOUNT_TYPE",
        message: `${this.type} is not a valid account type`
      };
    }
  }
}
export const post = async (
  req: AccountPostRequest
): Promise<PostResponse<AccountDTO>> => {
  const postResult = await db.post(
    newAccount(req.name, req.financialInstitution, req.type)
  );
  const getResult = await db.get(postResult.id);
  // @ts-ignore
  return new PostResponse(new AccountDTO(<Account>getResult));
};

export class AccountDeleteRequest {
  accountId: string;
  constructor(accountId: string) {
    this.accountId = accountId;
  }
}

export const del = async (
  req: AccountDeleteRequest
): Promise<DeleteResponse> => {
  const doc = await db.get(req.accountId);
  await db.remove(doc);
  return new DeleteResponse();
};