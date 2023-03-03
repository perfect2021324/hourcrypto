const { ObjectId } = require("mongodb")
const mongoose = require("mongoose")
const { Account } = require("./account.model")

let jobScheama = mongoose.Schema({
  _account: {
    type: ObjectId,
    ref: Account,
    localField: "_account",
    foreignField: "_id",
    required: true,
  },
  description: String,
  hours: {
    type: Number,
    min: 0,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
  endAt: {
    type: Date,
    default: new Date(),
  },
  proofOfWork: {
    before: {
      type: String,
      required: true,
    },
    after: {
      type: String,
      required: true,
    },
  },
  coords: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  address: {
    type: String,
    required: true,
  },
  votes: {
    up: {
      type: [ObjectId],
      ref: Account,
      foreignField: "_id",
      default: [],
    },
    down: {
      type: [ObjectId],
      ref: Account,
      foreignField: "_id",
      default: [],
    },
    flag: {
      type: [ObjectId],
      ref: Account,
      foreignField: "_id",
      default: [],
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
        _account: {
          type: ObjectId,
          ref: Account,
          localField: "_account",
          foreignField: "_id",
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
    select: false,
  },
})

exports.jobScheama = jobScheama
