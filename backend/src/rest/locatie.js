const Router = require('@koa/router');
const locatieService = require('../service/locatie');
const Joi = require('joi');
const validate = require('../core/validation');
const { requireAuthentication } = require('../core/auth');

const getAlleLocaties = async (ctx) => {
  const locaties = await locatieService.getAll();
  ctx.body = locaties;
};
getAlleLocaties.validationScheme = null;

const register = async (ctx) => {
  const locatie = await locatieService.register(ctx.request.body);
  ctx.status = 201;
  ctx.body = locatie;
};
register.validationScheme = {
  body: {
    straat: Joi.string().max(255),
    nr: Joi.number().integer().positive(),
    gemeente: Joi.string().max(255),
    postcode: Joi.number().integer().positive(),
  },
};

const getlocatieById = async (ctx) => {
  const locatie = await locatieService.getById(ctx.params.id);
  ctx.status = 200;
  ctx.body = locatie;
};
getlocatieById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const updateLocatieById = async (ctx) => {
  const locatie = await locatieService.updateById(ctx.params.id, ctx.request.body);
  ctx.status = 200;
  ctx.body = locatie;
};
updateLocatieById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
  body: {
    straat: Joi.string().max(255),
    nr: Joi.number().integer().positive(),
    gemeente: Joi.string().max(255),
    postcode: Joi.number().integer().positive(),
  },
};

const deleteLocatieById = async (ctx) => {
  await locatieService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deleteLocatieById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};


/**
 * Install places routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: '/locaties',
  });

  router.use(requireAuthentication);

  router.get('/', validate(getAlleLocaties.validationScheme),getAlleLocaties);
  router.post('/', validate(register.validationScheme),register);
  router.get('/:id', validate(getlocatieById.validationScheme),getlocatieById);
  router.put('/:id', validate(updateLocatieById.validationScheme),updateLocatieById);
  router.delete('/:id', validate(deleteLocatieById.validationScheme),deleteLocatieById);

  app.use(router.routes())
     .use(router.allowedMethods());
};
