const mongoose = require("mongoose")
const { transactionSchema } = require("./transaction.schema")

Transaction = mongoose.model("transaction", transactionSchema)

exports.Transaction = Transaction
