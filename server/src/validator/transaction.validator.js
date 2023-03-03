const joi = require('joi')

const transactionValidator = joi.object(
    {
        type: joi.string().required(),
        mode: joi.string(),
        status: joi.string(),
        paymentId: joi.string(),
        description: joi.string().required(),
        message: joi.string(),
        amount: joi.number().integer(),
        createdBy: joi.string().required(),
        createdAt: joi.date(),
        updatedAt: joi.date()
    }
).with("mode", "paymentId")

exports.transactionValidator = transactionValidator