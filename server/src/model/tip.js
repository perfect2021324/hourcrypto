const mongoose = require("mongoose")

const tipSchema = mongoose.Schema({
  jobId: {
    type: String,
    required: true,
    unique: true,
  },
  jobId: {
    type: String,
    required: true,
    unique: true,
  },
  to: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  createdAt: {
    type: Date,
    defualt: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
  status: {
    type: String,
    default: "pending",
  },
})

exports.Tip = mongoose.model("tip", tipSchema)
