const { RequiredError } = require("../error/common.error")
const { AccountNotFoundError } = require("../error/account.error")
const { AmountNilError, AmountNegative } = require("../error/transaction.error")
const { Account } = require("../model/account.model")
const mongoose = require("mongoose")
const { Query, Document, Schema } = mongoose
const { ObjectId } = require("mongodb")
const { Activity } = require("../model/activity.model")
const _ = require("lodash")
const { TransactionDetail } = require("../model/transactionDetail.model")

// keep password separate
/**
 *
 * @param {cryptoAddress: Crypto Address}
 * @param {_id: Account ID}
 * @returns accountDocument
 */
let findAccountDetails = async ({
  cryptoAddress,
  firstName,
  lastName,
  displayName,
  displayPicture,
  ssn,
  createdAt,
  updatedAt,
}) => {
  let account = await findAccount({
    cryptoAddress,
    firstName,
    lastName,
    displayName,
    displayPicture,
    ssn,
    createdAt,
    updatedAt,
  })
  // fetching balance
  let wallet = await getBalance(account)
  account = { wallet, ...account }
  return account
}

/**
 *
 * @param {_id: Account ID}
 * @returns accountDocument
 */
let findAccountDetailsById = async (_id, projection) => {
  let account = await findAccountById(_id, projection)
  // fetching balance
  let wallet = await getBalance(account)
  account = { wallet, ...account }
  return account
}

/**
 *
 * @param {cryptoAddress: Crypto Address}
 * @param {_id: Account ID}
 * @returns accountDocument
 */
let findAccount = async (
  {
    email,
    cryptoAddress,
    status = "active",
    firstName,
    lastName,
    displayName,
    displayPicture,
    ssn,
    createdAt,
    updatedAt,
  },
  projection = {}
) => {
  let account = {}
  let where = {}
  // mongoose.set("debug", true)
  where = _.chain({
    email,
    cryptoAddress,
    status,
    firstName,
    lastName,
    displayName,
    displayPicture,
    ssn,
    createdAt,
    updatedAt,
  })
    .omitBy(_.isUndefined)
    .value()
  if (where !== {})
    account = await Account.findOne(where, projection).lean().exec()
  // if (!(account && account !== {})) throw new AccountNotFoundError()
  return account
}

/**
 *
 * @param email
 * @param cryptoAddress
 * @param status
 * @param firstName
 * @param lastName
 * @param displayName
 * @param ssn
 * @param createdAt
 * @param updatedAt
 * @returns All the account related details
 * @description populates activities
 */
let findAccountAndPopulate = async (
  {
    email,
    cryptoAddress,
    status = "active",
    firstName,
    lastName,
    displayName,
    displayPicture,
    ssn,
    createdAt,
    updatedAt,
  },
  projection = {}
) => {
  let account = {}
  let where = {}
  // mongoose.set("debug", true)
  where = _.chain({
    email,
    cryptoAddress,
    status,
    firstName,
    lastName,
    displayName,
    displayPicture,
    ssn,
    createdAt,
    updatedAt,
  })
    .omitBy(_.isUndefined)
    .value()
  if (where !== {})
    account = await Account.findOne(where, projection)
      .populate("activities")
      .lean()
      .exec()
  if (!(account && account !== {})) throw new AccountNotFoundError()
  return account
}

/**
 * @description fetches system account
 * @returns SYSTEM
 */
const getSystemAccount = async () => {
  const cryptoAddress = "SYSTEM"
  return await findAccount({ cryptoAddress })
}

/**
 *
 * @param account
 * @returns balance =  totalCredit - totalDebit
 * @description calcutates balance by adding and subtracting debits and credits
 */

let getBalance = async (account) => {
  if (!account && !_.isEmpty(account)) throw new RequiredError(["account"])
  let debit = await TransactionDetail.aggregate([
    {
      $match: {
        _debitAccount: account._id,
        indicator: "dr",
      },
    },
    { $group: { _id: null, amount: { $sum: "$debitAmount" } } },
    { $project: { _id: 0, amount: 1 } },
  ]).exec()

  let credit = await TransactionDetail.aggregate([
    {
      $match: {
        _creditAccount: account._id,
        indicator: "cr",
      },
    },
    { $group: { _id: null, amount: { $sum: "$creditAmount" } } },
    { $project: { _id: 0, amount: 1 } },
  ]).exec()
  debit = debit[0]?.amount ?? 0
  credit = credit[0]?.amount ?? 0 // can not substract from undefind
  balance = credit - debit
  return balance
}

/**
 * @requires email, password, cryptoaddress
 * @param email, password, cryptoAddress, firstName, lastName, displayName, displayPicture, ssn, createdAt, updatedAt
 * @returns account
 * @description creates an new account
 */
const createAccount = async ({
  email,
  password,
  cryptoAddress,
  firstName,
  lastName,
  displayName,
  displayPicture,
  ssn,
  createdAt,
  updatedAt,
}) => {
  const account = new Account(
    _.chain({
      email,
      password,
      cryptoAddress,
      firstName,
      lastName,
      displayName,
      displayPicture,
      ssn,
      createdAt,
      updatedAt
    })
      .omitBy(_.isUndefined)
      .value()
  )
  return await account.save()
}

/**
 *
 * @param _id account id
 * @param projection
 * @returns  account
 */
const findAccountById = async (_id, projection = {}) => {
  let account = {}
  if (_id) account = await Account.findById(_id, projection).lean().exec()
  return account
}

exports.getSystemAccount = getSystemAccount
exports.getBalance = getBalance
exports.createAccount = createAccount
exports.findAccount = findAccount
exports.findAccountById = findAccountById
exports.findAccountDetails = findAccountDetails
exports.findAccountDetailsById = findAccountDetailsById
exports.findAccountAndPopulate = findAccountAndPopulate
