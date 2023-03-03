const joi = require('joi')
const { ValidationError } = require('../error/common.error')

const jobValidator = joi.object(
    {
        description: joi.string().required().min(5).error(new ValidationError("Description should not be less than 5 charactors")),
        hours: joi.number().required().min(1).error(new ValidationError("Atleast an hour")),
        latitude: joi.number().required().error(new ValidationError("Location required")),
        longitude: joi.number().required().error(new ValidationError("Location required")),
        address: joi.string().required().error(new ValidationError("Location required")),
        before: joi.binary().required().error(new ValidationError("Before image required")),
        after: joi.binary().required().error(new ValidationError("After image required")),
    }
)

exports.jobValidator = jobValidator