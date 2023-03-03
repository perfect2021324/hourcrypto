const paypal = require("paypal-rest-sdk")
const util = require("util")

const hostUrl = process.env.URL
const clientId = process.env.PAYPAL_CLIENT_ID
const clientSecret = process.env.PAYPAL_CLIENT_SECRET
const configure = () => {
  paypal.configure({
    mode: "sandbox", //sandbox or live
    client_id: clientId,
    client_secret: clientSecret,
  })
}

const payment = (amount, item, sku, description) => {
  configure()
  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: `${hostUrl}/payment/approved`,
      cancel_url: `${hostUrl}/payment/canceled`,
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: item,
              sku: sku,
              price: amount,
              currency: "USD",
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: "USD",
          total: amount,
        },
        description: description,
      },
    ],
  }
  return new Promise((resolve, reject) => {
    paypal.payment.create(create_payment_json, (err, pay) => {
      let approvalUrl = ""
      if (err) {
        console.error(err)
        reject(err)
      }
      //console.debug(pay)
      for (let link of pay.links) {
        if (link.rel === "approval_url") {
          approvalUrl = link.href
          resolve(approvalUrl)
        }
      }
    })
  })
}

const paymentExecute = (payerId, paymentId) => {
  let client = configure()
  const execute_payment_json = {
    payer_id: payerId,
    // "transactions": [{
    //     "amount": {
    //         "currency": "USD",
    //         "total": total
    //     }
    // }]
  }
  return new Promise((resolve, reject) => {
    paypal.payment.execute(paymentId, execute_payment_json, (err, pay) => {
      if (err) {
        console.error(err)
        reject(err)
      }
      //console.debug(pay)
      resolve(pay)
    })
  })
}

const payout = (amount, payTo, subject, note) => {
  configure()
  return new Promise((resolve, reject) => {
    const sender_batch_id = Math.random().toString(36).substring(9)
    const create_payout_json = {
      sender_batch_header: {
        sender_batch_id: sender_batch_id,
        email_subject: subject,
      },
      items: [
        {
          recipient_type: "EMAIL",
          amount: {
            value: amount,
            currency: "USD",
          },
          receiver: payTo,
          note: note,
          sender_item_id: "cryptofirst1",
        },
      ],
    }
    const sync_mode = true
    paypal.payout.create(create_payout_json, sync_mode, function (err, pay) {
      if (err) {
        console.info("Payout rejected by paypal")
        console.error(err)
        reject(err)
      } else {
        console.log("Payout accepted by paypal")
        resolve(pay)
      }
    })
  })
}

exports.payment = payment
exports.paymentExecute = paymentExecute
exports.payout = payout
