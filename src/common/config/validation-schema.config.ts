import * as Joi from 'joi';

export const validationSchema = Joi.object({
  APP_PORT: Joi.number().required(),
  LOGGER_LEVEL: Joi.string().required(),
  NODE_ENV: Joi.string().required(),
  OTLP_COLLECTOR: Joi.string().required(),
  NEW_RELIC_LICENSE_KEY: Joi.string().required(),
});
