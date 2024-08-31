import Joi from 'joi';

export const createBookSchema = Joi.object({
  isbn: Joi.string()
    .pattern(/^\d+\-\d$/)
    .required()
    .messages({
      'string.pattern.base': 'ISBN must be in the format XXXX-XXXX',
    }),
  title: Joi.string().min(3).required(),
  author: Joi.string().min(3).required(),
  isBorrowed: Joi.boolean(),
});

export const updateBookSchema = Joi.object({
  title: Joi.string().min(3),
  author: Joi.string().min(3),
  isBorrowed: Joi.boolean(),
});
