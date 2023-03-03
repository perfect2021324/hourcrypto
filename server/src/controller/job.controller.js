const express = require("express")
const { Schema } = require("mongoose")
const { ObjectId } = require("mongodb")

const fs = require("fs").promises
const process = require("process")
const path = require("path")

const { Job } = require("../model/job.model")
const { Activity } = require("../model/activity.model")
const {
  saveProofOfWork,
  jobCreationHandler,
} = require("../middleware/job.middleware")
const { attachImageToJob } = require("../util/image.util")
const { canActivate } = require("../middleware/auth.middleware")
const { constants } = require("../constants/common.constants")
const { createActivity } = require("../service/activity.service")
const { BaseError } = require("../error/base.error")
const {
  controllerTerminator,
} = require("../middleware/controllerTerminator.middleware")
const {
  findJobs,
  updateJobById,
  findJobById,
} = require("../service/job.service")
const { JobAttachImage, JobNotFoundError } = require("../error/job.error")
const { ApiResponse } = require("../model/common/ApiResponse")
const _ = require("lodash")
const { DoNothingError, RequiredError } = require("../error/common.error")

jobRouter = express.Router()

const CRYPTO_STORE = process.env.CRYPTO_STORE

/**
 * @function canActivate Authenticates user
 * @function saveProofOfWork saves images to files system
 * @function jobCreationHandler creates the job
 * @function controllerTerminator handles response
 * @description creates job
 */
jobRouter.post(
  "/",
  canActivate,
  saveProofOfWork,
  jobCreationHandler,
  controllerTerminator
)

/**
 * @description changes status
 * @param jobId job id
 * @param status status to which to be changed
 */
jobRouter.patch(
  "/status",
  async (req, res, next) => {
    const { fields } = req
    if (!(fields?.jobId && fields?.status)) {
      next(new RequiredError(["jobId", "staus"]))
    }
    const { jobId, status } = fields
    try {
      let job = await Job.findById(jobId)
      if (!job) {
        next(new JobNotFoundError())
        return
      }

      const activity = await createActivity({
        accountId: CURRENTUSERID,
        activityName: constants.ACTIVITY_JOB_STATUS_CHANGED,
        modelName: "Job",
        modelDocumentId: jobId,
        description: `your job ${jobId} status changed to ${status}`,
      })
      job = await Job.findByIdAndUpdate(jobId, { $set: { status: status } })
      job = await Job.findById(jobId)
      job = attachImageToJob(job)
      next(job)
    } catch (err) {
      next(err)
    }
    return
  },
  controllerTerminator
)

/**
 * @description finds all jobs
 * @param status status to which to be changed
 */
jobRouter.post(
  "/all",
  async (req, res, next) => {
    const { fields } = req
    const {userId, filter, totalRecords} = fields
    let filterDoc = {}
    if(userId && userId !== "u") filterDoc = {...filterDoc, ...{_account: ObjectId(userId)}}
    switch(filter){
      case "settled": filterDoc = {...filterDoc, ...{status: "done"}}
      break
      case "unsettled": filterDoc = {...filterDoc, ...{status: "pending"}}
      break
    }
    try {
      let jobs = await findJobs(filterDoc, {}, { createdAt: -1, endAt: -1 },  totalRecords?? 10)
      for (let i in jobs) {
        try {
          jobs[i] = await attachImageToJob(jobs[i])
        } catch (err) {
          next(err)
        }
      }
      next(jobs)
    } catch (err) {
      next(err)
    }
  },
  controllerTerminator
)

/**
 * @description current user jobs
 * @returns jobs
 */
jobRouter.get(
  "/currentaccount/all",
  canActivate,
  async (req, res, next) => {
    const { query } = req
    let filter = {}
    if (req.CURRENTUSERID) {
      filter._account = req.CURRENTUSERID
    }
    Object.entries(query).forEach((entry) => {
      if (entry && entry[0] && entry[1]) {
        switch (entry[0]) {
          case "status":
            filter.status = entry[1]
            break
          default:
            null
        }
      }
    })
    try {
      let jobs = await Job.find(filter, { tips: 0 }).sort({ endAt: -1 })
      for (let i in jobs) {
        try {
          jobs[i] = await attachImageToJob(jobs[i])
        } catch (err) {
          next(err)
        }
      }
      next(jobs)
    } catch (err) {
      next(err)
    }
    return
  },
  controllerTerminator
)

/**
 * @description gets a job by id
 * @param _id job id
 * @returns job
 */
