const debug = require("debug")
const mongoose = require("mongoose")
const _ = require("lodash")
const { Job } = require("../model/job.model")
const { Transaction } = require("../model/transaction.model")
const { getSystemAccount } = require("./account.service")
const { findJobByIdAndPopulate, findJobById } = require("./job.service")
const { RequiredError } = require("../error/common.error")
const { getBalance } = require("./account.service")
const { NotEnoughBalanceError } = require("../error/transaction.error")
const { TransactionDetail } = require("../model/transactionDetail.model")
const { ObjectId } = require("mongodb")

dJobTim = debug("jobsTimer")

const JOB_PENDING_TIMER_INTERVAL_IN_MIN =
  process.env.JOB_PENDING_TIMER_INTERVAL_IN_MIN

/**
 * @description Settles pending jobs for every JOB_PENDING_TIMER_INTERVAL_IN_MIN from environment variable
 */
let activatePendingJobsTimer = () => {
  intervalId = setInterval(async () => {
    let session = await mongoose.startSession()
    try {
      console.count("activatePendingJobsTimer")
      let pendingJobs = await Job.find({
        status: "pending",
        endAt: {
          $lte: new Date(),
        },
      })
      dJobTim(pendingJobs)
      for (const job of pendingJobs) {
        session.startTransaction()
        await settleJob(session, job?._id)
      }
    } catch (err) {
      console.error(err)
      await session.endSession()
    }
  }, Number.parseFloat(JOB_PENDING_TIMER_INTERVAL_IN_MIN) * 60 * 1000) // pending timer in secs
}
dTr = debug("trans")

/**
 *
 * @requires input type, description, amount, (payment or debitAccount or creditAcount), createdBy
 * @param type transfer, job, tip, bonus
 * @param mode @default internal, paypal
 * @param indicator @default within, in or out
 * @param payment
 * @param description validates amount, debitAccount, creditAccount and makes transaction
 * @param amount amount to be transfered
 * @param debitAccount Account to be debited -- validates _id
 * @param creditAccount Acount to be credited -- validates _id
 * @param createdBy email or 'SYSTEM'
 * @param createdAt
 * @returns transaction
 */
let makeTransaction = async (input) => {
  //input = transactionValidator.validate(input)
  // dTr(`make Transaction input`)
  if (input) dTr(JSON.stringify(input))

  let {
    type,
    mode,
    indicator,
    payment,
    description,
    amount,
    debitAccount,
    creditAccount,
    createdBy,
    createdAt,
  } = input

  if (!type) throw new RequiredError("type")
  if (!description) throw new RequiredError("description")
  if (!amount) throw new RequiredError("amount")
  if (!createdBy) throw new RequiredError("createdBy")

  if (!indicator || indicator === "within") {
    if (!debitAccount?._id) throw new RequiredError("debitAccount")
    if (!creditAccount?._id) throw new RequiredError("creditAccount")
    let balance = await getBalance(debitAccount)
    if (!(balance && balance > amount)) throw new NotEnoughBalanceError()
  }
  if (indicator && indicator === "in") {
    if (!payment?._id) throw new RequiredError("payment")
    creditAccount = payment._creditAccount
    debitAccount = payment._debitAccount
    if (!creditAccount?._id) throw new RequiredError("creditAccount")
  }
  if (indicator && indicator === "out") {
    if (!payment?._id) throw new RequiredError("payment")
    creditAccount = payment._creditAccount
    debitAccount = payment._debitAccount
    if (!debitAccount?._id) throw new RequiredError("debitAccount")
    let balance = await getBalance(debitAccount)
    if (!(balance && balance > amount)) throw new NotEnoughBalanceError()
  }

  if (createdAt && !_.isDate(createdAt)) createdAt = undefined

  let transDoc = {
    type: type,
    mode: mode,
    indicator: indicator,
    _payment: payment?._id,
    description: description,
    amount: amount,
    createdBy: createdBy,
  }

  if (createdAt && _.isDate(createdAt)) transDoc = { createdAt, ...transDoc }
  await Transaction.createCollection()
  let transaction = await Transaction.create(transDoc)

  if (transaction?._id) {
    let detailDoc = [
      {
        transId: transaction._id,
        indicator: "dr",
        _debitAccount: debitAccount?._id,
        _creditAccount: creditAccount?._id,
        debitAmount: indicator === "in" ? 0 : amount,
        creditAmount: 0,
      },
      {
        transId: transaction._id,
        indicator: "cr",
        _debitAccount: debitAccount?._id,
        _creditAccount: creditAccount?._id,
        debitAmount: 0,
        creditAmount: indicator === "out" ? 0 : amount,
      },
    ]

    if (createdAt && _.isDate(createdAt)) {
      detailDoc[0].createdAt = createdAt
      detailDoc[1].createdAt = createdAt
    }
    await TransactionDetail.createCollection()
    await TransactionDetail.insertMany(detailDoc)
  }
  console.debug(`transactionid: ${transaction?._id}`)
  return transaction
}

/**
 * @description settles a Tip
 */
