// activity constants
const activity_constants = {
  ACTIVITY_ACCOUNT_CREATED: "account created",

  ACTIVITY_VOTE_UP: "vote up",
  ACTIVITY_VOTE_DOWN: "vote down",
  ACTIVITY_VOTE_FLAG: "vote flag",
  ACTIVITY_JOB_CREATED: "job created",
  ACTIVITY_JOB_STATUS_CHANGED: "job status changed",
  ACTIVITY_COMMENT: "comment",
}

const job_constants = {
  JOB_VOTE_SUCCESS: "Thank you!",
}

exports.constants = {
  ...activity_constants,
  ...job_constants,
}
