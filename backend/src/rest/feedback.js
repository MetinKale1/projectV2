const Router = require('@koa/router');
const feedbackService = require('../service/feedback');
const Joi = require('joi');
const validate = require('../core/validation');
// const { get } = require('config');
const { requireAuthentication } = require('../core/auth');

const getAlleFeedback = async (ctx) => {
  const feedback = await feedbackService.getAll();
  ctx.body = feedback;
};
getAlleFeedback.validationScheme = null;

const register = async (ctx) => {
  const feedback = await feedbackService.register(ctx.request.body);
  ctx.status = 201;
  ctx.body = feedback;
};
register.validationScheme = {
  body: {
    verhuurID: Joi.number().integer().positive(),
    omschrijving: Joi.string().max(255),
    datum: Joi.string().max(255),
    rating: Joi.number().integer().positive(),
  },
};

const getFeedbackById = async (ctx) => {
  const feedback = await feedbackService.getById(ctx.params.id);
  ctx.status = 200;
  ctx.body = feedback;
};
getFeedbackById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};


const updateFeedbackById = async (ctx) => {
  const feedback = await feedbackService.updateById(ctx.params.id, ctx.request.body);
  ctx.status = 200;
  ctx.body = feedback;
};
updateFeedbackById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
  body: {
    verhuurID: Joi.number().integer().positive(),
    omschrijving: Joi.string().max(255),
    datum: Joi.string().max(255),
    rating: Joi.number().integer().positive(),
  },
};


const deleteFeedbackById = async (ctx) => {
  await feedbackService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deleteFeedbackById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * Install transaction routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: '/feedback',
  });

  router.use(requireAuthentication);

  router.get('/', validate(getAlleFeedback.validationScheme),getAlleFeedback);
  router.post('/', validate(register.validationScheme),register);
  router.get('/:id', validate(getFeedbackById.validationScheme),getFeedbackById);
  router.put('/:id', validate(updateFeedbackById.validationScheme),updateFeedbackById);
  router.delete('/:id', validate(deleteFeedbackById.validationScheme),deleteFeedbackById);

  app.use(router.routes())
     .use(router.allowedMethods());
};
