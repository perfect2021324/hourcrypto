const express = require("express")
const mongoose = require("mongoose")
const { ObjectId } = require("mongodb")

const fs = require("fs").promises
const process = require("process")
const path = require("path")
const {
  jobCreationHandler,
  saveProofOfWorkTodo,
  saveProofOfWorkTodoDone,
} = require("../middleware/job.middleware")
const { JobTodo } = require("../model/jobTodo.model")
const { attachImageToJobTodo } = require("../util/image.util")
const {
  extractLoginInfo,
  canActivate,
} = require("../middleware/auth.middleware")

const jobTodoRouter = express.Router()
const CRYPTO_STORE = process.env.CRYPTO_STORE

//@Route POST /
//@Input
//  @Fields description, current, volunteers
//  @Session CURRENTUSERID
//@Output JobTodo
jobTodoRouter.post(
  "/",
  extractLoginInfo,
  saveProofOfWorkTodo,
  async (req, res) => {
    const { fields, CURRENTUSERID, CURRENTUSERCRYPTOADDRESS } = req
    // const jobType = CURRENTUSERCRYPTOADDRESS ? "authenticated" : "anonymous"
    const jobType = "anonymous"
    const jobOwner = jobType === "anonymous" ? "" : CURRENTUSERCRYPTOADDRESS
    const jobOwnerId = jobType === "anonymous" ? "" : CURRENTUSERID
    let doc = {
      _id: fields._id,
      type: jobType,
      accountId: jobOwnerId,
      cryptoAddress: jobOwner,
      description: fields.description,
      status: "pending",
      current: fields.current,
      coords: {
        latitude: fields.latitude,
        longitude: fields.longitude,
      },
      address: fields.address,
      votes: {
        up: fields.up | 0,
        down: fields.down | 0,
      },
    }
    jobTodo = new JobTodo(doc)
    try {
      let result = await jobTodo.save()
      // doc = {
      //     jobId: fields._id,
      //     description: fields.description,
      //     hours: fields.hours
      // }
      // await Activity.findOneAndUpdate({ _id: CURRENTUSERID }, { $push: { jobs: doc } })
      result = await JobTodo.findById(result._id, { tips: 0 })
      result = await attachImageToJobTodo(result)
      res.status(201).send(result)
      return
    } catch (err) {
      console.debug(err)
      res.status(500).send("something went wrong")
      return
    }
  }
)

//@Route GET /all
//@Input
//  @Fields _id
//@Output JobTodo[]
jobTodoRouter.get("/all", async (req, res) => {
  const { query } = req
  let filter = {}
  let mJobTodoQuery
  let responseObj = {}
  try {
    let jobTodos = await JobTodo.find(filter, { tips: 0 })
      .sort({ createdAt: -1 })
      .skip(Number.parseInt(query?.fromRecord ?? 0))
      .limit(Number.parseInt(query?.noOfRecords ?? 10))
      .exec()
    let totalRecords = await JobTodo.find(filter, { tips: 0 })
      .sort({ createdAt: -1 })
      .count()
      .exec()

    for (let i in jobTodos) {
      try {
        jobTodos[i] = await attachImageToJobTodo(jobTodos[i])
      } catch (err) {
        console.error(err)
        res.status(500).send("something went wrong")
        return
      }
    }
    responseObj = {
      data: jobTodos,
      status: "success",
      timestamp: new Date(),
      meta: { totalRecords: totalRecords },
    }
    res.status(201).send(responseObj)
    return
  } catch (err) {
    console.error(err)
    res.status(500).send("something went wrong")
    return
  }
})

jobTodoRouter.patch("/take", canActivate, async (req, res) => {
  const { fields, CURRENTUSERID, CURRENTUSERCRYPTOADDRESS } = req

  try {
    let jobTodo = await JobTodo.findById(fields.jobTodoID)
    if (!jobTodo?._id) {
      throw new Error("job not found")
    }
  } catch (err) {
    console.error(err)
    res.status(500).send({})
    return
  }
  try {
    let jobTodo = await JobTodo.findByIdAndUpdate(fields.jobTodoID, {
      accountId: CURRENTUSERID,
      cryptoAddress: CURRENTUSERCRYPTOADDRESS,
      status: "owned",
    })
    jobTodo = await JobTodo.findById(jobTodo._id)
    res.status(201).send(jobTodo)
  } catch (err) {
    console.error(err)
    res.status(500).send("something went wrong")
  }
  return
})
jobTodoRouter.patch(
  "/workDone",
  canActivate,
  async (req, res, next) => {
    const { fields, files } = req

    try {
      let jobTodo = await JobTodo.findById(fields.jobTodoID)
      if (!jobTodo?._id) {
        throw new Error("job not found")
      }

      // create new req url and redirect
      let _fields = {
        _id: jobTodo._id.toString(),
        description: jobTodo.description,
        hours: fields.timeTaken,
        current: jobTodo.current,
        latitude: jobTodo.coords.latitude,
        longitude: jobTodo.coords.longitude,
        address: jobTodo.address,
      }
      _fields = await attachImageToJobTodo(_fields)
      // Object.assign(req.files, {before: _fields.current, after: files.proof})
      req.files = { before: _fields.current, after: files.proof }
      let __fields = Object.fromEntries(
        Object.entries(_fields).filter(
          (a) => a[0] !== "current" || a[0] !== "_id"
        )
      )
      Object.assign(req.fields, __fields)
      next()
    } catch (err) {
      console.error(err)
      res.status(500).send({})
      return
    }
  },
  saveProofOfWorkTodoDone,
  jobCreationHandler
)

jobTodoRouter.patch("/status", async (req, res) => {
  const { fields } = req
  try {
    let jobTodo = await JobTodo.findByIdAndUpdate(fields.jobTodoID, {
      jobId: fields.jobID,
      status: "done",
    })
    jobTodo = await JobTodo.findById(jobTodo._id).exec()
    res.status(201).send(jobTodo)
  } catch (err) {
    console.error(err)
    res.status(500).send({})
    return
  }
})

exports.jobTodoRouter = jobTodoRouter
