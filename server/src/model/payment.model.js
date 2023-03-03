const { ObjectId } = require("mongodb")
const mongoose = require("mongoose")
const { Account } = require("./account.model")

let paymentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    lowercase: true,
  },
  patner: {
    type: String,
    required: true,
    lowercase: true,
  },
  indicator: {
    type: String,
    required: true,
    enum: ["in", "out"],
    lowercase: true,
  },
  status: {
    type: String,
  },
  patnerInfo: {
    type: {
      payment: {
        type: {
          paymentId: {
            type: String,
            required: true,
          },
          description: "",
          message: "",
          total_amount: {
            type: Number,
            required: true,
            min: 0,
          },
        },
        required: true,
      },
      client: {
        type: {
          clientId: "",
          email: "",
          clientName: "",
        },
        required: true,
      },
    },
    // required: true
  },
  items: [
    {
      name: {
        type: String,
      },
      sku: {
        type: String,
      },
      quanity: {
        type: Number,
        min: 1,
        default: 1,
      },
      currency: {
        type: String,
        default: "usd",
        lowercase: true,
      },
      amount: {
        type: Number,
        min: 0,
      },
    },
  ],
  currency: {
    type: String,
    default: "usd",
    lowercase: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
  createdBy: {
    type: String,
    required: true,
  },
  _creditAccount: {
    type: ObjectId,
    ref: Account,
    localField: "_creditAccount",
    foreignField: "_id",
  },
  _debitAccount: {
    type: ObjectId,
    ref: Account,
    localField: "_debitAccount",
    foreignField: "_id",
  },
})

// let stagedPaymentSchema = new mongoose.Schema({
//     type:{
//         type: String,
//         required: true
//     },
//     mode:{
//         type: String,
//         required: true
//     },
//     indicator: {
//         type: String,
//         required: true,
//         enum: ["in", "out"],
//         lowercase: true
//     },
//     status: {
//         type: String,
//         default: "created"
//     },
//     cryptoAddress:{
//         type: String,
//     },
//     description: "",
//     message: "",
//     items: [
//         {
//             name: "",
//             sku: "",
//             quanity: {
//                 type: Number,
//                 min: 1,
//                 default: 1
//             },
//             currency:{
//                 type: String,
//                 default: "usd",
//                 lowercase: true
//             },
//             amount: {
//                 type: Number,
//                 min:0
//             }
//         }
//     ],
//     currency:{
//         type: String,
//         default: "usd",
//         lowercase: true
//     },
//     amount: {
//         type: Number,
//         required: true,
//         min: 0
//     },
//     createdAt: {
//         type: Date,
//         default: new Date()
//     },
//     updatedAt: {
//         type: Date,
//         default: new Date()
//     },
//     createdBy: {
//         type: String,
//         required: true
//     },
// })

const Payment = mongoose.model("payment", paymentSchema)
// const StagedPayment = mongoose.model("stagedPayment", stagedPaymentSchema)

exports.Payment = Payment
// exports.StagedPayment = StagedPayment
