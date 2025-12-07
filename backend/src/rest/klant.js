const Router = require('@koa/router');
const klantService = require('../service/klant');
const Joi = require('joi');
const validate = require('../core/validation');
const { requireAuthentication, makeRequireRole } = require('../core/auth');
const Role = require('../core/roles');

/**
 * Check if the signed in user can access the given user's information.
 */
const checkKlantId = (ctx, next) => {
  const { klantId, roles } = ctx.state.session;
  const { id } = ctx.params;

  // You can only get our own data unless you're an admin
  if (id !== klantId && !roles.includes(Role.ADMIN)) {
    return ctx.throw(
      403,
      "You are not allowed to view this user's information",
      {
        code: 'FORBIDDEN',
      }
    );
  }
  return next();
};

const login = async (ctx) => {
  const { email, password } = ctx.request.body;
  const token = await klantService.login(email, password);
  ctx.body = token;
};
login.validationScheme = { // 👈 5
  body: {
    email: Joi.string().email(),
    password: Joi.string(),
  },
};


const getAlleKlanten = async (ctx) => {
  
  console.log(ctx.state.session);
  const klanten = await klantService.getAll();
  ctx.body = klanten;
};
getAlleKlanten.validationScheme = null;

const register = async (ctx) => {
  const klant = await klantService.register(ctx.request.body);
  ctx.status = 201;
  ctx.body = klant;
};
register.validationScheme = {
  body: {
    voornaam: Joi.string().max(255),
    achternaam: Joi.string().max(255),
    wachtwoord: Joi.string().max(255),
    emailadres: Joi.string().max(255),
  },
};

const getKlantById = async (ctx) => {
  const klant = await klantService.getById(ctx.params.id);
  ctx.status = 200;
  ctx.body = klant;
};
getKlantById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const updateKlantById = async (ctx) => {
  const klant = await klantService.updateById(ctx.params.id, ctx.request.body);
  ctx.status = 200;
  ctx.body = klant;
};
updateKlantById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
  body: {
    voornaam: Joi.string().max(255),
    achternaam: Joi.string().max(255),
    emailadres: Joi.string().max(255),
    profielfoto: Joi.string().max(255).allow(null),
  },
};

const deleteKlantById = async (ctx) => {
  await klantService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deleteKlantById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * Install transaction routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = function installklantRoutes(app) {
  const router = new Router({
    prefix: '/klanten',
  });

 // Public routes
 router.post(
  '/login',
  validate(login.validationScheme),
  login
);
router.post(
  '/register',
  validate(register.validationScheme),
  register
);
const requireAdmin = makeRequireRole(Role.ADMIN);

  router.get('/', 
  requireAuthentication,
  requireAdmin,
  validate(getAlleKlanten.validationScheme),
  getAlleKlanten
  );

  router.get('/:id',
    requireAuthentication ,
    validate(getKlantById.validationScheme),
    checkKlantId,
    getKlantById
  );
  router.put('/:id',
  requireAuthentication ,
  validate(updateKlantById.validationScheme),
  checkKlantId,
  updateKlantById
  );
  router.delete('/:id',
  requireAuthentication, 
  validate(deleteKlantById.validationScheme),
  checkKlantId,
  deleteKlantById);

  app.use(router.routes())
     .use(router.allowedMethods());
};
