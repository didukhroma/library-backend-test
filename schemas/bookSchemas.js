import Joi from 'joi';

export const createBookSchema = Joi.object({
  isbn: Joi.string().required(),
  title: Joi.string().min(3).required(),
  author: Joi.string().min(3).required(),
  isBorrowed: Joi.boolean(),
});

export const updateBookSchema = Joi.object({
  isbn: Joi.string(),
  title: Joi.string().min(3),
  author: Joi.string().min(3),
  isBorrowed: Joi.boolean(),
});
