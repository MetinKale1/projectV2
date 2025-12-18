const Router = require('@koa/router');
const fietsService = require('../service/fiets');
const Joi = require('joi');
const validate = require('../core/validation');
const { requireAuthentication } = require('../core/auth');

const getAlleFietsen = async (ctx) => {
  const fietsen = await fietsService.getAll();
  ctx.body = fietsen;
};
getAlleFietsen.validationScheme = null;

const register = async (ctx) => {
  const fiets = await fietsService.register(ctx.request.body);
  ctx.status = 201;
  ctx.body = fiets;
};
register.validationScheme = {
  body: {
    locatieID: Joi.number().integer().positive(),
    model: Joi.string().max(255),
    type: Joi.string().max(255),
    status: Joi.string().max(255),
    foto: Joi.string().max(10000000).allow(null),
  },
};

const getFietsById = async (ctx) => {
  const fiets = await fietsService.getById(ctx.params.id);
  ctx.status = 200;
  ctx.body = fiets;
};
getFietsById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const updateFietsById = async (ctx) => {
  const fiets = await fietsService.updateById(ctx.params.id, ctx.request.body);
  ctx.status = 200;
  ctx.body = fiets;
};
updateFietsById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
  body: {
    locatieID: Joi.number().integer().positive(),
    model: Joi.string().max(255),
    type: Joi.string().max(255),
    status: Joi.string().max(255),
    foto: Joi.string().max(10000000).allow(null),
  },
};


const deleteFietsById = async (ctx) => {
  await fietsService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deleteFietsById.validationScheme = {
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
    prefix: '/fietsen',
  });

  router.use(requireAuthentication);

  router.get('/', validate(getAlleFietsen.validationScheme),getAlleFietsen);
  router.post('/', validate(register.validationScheme),register);
  router.get('/:id', validate(getFietsById.validationScheme),getFietsById);
  router.put('/:id', validate(updateFietsById.validationScheme),updateFietsById);
  router.delete('/:id', validate(deleteFietsById.validationScheme),deleteFietsById);

  app.use(router.routes())
     .use(router.allowedMethods());
};
