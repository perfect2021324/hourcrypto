const { Router, request } = require("express")
const { TransactionFailedError } = require("../error/transaction.error")
const { canActivate } = require("../middleware/auth.middleware")
const { Transaction } = require("../model/transaction.model")
const { Account } = require("../model/account.model")
const {
  makeTransaction,
  getTheBalanceOfAccount,
  getTrasactionDetails,
} = require("../service/transaction.service")
const {
  findAccountDetails,
  findAccount,
} = require("../service/account.service")
const { RequiredError } = require("../error/common.error")
const {
  controllerTerminator,
} = require("../middleware/controllerTerminator.middleware")
const { ObjectId } = require("mongodb")
const { ApiResponse } = require("../model/common/ApiResponse")
const { TransactionDetail } = require("../model/transactionDetail.model")
const { transferValidator } = require("../validator/transfer.validator")
const { AccountNotFoundError } = require("../error/account.error")

let transactionRouter = Router()

/**
 * @description transfers amount
 * @param amount amount to be transfered
 * @param debitAccount cryptoAddress to be debited
 * @param creditAccount cryptoAdress to be created
 * @param createdBy
 * @returns Transaction
 */
transactionRouter.post(
  "/",
  async (req, res, next) => {
    const { fields } = req
    let transaction = {}
    let input = {}
    try {
        input = await transferValidator.validateAsync({
        amount: fields.amount,
        creditAccount: fields.creditAccount,
        debitAccount: fields.debitAccount,
        createdBy: fields.createdBy
      })
    } catch (err) {
      next(new ApiResponse({}, 400, "Transfer failed!"))
    }

    try {
      const amount = input.amount
      const debitAccount = await findAccount({
        cryptoAddress: input.debitAccount,
      })
      const creditAccount = await findAccount({
        cryptoAddress: input.creditAccount,
      })
      const createdBy = input.createdBy
    
      let trans = await makeTransaction({
        type: "transfer",
        description: "transfer for now",
        amount: amount,
        debitAccount: debitAccount,
        creditAccount: creditAccount,
        createdBy: createdBy,
      })

      if (!trans?._id) throw new TransactionFailedError()
      next(new ApiResponse(trans, 200, "Transfer successfull"))
    } catch (err) {
      if(err instanceof AccountNotFoundError) next(new ApiResponse({}, 400, "Account does not exist"))
      else if(err instanceof TransactionFailedError) next(new ApiResponse({}, 400, "Transaction failed"))
      else next(err)
    }
    return
  },
  controllerTerminator
)

/**
 * @description fetches list of transaction details sorted by latest to oldest
 * @returns [TransactionDetails]
 */
transactionRouter.get(
  "/",
  canActivate,
  async (req, res, next) => {
    const { CURRENTUSERID } = req
    let transactions = {}
    try {
      let transactions = await getTrasactionDetails(CURRENTUSERID)
      next(transactions)
    } catch (err) {
      next(err)
    }
    return
  },
  controllerTerminator
)

exports.transactionRouter = transactionRouter
