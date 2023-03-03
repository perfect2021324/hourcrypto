const { Schema } = require("mongoose")
const { ObjectId } = require("mongodb")

/**
 * _id === activityId
 * _account === accountId
 */
let activitySchema = new Schema({
  _account: {
    type: ObjectId,
    required: true,
    ref: "Account",
  },
  activity: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  modelForRef: {
    type: String,
    required: true,
    enum: ["Job", "JobTodo", "Account", "Transaction", "Payment"],
  },
  _ref: {
    type: ObjectId,
    required: true,
    refPath: "modelForRef",
  },
  createdAt: {
    type: Date,
    default: global.Date.now(),
  },
  updatedAt: {
    type: Date,
    default: global.Date.now(),
  },
})

// let activitySchema = mongoose.Schema({
//     createdAt: {
//         type: Date,
//         default: Date.now()
//     },
//     updatedAt: {
//         type: Date,
//         default: Date.now()
//     },
//     jobs: {
//         type : [{
//             jobId: {
//                 type:ObjectId,
//                 required: true
//             },
//             description: String,
//             hours: {
//                 type: Number,
//                 min:0,
//                 required:true
//             },
//             status: {
//                 type: String,
//                 default:'pending'
//             },
//             createdAt: {
//                 type: Date,
//                 default: Date.now()
//             },
//             updatedAt: {
//                 type: Date,
//                 default: Date.now()
//             }
//         }],
//         default:[]
//     },
//     votes:{
//         type:[{
//             jobId: {
//                 type:ObjectId,
//                 required: true
//             },
//             up:{
//                 type:Boolean,
//                 default: false
//             },
//             down:{
//                 type:Boolean,
//                 default: false
//             },
//             flag:{
//                 type:Boolean,
//                 default: false
//             },
//             createdAt: {
//                 type: Date,
//                 default: Date.now()
//             },
//             updatedAt: {
//                 type: Date,
//                 default: Date.now()
//             },
//         }],
//         default:[]
//     },
//     tips:{
//         type: [{
//             jobId: {
//                 type: ObjectId,
//                 required:true
//             },
//             amount:{
//                 type: Number,
//                 required: true,
//                 min : 0
//             },
//             createdAt: {
//                 type: Date,
//                 defualt: new Date()
//             },
//             updatedAt:{
//                 type: Date,
//                 default: new Date()
//             },
//             status:{
//                 type: String,
//                 default: "pending"
//             }
//         }]
//     }
// })

exports.activitySchema = activitySchema
