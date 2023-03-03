import { Account } from "./Account";

export interface TransationDetail {
    indicator: String
    _debitAccount?: Account
    _creditAccount?: Account
    debitAmount: Number
    creditAmount: Number
    createdBy: String
    createdAt?: Date
    updatedAt?: Date
}
export interface Transaction {
    _id?: String
    amount: Number
    createdBy: String
    createdAt?: Date
    updatedAt?: Date
    detail: [TransationDetail]
}