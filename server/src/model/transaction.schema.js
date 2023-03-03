const { ObjectId } = require("mongodb")
const { Schema } = require("mongoose")
const { Payment } = require("./payment.model")

let transactionSchema = new Schema({
  type: {
    type: String,
    required: true,
    lowercase: true,
  },
  mode: {
    type: String,
    default: "internal",
    lowercase: true,
  },
  indicator: {
    type: String,
    enum: ["in", "out", "within"],
    lowercase: true,
    default: "within",
  },
  _payment: {
    type: ObjectId,
    ref: Payment,
    localField: "_payment",
    foreignField: "_id",
  },
  description: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    default: "",
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  createdBy: {
    type: String,
    required: true,
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

exports.transactionSchema = transactionSchema