jobRouter.get(
  "/",
  async (req, res, next) => {
    const { query } = req
    let filter = {}
    if (!query?._id) {
      next(new Error())
    }
    Object.entries(query).forEach((entry) => {
      if (entry && entry[0] && entry[1]) {
        switch (entry[0]) {
          case "_id":
            filter._id = entry[1]
            break
          case "accountId":
            filter.accountId = entry[1]
            break
          default:
            null
        }
      }
    })
    if (query._id) {
      try {
        let job = await Job.findOne(filter)
        job = await attachImageToJob(job)
        next(job)
      } catch (err) {
        next(err)
      }
    }
    return
  },
  controllerTerminator
)

/**
 * @description delete a job
 * @returns job
 */
jobRouter.delete(
  "/",
  canActivate,
  async (req, res, next) => {
    const { fields } = req
    if (!fields._id) {
      next(new Error())
      return
    }
    const filter = { _id: ObjectId(fields._id) }
    try {
      let job = await Job.findByIdAndDelete(filter)
      let attached = await attachImageToJob(job)
      const item = path.join(CRYPTO_STORE, fields._id)
      fs.rm(item, { recursive: true })
      next(attached)
    } catch (err) {
      next(err)
    }
    return
  },
  controllerTerminator
)

/**
 * @description up vote on a job
 * @returns job
 */
jobRouter.patch(
  "/vote/up",
  canActivate,
  async (req, res, next) => {
    const { fields } = req
    if (!fields?._id) {
      next(new BaseError())
      return
    }
    const CURRENTUSERID = req.CURRENTUSERID
    // accountId should be from session
    try {
      let job = await Job.findById(fields._id)
      if (job.accountId === CURRENTUSERID) {
        throw new DoNothingError()
      }

      let isUserVoted =
        _.chain(job.votes.up).map(_.toString).includes(CURRENTUSERID).value() ||
        _.chain(job.votes.down).map(_.toString).includes(CURRENTUSERID).value() ||
        _.chain(job.votes.flag).map(_.toString).includes(CURRENTUSERID).value()

      if (isUserVoted) throw new DoNothingError(200, "You voted on this job")

      job.votes.up.push(CURRENTUSERID)
      job = await job.save()

      // logging activity
      let activity = await createActivity(
        {
          accountId: CURRENTUSERID,
          activityName: constants.ACTIVITY_VOTE_UP,
          modelName: "Job",
          modelDocumentId: job._id,
          description: `You have up voted a job ${job._id} at ${Date.now()}`,
        },
        new BaseError("JobVoteError")
      )

      job = await findJobById(fields._id) // to get updated job
      let attached = await attachImageToJob(job) // attach the image by url
      next(new ApiResponse(attached, 200, constants.JOB_VOTE_SUCCESS))
    } catch (err) {
      if (err instanceof DoNothingError) {
        job = await findJobById(fields._id) // to get updated job
        let attached = await attachImageToJob(job) // attach the image by url
        next(new ApiResponse(attached, err.errorCode, err.errorMessage))
      } else next(err)
    }
    return
  },
  controllerTerminator
)

/**
 * @description down vote on a job
 * @returns job
 */
