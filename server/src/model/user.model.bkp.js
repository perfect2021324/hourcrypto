const mongoose = require("mongoose")

let accountSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  cryptoAddress: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    default: "active",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
})

exports.Account = mongoose.model("account", accountSchema)
