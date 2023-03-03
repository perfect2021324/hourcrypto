const mongoose = require("mongoose")

let jobTodoScheama = mongoose.Schema({
  type: {
    type: String,
    required: true,
    lowercase: true,
    default: "anonymous",
  },
  accountId: {
    type: String,
  },
  cryptoAddress: {
    type: String,
  },
  jobId: {
    type: String,
  },
  description: String,
  status: {
    type: String,
    default: "pending", // approved, rejected, taken, workdone, done,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
  current: {
    type: String,
    required: true,
  },
  coords: {
    type: {
      latitude: Number,
      longitude: Number,
    },
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  votes: {
    up: {
      type: Number,
      min: 0,
      default: 0,
    },
    down: {
      type: Number,
      min: 0,
      default: 0,
    },
    flag: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  comments: {
    type: [
      {
        comment: {
          type: String,
          required: true,
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
      },
    ],
  },
  tips: {
    type: [
      {
        amount: {
          type: Number,
          min: 0,
          required: true,
        },
        givenBy: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now(),
        },
        updatedAt: {
          type: Date,
          default: Date.now(),
        },
        status: {
          type: String,
          default: "pending",
        },
      },
    ],
    default: [],
  },
})

exports.JobTodo = mongoose.model("jobTodo", jobTodoScheama)
