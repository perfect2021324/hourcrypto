const { model } = require("mongoose")
const { transactionDetailSchema } = require("./transactionDetail.schema")

TransactionDetail = model("transactionDetail", transactionDetailSchema)

exports.TransactionDetail = TransactionDetail