let settleTip = async (jobId) => {
  if (!jobId) return
  let job = await Job.findById(jobId, { tips: 1 })
    .populate("_account")
    .populate("tips")
    .lean()
    .exec()
  if (!(job && job?._id && job._account?._id)) {
    return
  }
  if (!job?.tips && job.tips === []) return
  const tipList = job.tips
  const creditAccount = job._account
  const createdBy = "SYSTEM"
  for (const tip of tipList) {
    if (!(tip?._account?._id && tip?.amount && tip.amount > 0)) continue
    const amount = tip.amount
    const debitAccount = tip._account
    let trans
    try {
      trans = await makeTransaction({
        type: "tip",
        description: "you have been tipped",
        amount: amount,
        debitAccount: debitAccount,
        creditAccount: creditAccount,
        createdBy: createdBy,
        createdAt: job.createdAt
      })
    } catch (err) {
      console.error(err)
    }
    if (!trans?._id) {
      await Job.findOneAndUpdate(
        { "_id": jobId, "tips._account": debitAccount._id },
        { $set: { "tips.$.status": "failed" } }
      )
    }
    if (trans?._id) {
      await Job.findOneAndUpdate(
        { "_id": jobId, "tips._account": debitAccount._id },
        { $set: { "tips.$.status": "done" } }
      )
    }
  }
}


/**
 * @description Settles appreciation vote, majority wins
 * @param {*} jobId
 */
let appreciationForVote = async (jobId) => {
  if (!jobId) return
  let job = await findJobByIdAndPopulate(jobId)
  if (!(job && job?._id)) {
    return
  }
  const appreciation = job.votes.up.length - job.votes.down.length
  let mostvoter = []
  let lessVoters = [];
  if (appreciation > 0){
    mostvoter = job.votes.up
    lessVoters= job.votes.down
  }else if (appreciation < 0) {
    mostvoter = job.votes.down
    lessVoters= job.votes.up

  }else {
    
  }
  
  // if (appreciation == 0) mostvoter = [...job.votes.up, ...job.votes.down]
 
  const debitAccount = await getSystemAccount()
  const createdBy = "SYSTEM"
  if(appreciation != 0) {
    for (const voter of mostvoter) {
      if (!voter?._id) continue
      const amount = 2
      let trans
  
  
  
      try {
        trans = await makeTransaction({
          type: "bonus",
          description: "appreciation for the vote",
          amount: amount,
          debitAccount: debitAccount,
          creditAccount: voter,
          createdBy: createdBy,
          createdAt: job.createdAt
        })
      } catch (err) {
        console.error(err)
      }
    }
    for (const voter of lessVoters) {
      if (!voter?._id) continue
      const amount = 0.167
      let trans
  
  
  
      try {
        trans = await makeTransaction({
          type: "bonus",
          description: "appreciation for the vote",
          amount: amount,
          debitAccount: debitAccount,
          creditAccount: voter,
          createdBy: createdBy,
          createdAt: job.createdAt
        })
      } catch (err) {
        console.error(err)
      }
    }
  }
}


/**
 * @description Settles a jobs
 * @param {*} session 
 * @param {*} jobId 
 */
let settleJob = async (session, jobId) => {
  try {
    if (!jobId) return
    const job = await findJobByIdAndPopulate(jobId)
    if (!(job._account?._id && job?.hours && job?.hours > 0)) {
      await Job.findByIdAndUpdate(job._id, { $set: { status: "failed" } })
      return
    }

    const amount = job.hours
    const debitAccount = await getSystemAccount()
    const creditAccount = job._account
    const createdBy = "SYSTEM"

    const appreciation = job.votes.up.length - job.votes.down.length

    // if appreciation > 0 make the makeTransaction 
    if (appreciation > 0) {
      let trans = await makeTransaction({
        type: "job",
        description: "great job",
        amount: amount,
        debitAccount: debitAccount,
        creditAccount: creditAccount,
        createdBy: createdBy,
        createdAt: job.createdAt
      })
      if (!trans?._id) {
        await session.abortTransaction()
        session.startTransaction()
        console.debug(`job: ${jobId} failed`)
        await Job.findByIdAndUpdate(job._id, { $set: { status: "failed" } })
      }
      if (trans?._id) {
        try {
          await settleTip(job._id)
        } catch (err) {
          console.debug(err)
        }
        // job done
        await Job.findByIdAndUpdate(job._id, { $set: { status: "done" } })
      }

    }

    // appreciate the voters
    try {
      await appreciationForVote(job._id)
    } catch (err) {
      console.debug(err)
    }

    await session.commitTransaction()
  } catch (err) {
    console.error(err)
    await session.abortTransaction()
  }
}

/**
 * @description fetches latest trasaction details
 * @param {*} accountId 
 * @returns 
 */
let getTrasactionDetails = async (accountId) => {

  let transactions = await TransactionDetail.find({
    $or: [
      {
        _debitAccount: ObjectId(accountId),
        indicator: "dr",
        debitAmount: { $gt: 0 },
      },
      {
        _creditAccount: ObjectId(accountId),
        indicator: "cr",
        creditAmount: { $gt: 0 },
      },
    ],
  })
    .sort({ createdAt: -1, updatedAt: -1 })
    .populate("_debitAccount")
    .populate("_creditAccount")
    .limit(10)

  return transactions
}

exports.activatePendingJobsTimer = activatePendingJobsTimer
exports.makeTransaction = makeTransaction
exports.getTrasactionDetails = getTrasactionDetails
