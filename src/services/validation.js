const Joi = require('@hapi/joi');

const registerValidation = (data) => {
        const schema = Joi.object({
                username: Joi.string()
                        .min(6)
                        .required(),
                password: Joi.string()
                        .min(6)
                        .max(32)
                        .required(),
                email: Joi.string()
                        .email()
                        .required(),
                name: {
                firstname: Joi.string()
                        .max(128)
                        .required(),
                lastname: Joi.string()
                        .max(128)
                        .required()
                }
        });
        return schema.validate(data);
};

const loginValidation = data => {
        const schema = Joi.object({
                username: Joi.string()
                        .min(6)
                        .required(),
                password: Joi.string()
                        .min(6)
                        .required()
        });
        return schema.validate(data);
};

const transactionValidation = data => {
        const schema = Joi.object({
                item: Joi.array()
                        .items({
                                name: Joi.string().required(),
                                price_per_piece: Joi.number().required(),
                                image: Joi.string().required()
                        }),
                total: Joi.number().required()                
        });
        return schema.validate(data);
}

const transactionGetValidation = data => {
        const schema = Joi.object({
                transaction_id: Joi.string().required()                
        });
        return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.transactionValidation = transactionValidation;
module.exports.transactionGetValidation = transactionGetValidation