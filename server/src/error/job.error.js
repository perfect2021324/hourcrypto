const { BaseError } = require("./base.error")

class JobCreationError extends BaseError {
  constructor() {
    super("JobCreationError", 400, "Unable to post the job")
  }
}

class JobNotFoundError extends BaseError {
  constructor() {
    super("JobNotFoundError", 400, "Job no longer exists")
  }
}

exports.JobCreationError = JobCreationError
exports.JobNotFoundError = JobNotFoundError
