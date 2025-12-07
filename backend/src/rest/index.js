const Router = require('@koa/router');
const installKlantRouter = require('./klant');
const installHealthRouter = require('./health');
const installLocatieRouter = require('./locatie');
const installFietsRouter = require('./fiets');
const installFeedbackRouter = require('./feedback');
const installVerhuurRouter = require('./verhuur');

/**
 * Install all routes in the given Koa application.
 *
 * @param {Koa} app - The Koa application.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: '/api',
  });

  installKlantRouter(router);
  installHealthRouter(router);
  installLocatieRouter(router);
  installFietsRouter(router);
  installFeedbackRouter(router);
  installVerhuurRouter(router);

  app.use(router.routes())
     .use(router.allowedMethods());
};
