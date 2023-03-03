const { model } = require("mongoose")
const { jobScheama } = require("./job.schema")

exports.Job = model("job", jobScheama)
