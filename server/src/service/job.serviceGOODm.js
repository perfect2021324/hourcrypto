const _ = require("lodash")
const { RequiredError } = require("../error/common.error")

const { JobCreationError, JobNotFoundError } = require("../error/job.error")
const { Job } = require("../model/job.model")
const { attachImageToJob } = require("../util/image.util")

/**
 *
 * @param _id Job id
 * @param accountId Account id
 * @param hours hours worked
 * @param endAt Poll ends at
 * @param before Image of a place before user worked
 * @param after Image of a place user worked
 * @param longitude
 * @param latitude
 * @param address address
 * @requires *
 * @returns job
 */
const createJob = async ({
  _id,
  accountId,
  cryptoAddress,
  description,
  hours,
  endAt,
  before,
  after,
  latitude,
  longitude,
  address,
}) => {
  let doc = {
    _id,
    _account: accountId,
    cryptoAddress,
    description,
    hours,
    endAt,
    proofOfWork: {
      before,
      after,
    },
    coords: {
      latitude,
      longitude,
    },
    address,
  }
  let job = new Job(doc)
  job = await job.save()
  if (!job?._id) throw new JobCreationError()
  job = await Job.findById(job._id).lean().exec()
  job = await attachImageToJob(job)
  return job
}

/**
 *
 * @description finds job by filter
 * @param {*} filter
 * @param {*} projection
 * @returns job
 * @throws JobNotFound
 *
 */
const findJob = async (filter, projection) => {
  let job = {}
  filter = _.omitBy(filter, _.isUndefined)
  if (_.isPlainObject(filter) && !_.isEmpty(filter))
    job = await Job.findOne(filter, projection).lean().exec()
  if (!job?._id) throw new JobNotFoundError()
  return job
}

/**
 *
 * @description finds jobs by filter
 * @param {*} filter
 * @param {*} projection
 * @returns jobs
 *
 */
const findJobs = async (filter, projection, sort, limit) => {
  let jobs = []
  let query
  filter = _.omitBy(filter, _.isUndefined)
  if (_.isPlainObject(filter)) query = Job.find(filter, projection ?? {})
  query = jobQueryPopulate(query)
  if (_.isPlainObject(sort)) query = query.sort(sort)
  if (limit && _.isNumber(limit)) query = query.limit(limit)
  jobs = query.lean().exec()
  return jobs
}

/**
 * @description finds job by _id
 * @param _id job id
 * @param projection
 * @returns  job
 * @throws JobNotFound
 */
const findJobById = async (_id, projection = {}) => {
  let job = {}
  if (_id) job = await Job.findById(_id, projection).lean().exec()
  if (!job?._id) throw new JobNotFoundError()
  return job
}

/**
 * @description finds job by _id and populates _account, votes.up, votes.down
 * @param _id job id
 * @param projection
 * @returns  job
 * @throws JobNotFound
 */
const findJobByIdAndPopulate = async (_id, projection = {}) => {
  let job = {}
  let query
  if (!_id) throw new RequiredError()
  query = Job.findById(_id, projection)
  query = jobQueryPopulate(query)
  job = await query.lean().exec()
  if (!job?._id) throw new JobNotFoundError()
  return job
}

/**
 * @description update job by _id
 * @param _id job id
 * @param update data to update
 * @returns  job
 * @throws JobNotFound
 */
const updateJobById = async (_id, update = {}) => {
  let job = {}
  job = await Job.findByIdAndUpdate(_id, update).lean().exec()
  if (!job?._id) throw new JobNotFoundError()
  job = await findJobById(job._id)
  return job
}

/**
 * @description populates _account, votes.up, votes.down
 * @param query job
 * @returns query job
 */
const jobQueryPopulate = (jobQuery) => {
  return jobQuery
    .populate("_account")
    .populate("votes.up")
    .populate("votes.down")
}

exports.createJob = createJob
exports.findJobs = findJobs
exports.findJob = findJob
exports.findJobById = findJobById
exports.findJobByIdAndPopulate = findJobByIdAndPopulate
exports.updateJobById = updateJobById
