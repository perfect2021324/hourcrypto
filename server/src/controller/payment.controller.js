const { default: axios } = require("axios")
const { Router } = require("express")
const { AccountNotFoundError } = require("../error/account.error")
const {
  canActivate,
  extractLoginInfo,
} = require("../middleware/auth.middleware")
const { Payment } = require("../model/payment.model")
const {
  getSystemAccount,
  findAccountById,
} = require("../service/account.service")

const { payment, paymentExecute, payout } = require("../service/paypal.service")
const { makeTransaction } = require("../service/transaction.service")

const paymentRouter = Router()

paymentRouter.post("/in", extractLoginInfo, async (req, res) => {
  const { fields, CURRENTUSERCRYPTOID } = req
  if (!(fields?.mode && fields?.purpose && fields.amount)) {
    res.status(401).send({})
    return
  }
  try {
    const SYSTEM = await getSystemAccount()
    let creditAccount = SYSTEM
    let debitAccount

    if (!creditAccount?._id) throw new AccountNotFoundError()
    if (CURRENTUSERCRYPTOID)
      debitAccount = await findAccountById(CURRENTUSERCRYPTOID)

    sku = new Date().getTime()
    if (fields.purpose === "donation") {
      if (fields.mode === "paypal") {
        const approvalUrl = await payment(
          fields.amount,
          fields.purpose,
          sku,
          "donation to crypto first"
        )
        console.debug("------------------\n -------------")
        console.debug(approvalUrl)
        if (approvalUrl) {
          await Payment.createCollection()
          let payment = await Payment.create({
            type: fields.purpose,
            patner: fields.mode,
            indicator: "in",
            status: "created",
            items: [
              {
                name: "dolar",
                sku: sku,
                quanity: "1",
                currency: "usd",
                amount: fields.amount,
              },
            ],
            currency: "usd",
            amount: fields.amount,
            createdBy: debitAccount?.cryptoAddress ?? "SYSTEM",
            _creditAccount: creditAccount._id,
            _debitAccount: debitAccount?._id,
          })

          if (!payment?._id) throw new Error("payment error")
          res
            .status(201)
            .send({ paymentId: payment._id, approvalUrl: approvalUrl })
          return
        }
      } //mode paypal
    } // purpose donate
  } catch (err) {
    console.error(err)
    res.status(500).send({})
  }
})

/**
 * @description Checks if payment is reflected in the system at intervals, Confirms user if it is succeded or timout
 * @param paymentId
 */
paymentRouter.get("/executed/:paymentId", async (req, res) => {
  const { params } = req
  if (!params?.paymentId) {
    res.status(400).send({})
    return
  }
  let payment = {}
  try {
    let intervalId = setInterval(async () => {
      payment = await Payment.findOne({
        _id: params.paymentId,
        status: "done",
      })
      if (payment?._id) {
        clearInterval(intervalId)
        clearTimeout(timeoutId)
        res.status(201).send(payment)
        return
      }
    }, 5 * 1000)
    let timeoutId = setTimeout(() => {
      clearInterval(intervalId)
      clearTimeout(timeoutId)
      res.status(204).send({})
      return
    }, 1.5 * 60 * 1000)
  } catch (err) {
    res.status(500).send({})
    return
  }
})

/**
 * @description Activates on paymentment partial done at other end
 * and captures the payment info and stores in the system
 */
paymentRouter.get("/approved", async (req, res) => {
  const { query } = req
  const { PayerID, paymentId } = query
  let status = "failed"
  try {
    let result = await paymentExecute(PayerID, paymentId)
    //let status = response.statusCode
    let payerInfo = result.payer.payer_info
    let trans = result.transactions[0]
    let item = trans.item_list.items[0]
    console.table({ item })
    let payment = await Payment.findOne({ "items.sku": item.sku })
      .populate("_creditAccount")
      // .pupulate("_debitAccount")
      .lean()
      .exec()

    // failure, sending money back
    if (!payment?._id) {
      // make payout or reverse payment to paypal account
      throw new Error("can not find payment")
    }

    // loading amount in the credit account
    let toOwn = await makeTransaction({
      type: payment.type,
      mode: "paypal",
      indicator: "in",
      payment,
      description: trans.description,
      amount: payment.amount,
      createdBy: "SYSTEM",
    })
    console.debug({ toOwn })
    if (toOwn._id) {
      payment = await Payment.findByIdAndUpdate(payment._id, {
        patnerInfo: {
          payment: {
            paymentId: paymentId,
            description: trans.description,
            message: "",
            total_amount: trans.amount,
          },
          client: {
            clientId: PayerID,
            email: payerInfo.email,
            clientName: `${payerInfo.first_name}.${payerInfo.last_name}`,
          },
        },
        status: "done",
      })
    }
    console.debug({ payment })
    if (payment._id) status = "success"
  } catch (err) {
    console.error(err)
    // await Payment.findByIdAndUpdate(payment._id, {
    //   patnerInfo: {
    //     payment: {
    //       paymentId: paymentId,
    //       description: trans.description,
    //       message: "",
    //       total_amount: trans.amount,
    //     },
    //     client: {
    //       clientId: PayerID,
    //       email: payerInfo.email,
    //       clientName: `${payerInfo.first_name}.${payerInfo.last_name}`,
    //     },
    //   },
    //   status: "failed",
    // })
    status = "failed"
  }
  res.status(201).send(`
        <!doctype>
        <html>
        <body>
        <div>
            <h2> payment ${status}</h2>
            <h6> you can close the window now </h6>
        </div>
        </body>
        </html>
        `)
})

/**
 * @description Activates if payer cancels the request
 */
paymentRouter.get("/canceled", (req, res) => {
  res.status(204).send({ status: "canceled" })
})

paymentRouter.post("/payout", canActivate, async (req, res) => {
  const { fields, CURRENTUSERID } = req
  try {
    if (!(fields.purpose && fields.mode && fields.amount && fields.payTo)) {
      throw Error("not enough input")
    }
    let debitAccount = await findAccountById(CURRENTUSERID)
    if (!debitAccount._id) throw new AccountNotFoundError()
    let trans
    let payment
    const subject = "You have a payment from cryptofirst"
    const note = "Thank you for you work"
    const sku = new Date().getTime()
    if ((fields.purpose = "redeem")) {
      if ((fields.mode = "paypal")) {
        payment = await Payment.create({
          type: fields.purpose,
          patner: fields.mode,
          indicator: "out",
          status: "created",
          items: [
            {
              name: "dolar",
              sku: sku,
              quanity: "1",
              currency: "usd",
              amount: fields.amount,
            },
          ],
          currency: "usd",
          amount: fields.amount,
          createdBy: "SYSTEM",
          _debitAccount: debitAccount._id,
        })
      }
    }

    payment = await Payment.findById(payment._id)
      .populate("_debitAccount")
      .lean()
      .exec()
    console.debug(fields.payTo)
    let po = await payout(fields.amount, fields.payTo, subject, note)
    console.debug(po)
    if (po)
      trans = await makeTransaction({
        type: payment.type,
        mode: "paypal",
        indicator: "out",
        description: "amount redeemed",
        amount: payment.amount,
        payment,
        createdBy: payment.createdBy,
      })

    if (trans?._id)
      payment = await Payment.findByIdAndUpdate(payment._id, {
        status: "accepted",
      })
    res.status(201).send({ status: "success" })
  } catch (err) {
    console.error(err)
    res.status(500).send({ status: "cancelled" })
    return
  }
})
exports.paymentRouter = paymentRouter
