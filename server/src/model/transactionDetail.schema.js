const { ObjectId } = require("mongodb")
const { Schema } = require("mongoose")
const { Account } = require("./account.model")
const { Transaction } = require("./transaction.model")

let transactionDetailSchema = new Schema({
  transId: {
    type: ObjectId,
    ref: Transaction,
    localField: "transId",
    foreignField: "_id",
    required: true,
  },
  indicator: {
    type: String,
    required: true,
    enum: ["dr", "cr"],
    lowercase: true,
  },
  _debitAccount: {
    type: ObjectId,
    ref: Account,
    localField: "_debitAccount",
    foreignField: "_id",
  },
  _creditAccount: {
    type: ObjectId,
    ref: Account,
    localField: "_creditAccount",
    foreignField: "_id",
  },
  debitAmount: {
    type: Number,
    default: 0,
    min: 0,
  },
  creditAmount: {
    type: Number,
    default: 0,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: new Date(),
    max: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
    max: new Date(),
  },
})

exports.transactionDetailSchema = transactionDetailSchema
