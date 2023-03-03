const mongoose = require("mongoose")

/**
 * _id === target._id (job._id, jobTodo._id)
 */

const voteSchema = mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  votes: {
    type: [
      {
        accountId: {
          type: String,
          required: true,
        },
        up: {
          type: Boolean,
          default: false,
        },
        down: {
          type: Boolean,
          default: false,
        },
        flag: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          default: Date.now(),
        },
        updatedAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
    default: [],
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

exports.Vote = mongoose.model("vote", voteSchema)
