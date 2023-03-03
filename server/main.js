//others
const dotenvconfig = require("dotenv").config()
const dotenv_expand = require("dotenv-expand")
dotenv_expand(dotenvconfig)
const express = require("express")
const cors = require("cors")
// const bodyParser = require('body-parser')
const eformidable = require("express-formidable")
const esession = require("express-session")
const morgan = require("morgan")

// core
const process = require("process")

//local
const { jobRouter } = require("./src/controller/job.controller")
const { authRouter } = require("./src/controller/auth.controller")
const { activityRouter } = require("./src/controller/activity.controller")
const { testRouter } = require("./src/controller/test.controller")
const { transactionRouter } = require("./src/controller/transaction.controller")
const {
  activatePendingJobsTimer,
} = require("./src/service/transaction.service")
const { db } = require("./src/config/mongoose.config")
const { paymentRouter } = require("./src/controller/payment.controller")
const { jobTodoRouter } = require("./src/controller/jobTodo.controller")
const { RequiredError, EnvNotSetError } = require("./src/error/common.error")
const {
  controllerTerminator,
} = require("./src/middleware/controllerTerminator.middleware")
const { getSystemAccount } = require("./src/service/account.service")
const { SystemError } = require("./src/error/base.error")

const app = express()

corsOptions = {
  origin: ["http://localhost:4200", "http://localhost:3000"],
  credentials: true,
  optionsSuccessStatus: 200,
}

//middilewares
app.use(cors(corsOptions))
app.use(morgan("dev"))
// app.use(bodyParser())
app.use(
  eformidable({
    encoding: "utf-8",
    multiples: true,
  })
)
app.use(
  esession({ resave: false, saveUninitialized: true, secret: "itsasecret" })
)

/**
 * handles error and sends response
 */
app.use(controllerTerminator)

// routes
app.get("/", function (req, res) {
  res.status(201).send("An crypto-first backend server")
})

app.use((req, res, next) => {
  const { fields, files, query, session, headers } = req
  console.debug(">>>>>>>>>>>>>> New request <<<<<<<<<<")
  console.debug({ fields, files, query, session, headers })
  next()
})

app.use("/test", testRouter)
app.use("/job", jobRouter)
app.use("/jobTodo", jobTodoRouter)
app.use("/auth", authRouter)
app.use("/activity", activityRouter)
app.use("/transaction", transactionRouter)
app.use("/payment", paymentRouter)

//environment variables

if (
  !(
    process.env.HOST &&
    process.env.PORT &&
    process.env.MONGO_DB_URL &&
    process.env.CRYPTO_STORE &&
    process.env.PAYPAL_CLIENT_ID &&
    process.env.PAYPAL_CLIENT_SECRET &&
    process.env.JOB_PENDING_TIMER_INTERVAL_IN_MIN &&
    process.env.JOB_POLLING_DURATION_IN_MIN
  )
)
  throw new EnvNotSetError()

const PORT = process.env.PORT
const MONGO_DB_URL = process.env.MONGO_DB_URL
let SYSTEM

let notATopLevleAwait = async () => {
  const session = await db(MONGO_DB_URL)

  if (!session)
    throw new SystemError("DBSessionError", 500, "Db session not created")

  SYSTEM = await getSystemAccount()
  if (!SYSTEM?._id)
    // throw new SystemError("SystemAccountError", 500, "System account required")

  // timer for completing the penging jobs
  activatePendingJobsTimer()

  // all set; start server
  app.listen(PORT, function () {
    console.info(`Crypto server running at port : ${PORT}`)
  })
}
notATopLevleAwait()
