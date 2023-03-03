const process = require("process")
const path = require("path")
const fs = require("fs").promises
const CRYPTO_STORE = process.env.CRYPTO_STORE

//@Util
//@Input: Fromdata.Array<File>
//get the file from the path
let saveImageFromJob = async (_id, files) => {
  if (!CRYPTO_STORE) {
    console.error("CRYPTO STORE empty")
    throw new Error("Something went wrong")
  }
  if (!_id) throw new Error("job id is undefined")
  if (!files) throw new Error("Proof of work is required")
  const defaultExt = ".jpg"
  const imageName = {
    before: "before" + defaultExt,
    after: "after" + defaultExt,
  }
  let uploaded = { before: false, after: false }
  try {
    let _idDir = path.join(CRYPTO_STORE, _id.toString())
    await fs.mkdir(_idDir.toString(), { recursive: true })
    if (files.before) {
      let buff = await fs.readFile(path.join(files.before.path))
      await fs.writeFile(path.join(_idDir, imageName.before), buff, {
        flag: "w",
      })
      uploaded.before = true
    }
    if (files.after) {
      let buff = await fs.readFile(path.join(files.after.path))
      await fs.writeFile(path.join(_idDir, imageName.after), buff, {
        flag: "w",
      })
      uploaded.after = true
    }
    if (uploaded.before === true || uploaded.after === true)
      new Error("Failed to store files")
    return imageName
  } catch (err) {
    console.error(err)
    res.status(500).send("Something went wrong!")
    return
  }
}

//@Util
//get the file from the path
let attachImageToJob = async (job) => {
  // console.debug("dettached => "+job)
  if (!CRYPTO_STORE) {
    console.error("CRYPTO STORE empty")
    throw Error("Something went wrong")
  }
  if (job === undefined) throw new Error("job is undefined")

  const location = path.join(CRYPTO_STORE, job._id.toString())
  let bbuff = await fs
    .readFile(path.join(location, job.proofOfWork.before))
    .catch((err) => console.error(err))
  let abuff = await fs
    .readFile(path.join(location, job.proofOfWork.after))
    .catch((err) => console.error(err))
  job.proofOfWork = {
    before: bbuff.toString("base64"),
    after: abuff.toString("base64"),
  }
  return job
}

//@Util
//@Input: Fromdata.Array<File>
//get the file from the path
let saveImageFromJobTodo = async (_id, files) => {
  if (!CRYPTO_STORE) {
    console.error("CRYPTO STORE empty")
    throw new Error("Something went wrong")
  }
  if (!_id) throw new Error("job id is undefined")
  if (!files) throw new Error("Proof of work is required")
  const defaultExt = ".jpg"
  const imageName = {
    current: "current" + defaultExt,
  }
  let uploaded = { current: false }
  try {
    let _idDir = path.join(CRYPTO_STORE, _id.toString())
    await fs.mkdir(_idDir.toString(), { recursive: true })
    if (files.current) {
      let buff =
        (files?.current?.path
          ? await fs.readFile(path.join(files.current.path))
          : files.current) ?? files.current
      await fs.writeFile(path.join(_idDir, imageName.current), buff, {
        flag: "w",
      })
      uploaded.current = true
    }
    if (uploaded.current === false) {
      console.error("failed to store files")
      throw new Error("Failed to store files")
    }
    return { current: imageName.current }
  } catch (err) {
    console.error(err)
    throw new Error("Something went wrong!")
  }
}

//@Util
//@Input : Job
//get the file from the path
let attachImageToJobTodo = async (jobTodo) => {
  // console.debug("dettached => "+job)
  if (!CRYPTO_STORE) {
    console.error("CRYPTO STORE empty")
    throw Error("Something went wrong")
  }
  if (jobTodo === undefined) throw new Error("job todo is undefined")

  const location = path.join(CRYPTO_STORE, jobTodo._id.toString())
  let bbuff = await fs
    .readFile(path.join(location, jobTodo.current))
    .catch((err) => console.error(err))
  jobTodo.current = bbuff.toString("base64")
  return jobTodo
}

exports.attachImageToJob = attachImageToJob
exports.attachImageToJobTodo = attachImageToJobTodo
exports.saveImageFromJob = saveImageFromJob
exports.saveImageFromJobTodo = saveImageFromJobTodo
