import Joi from 'joi';

const createContactValidation = Joi.object({
  name: Joi.string().min(3).max(20).required(),

  phoneNumber: Joi.string()
    .pattern(/^[0-9+\-() ]+$/)
    .min(3)
    .max(20)
    .required(),

  email: Joi.string().email().min(3).max(20).optional(),

  isFavourite: Joi.boolean().optional(),

  contactType: Joi.string().valid('work', 'home', 'personal').required(),
});

const updateContactValidation = Joi.object({
  name: Joi.string().min(3).max(20),

  phoneNumber: Joi.string()
    .pattern(/^[0-9+\-() ]+$/)
    .min(3)
    .max(20),

  email: Joi.string().email().min(3).max(20),

  isFavourite: Joi.boolean(),

  contactType: Joi.string().valid('work', 'home', 'personal'),
});

export { createContactValidation, updateContactValidation };
