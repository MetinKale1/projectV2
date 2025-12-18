const Router = require('@koa/router');
const verhuurService = require('../service/verhuur');
const { requireAuthentication } = require('../core/auth');

const getAlleVerhuur = async (ctx) => {
  const verhuur = await verhuurService.getAll();
  ctx.body = verhuur;
};

  const getVerhuurByKlantId = async (ctx) => {
    const klantID = Number(ctx.params.klantID);
    const verhuur = await verhuurService.getAllByKlantId(klantID);
    ctx.body = verhuur;
  };

const register = async (ctx) => {
  const verhuur = await verhuurService.register(ctx.request.body);
  ctx.status = 200;
  ctx.body = verhuur;
};


const getVerhuurById = async (ctx) => {
  const verhuur = await verhuurService.getById(Number(ctx.params.id));
  ctx.status = 200;
  ctx.body = verhuur;
};
const updateVerhuurById = async (ctx) => {
  const verhuur = await verhuurService.updateById(ctx.params.id, ctx.request.body);
  ctx.status = 200;
  ctx.body = verhuur;
};

const deleteVerhuurById = async (ctx) => {
  await verhuurService.deleteById(ctx.params.id);
  ctx.status = 204;
};

/**
 * Install transaction routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: '/verhuur',
  });
  router.use(requireAuthentication);

  router.get('/', getAlleVerhuur);
  router.get('/klant/:klantID', getVerhuurByKlantId);
  router.post('/', register);
  router.get('/:id', getVerhuurById);
  router.put('/:id', updateVerhuurById);
  router.delete('/:id', deleteVerhuurById);

  app.use(router.routes())
     .use(router.allowedMethods());
};
