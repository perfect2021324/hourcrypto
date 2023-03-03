const joi = require('joi')
const { ValidationError } = require('../error/common.error')


const transferValidator = joi.object(
    {
        amount: joi.number().required().min(1).error(new ValidationError("Invalid amount")),
        debitAccount: joi.string().required().email({ minDomainSegments: 2}).error(new ValidationError("Invalid debitAccount")),
        creditAccount: joi.string().required().email({ minDomainSegments: 2}).error(new ValidationError("Invalid creditAccount")),
        createdBy: joi.string().required().email({ minDomainSegments: 2})
    }
)


exports.transferValidator = transferValidator