jobRouter.patch(
  "/vote/down",
  canActivate,
  async (req, res, next) => {
    const { fields } = req
    if (!fields?._id) {
      next(new BaseError())
      return
    }
    const CURRENTUSERID = req.CURRENTUSERID
    // accountId should be from session
    try {
      let job = await Job.findById(fields._id)
      if (job.accountId === CURRENTUSERID) {
        throw new DoNothingError()
      }

      let isUserVoted =
        _.chain(job.votes.up).map(_.toString).includes(CURRENTUSERID).value() ||
        _.chain(job.votes.down).map(_.toString).includes(CURRENTUSERID).value() ||
        _.chain(job.votes.flag).map(_.toString).includes(CURRENTUSERID).value()

      if (isUserVoted) throw new DoNothingError(200, "You voted on this job")

      job.votes.down.push(CURRENTUSERID)
      job = await job.save()

      // logging activity
      let activity = await createActivity(
        {
          accountId: CURRENTUSERID,
          activityName: constants.ACTIVITY_VOTE_DOWN,
          modelName: "Job",
          modelDocumentId: job._id,
          description: `You have down voted a job ${job._id} at ${Date.now()}`,
        },
        new BaseError("JobVoteError")
      )

      job = await findJobById(fields._id) // to get updated job
      let attached = await attachImageToJob(job) // attach the image by url
      next(new ApiResponse(attached, 200, constants.JOB_VOTE_SUCCESS))
    } catch (err) {
      if (err instanceof DoNothingError) {
        job = await findJobById(fields._id) // to get updated job
        let attached = await attachImageToJob(job) // attach the image by url
        next(new ApiResponse(attached, err.errorCode, err.errorMessage))
      } else next(err)
    }
    return
  },
  controllerTerminator
)
jobRouter.patch(
  "/vote/flag",
  canActivate,
  async (req, res, next) => {
    const { fields } = req
    if (!fields?._id) {
      next(new BaseError())
      return
    }
    const CURRENTUSERID = req.CURRENTUSERID
    // accountId should be from session
    try {
      let job = await Job.findById(fields._id)
      if (job.accountId === CURRENTUSERID) {
        throw new DoNothingError()
      }

      let isUserVoted =
        _.chain(job.votes.up).map(_.toString).includes(CURRENTUSERID).value() ||
        _.chain(job.votes.down).map(_.toString).includes(CURRENTUSERID).value() ||
        _.chain(job.votes.flag).map(_.toString).includes(CURRENTUSERID).value()

      if (isUserVoted) throw new DoNothingError(200, "You voted on this job")

      job.votes.flag.push(CURRENTUSERID)
      job = await job.save()

      // logging activity
      let activity = await createActivity(
        {
          accountId: CURRENTUSERID,
          activityName: constants.ACTIVITY_VOTE_FLAG,
          modelName: "Job",
          modelDocumentId: job._id,
          description: `You have flag voted a job ${job._id} at ${Date.now()}`,
        },
        new BaseError("JobVoteError")
      )

      job = await findJobById(fields._id) // to get updated job
      let attached = await attachImageToJob(job) // attach the image by url
      next(new ApiResponse(attached, 200, constants.JOB_VOTE_SUCCESS))
    } catch (err) {
      if (err instanceof DoNothingError) {
        job = await findJobById(fields._id) // to get updated job
        let attached = await attachImageToJob(job) // attach the image by url
        next(new ApiResponse(attached, err.errorCode, err.errorMessage))
      } else next(err)
    }
    return
  },
  controllerTerminator
)


/**
 * @description complement for a job
 * @returns job
 */
jobRouter.patch(
  "/tip",
  canActivate,
  async (req, res, next) => {
    const { fields, CURRENTUSERID } = req
    const jobId = fields.jobId
    const amount = fields.tip

    if (!(jobId && amount && amount > 0)) {
      next(new RequiredError())
      return
    }
    try {
      let job = await Job.findById(jobId)
      if (!job && job._account?.toString() === CURRENTUSERID) {
        next(new ApiResponse({}, 400, "You own the job"))
        return
      }
      job = await Job.findOne({
        "_id": jobId,
        "tips._account": CURRENTUSERID,
      })
      let tipDoc = {
        amount: amount,
        _account: CURRENTUSERID,
        updatedAt: new Date(),
      }
      //push
      if (!job) {
        await Job.findByIdAndUpdate(jobId, { $push: { tips: tipDoc } })
      }
      //update
      if (job) {
        await Job.findOneAndUpdate(
          { "_id": jobId, "tips._account": CURRENTUSERID },
          { $set: { "tips.$.amount": amount, "tips.$.updatedAt": new Date() } }
        )
      }
      job = await findJobById(jobId, { tips: 1 })
      let tipItem = job.tips.filter((tip) => tip._account === CURRENTUSERID)
      next(new ApiResponse(tipItem, 200, "You have tipped"))
    } catch (err) {
      next(err)
    }
    return
  },
  controllerTerminator
)

/**
 * @description comment on a job
 * @returns job
 */
jobRouter.patch(
  "/comment",
  canActivate,
  async (req, res, next) => {
    const { fields, CURRENTUSERCRYPTOADDRESS } = req
    if (!(fields?.jobId && fields?.comment)) {
      next(new BaseError("Requires fields{jobId, comment} but got undefined"))
      return
    }
    try {
      let job = await updateJobById(fields.jobId, {
        $push: {
          comments: {
            $each: [
              { comment: fields.comment, createdBy: CURRENTUSERCRYPTOADDRESS },
            ],
            $sort: { createdAt: -1 },
            $position: 0,
          },
        },
      })
      job = await attachImageToJob(job)
      next(job)
    } catch (err) {
      next(err)
    }
    return
  },
  controllerTerminator
)

exports.jobRouter = jobRouter
