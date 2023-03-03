const { ObjectId } = require("mongodb")

const fs = require("fs").promises
const process = require("process")
const path = require("path")

const { saveImageFromJobTodo, saveImageFromJob } = require("../util/image.util")
const { JobCreationError } = require("../error/job.error")
const { createActivity } = require("../service/activity.service")
const { jobPollingEndTime } = require("../util/common.util")
const { createJob } = require("../service/job.service")
const { constants } = require("../constants/common.constants")
const { ApiResponse } = require("../model/common/ApiResponse")
const { jobValidator } = require("../validator/job.validator")

const CRYPTO_STORE = process.env.CRYPTO_STORE

//@MiddleWare
//@Input
//  @Files before, after
//  @Session CURRENTUSERID
//@Output Job
let saveProofOfWork = async (req, res, next) => {
  try {
    const { fields, files } = req
    let input = await jobValidator.validateAsync({
      description: fields.description,
      hours: fields.hours,
      latitude: fields.latitude,
      longitude: fields.longitude,
      address: fields.address,
      before: files.before.path,
      after: files.after.path
    })
    const _id = new ObjectId().toString()
    if (!_id) {
      console.error("can not create _id")
      res.status(500).send("Something went wrong")
      return
    }
    if (!CRYPTO_STORE) {
      console.error("CRYPTO STORE empty")
      res.status(500).send("Something went wrong")
      return
    }
    const savedImages = await saveImageFromJob(_id, files)
    req.fields = { ...req.fields, _id, ...savedImages }
    next()
    return
  } catch (err) {
    console.error(err)
    res.status(500).send("Something went wrong")
    return
  }
}

/**
 *
 * @param {*} req : email, cryptoAddress, description, hours, status, proofOfWork, votes
 * @param {*} res
 * @param {*} next
 * @requires email, cryptoAddress, description, hours, status, proofOfWork, votes
 */
let jobCreationHandler = async (req, res, next) => {
  const { fields, CURRENTUSERID, CURRENTUSERCRYPTOADDRESS } = req
  try {
    job = await createJob({
      _id: fields._id,
      accountId: CURRENTUSERID,
      cryptoAddress: CURRENTUSERCRYPTOADDRESS,
      description: fields.description,
      hours: fields.hours,
      endAt: jobPollingEndTime(), // polling end time
      before: fields.before,
      after: fields.after,
      latitude: fields.latitude,
      longitude: fields.longitude,
      address: fields.address,
    })
    let activity = await createActivity(
      {
        accountId: CURRENTUSERID,
        activityName: constants.ACTIVITY_JOB_CREATED,
        modelName: "Job",
        modelDocumentId: job._id,
        description: `You have created a job ${job._id} at ${Date.now()}`,
      },
      new JobCreationError()
    )
    next(new ApiResponse(job, 200, `Job registered`, Date.now()))
  } catch (err) {
    next(err)
  }
  return
}

let saveProofOfWorkTodo = async (req, res, next) => {
  try {
    const { files } = req
    const _id = new ObjectId().toString()
    if (!_id) {
      console.error("can not create _id")
      res.status(500).send("Something went wrong")
      return
    }
    let savedImages = await saveImageFromJobTodo(_id, files)
    if (!savedImages.current) throw new Error("Timeout")
    req.fields = { ...req.fields, _id, ...savedImages }
    next()
    return
  } catch (err) {
    console.error(err)
    res.status(500).send("Something went wrong")
    return
  }
}

let saveProofOfWorkTodoDone = async (req, res, next) => {
  try {
    const { files } = req
    const _id = new ObjectId().toString() //create new job id, different from job id
    if (!_id) {
      console.error("can not create _id")
      res.status(500).send("Something went wrong")
      return
    }
    const defaultExt = ".jpg"
    const imageName = {
      before: "before" + defaultExt,
      after: "after" + defaultExt,
    }
    let uploaded = { before: false, after: false }
    if (!(files.before && files.after))
      throw new Error("Proof of work is required")
    let _idDir = path.join(CRYPTO_STORE, _id.toString())
    await fs.mkdir(_idDir.toString(), { recursive: true })
    if (files.before) {
      // extracted from saved current image
      // is of type buffer string
      let buff = Buffer.from(files.before, "base64")
      await fs.writeFile(path.join(_idDir, imageName.before), buff, {
        flag: "w",
      })
      uploaded.before = true
    }
    if (files.after) {
      let buff =
        (files.after?.path
          ? await fs.readFile(path.join(files.after.path))
          : files.after) ?? files.after
      await fs.writeFile(path.join(_idDir, imageName.after), buff, {
        flag: "w",
      })
      uploaded.after = true
    }
    if (uploaded.before === false || uploaded.after === false)
      throw new Error("Failed to store files")
    req.fields = { ...req.fields, _id, ...imageName }
    next()
    return
  } catch (err) {
    console.error(err)
    res.status(500).send("Something went wrong")
    return
  }
}

exports.jobCreationHandler = jobCreationHandler
exports.saveProofOfWork = saveProofOfWork
exports.saveProofOfWorkTodo = saveProofOfWorkTodo
exports.saveProofOfWorkTodoDone = saveProofOfWorkTodoDone
