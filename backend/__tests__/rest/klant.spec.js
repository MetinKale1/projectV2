// const supertest = require('supertest');
// const createServer = require('../../src/createServer');
// const { tables, getKnex } = require('../../src/data');
const { tables } = require('../../src/data');
const Role = require('../../src/core/roles');
const { withServer, login, loginAdmin } = require('../supertest.setup');
const { testAuthHeader } = require('../common/auth');

const data = {
  klanten: [{
    klantID: 3,
        voornaam: "Peter",
        achternaam: "Parker",
        password_hash:
          '$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4',
        emailadres: "peter.parker@email.com",
        roles: JSON.stringify([Role.KLANT, Role.ADMIN]),
  },
  {
    klantID: 4, 
        voornaam: "Jane", 
        achternaam: "Smith", 
        password_hash:
          '$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4',
        emailadres: "jane.smith@email.com",
        roles: JSON.stringify([Role.KLANT]),
  }]
};

const dataToDelete = {
  klanten: [3, 4]
};

describe('Klanten', () => {

  let request, knex, authHeader, adminAuthHeader;

  withServer(({
    supertest,
    knex: k,
  }) => {
    request = supertest;
    knex = k;
  });

  beforeAll(async () => {
    // server = await createServer();
    // request = supertest(server.getApp().callback());
    // knex = getKnex();
    authHeader = await login(request);
    adminAuthHeader = await loginAdmin(request);
  });

  // afterAll(async () => {
  //   await server.stop();
  // });

  const url = '/api/klanten';

  describe('GET /api/klanten', () => {

    beforeAll(async () => {
      await knex(tables.klant).insert(data.klanten);
    });

    afterAll(async () => {
      await knex(tables.klant)
        .whereIn('klantID', dataToDelete.klanten)
        .delete();
    });

    it('should 200 and return all users', async () => {
      const response = await request.get(url)
      .set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body.count).toBeGreaterThanOrEqual(2);
      expect(response.body.items.length).toBeGreaterThanOrEqual(2);

      expect(response.body.items).toEqual(expect.arrayContaining([{
        klantID: 3,
        voornaam: "Peter",
        achternaam: "Parker",
        emailadres: "peter.parker@email.com",
        roles: [Role.KLANT,Role.ADMIN],
      },
      {
        klantID: 4, 
        voornaam: "Jane", 
        achternaam: "Smith", 
        emailadres: "jane.smith@email.com",
        roles: [Role.KLANT],
      }]));
    });

    it('should 400 when given an argument', async () => {
      const response = await request.get(`${url}?invalid=true`)
      .set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.query).toHaveProperty('invalid');
    });

    testAuthHeader(() => request.get(url));
  });

  describe('GET /api/klanten/:id', () => {

    beforeAll(async () => {
      await knex(tables.klant).insert(data.klanten[0]);
    });

    afterAll(async () => {
      await knex(tables.klant)
        .whereIn('klantID', dataToDelete.klanten)
        .delete();
    });

    it('should 200 and return the requested user', async () => {
      const response = await request.get(`${url}/1`)
      .set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        klantID: 1,
        voornaam: 'Test User',
        achternaam:'Test User',
        emailadres: 'test.user@hogent.be',
        roles: [Role.KLANT],
      });
    });

    it('should 400 with invalid user id', async () => {
      const response = await request.get(`${url}/invalid`)
      .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

    testAuthHeader(() => request.get(`${url}/1`));
  });

  describe('POST /api/klanten/register', () => {


    afterAll(async () => {
      // Delete the update users
      await knex(tables.klant)
        .where('klantID', '>', 2) // test user id = 1, admin id = 2
        .delete();
    });

    it('should 201 and return created user', async () => {
      const response = await request.post(`${url}/register`)
        .send({
          voornaam: "new klant", 
          achternaam: "new klant", 
          wachtwoord: "12345678", 
          emailadres: "new@klant.com"
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.token).toBeTruthy();
      expect(response.body.klant.voornaam).toBe('new klant');
      expect(response.body.klant.achternaam).toBe('new klant');
      expect(response.body.klant.emailadres).toBe('new@klant.com');
      expect(response.body.klant.passwordHash).toBeUndefined();

      // klantenToDelete.push(response.body.klantID);
    });

    it('should 400 when missing name', async () => {
      const response = await request.post(`${url}/register`)
        .send({
          emailadres: 'register@hogent.be',
          wachtwoord: '12345678',
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('voornaam');
    });
  });

  describe('PUT /api/klanten/:id', () => {

    beforeAll(async () => {
      await knex(tables.klant).insert(data.klanten[0]);
    });

    afterAll(async () => {
      // Delete the update users
      await knex(tables.klant)
        .whereIn('klantID', dataToDelete.klanten)
        .delete();
    });

    it('should 200 and return the updated user', async () => {
      const response = await request.put(`${url}/3`)
        .set('Authorization', adminAuthHeader)
        .send({
          voornaam: "changed name", 
          achternaam: "changed name", 
          emailadres: "changed@klant.com"
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        klantID: 3,
        voornaam: "changed name",
        achternaam: "changed name",
        emailadres: "changed@klant.com",
        roles: [Role.KLANT,Role.ADMIN],
      });
    });
    it('should 400 when missing name', async () => {
      const response = await request.put(`${url}/4`)
        .set('Authorization', adminAuthHeader)
        .send({
          emailadres: 'update.user@hogent.be',
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('voornaam');
    });

    it('should 404 with not existing user', async () => {
      const response = await request.delete(`${url}/123`)
      .set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No user with id 123 exists',
        details: {
          id: 123,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 403 when not admin', async () => {
      const response = await request.put(`${url}/2`)
        .set('Authorization', authHeader)
        .send({
          voornaam: "changed name", 
          achternaam: "changed name", 
          emailadres: "changed@klant.com"
        });

      expect(response.statusCode).toBe(403);
      expect(response.body).toMatchObject({
        code: 'FORBIDDEN',
        message: 'You are not allowed to view this user\'s information',
      });
      expect(response.body.stack).toBeTruthy();
    });

    testAuthHeader(() => request.put(`${url}/1`));
  });

  describe('DELETE /api/klanten/:id', () => {

    beforeAll(async () => {
      await knex(tables.klant).insert(data.klanten[0]);
    });

    it('should 204 and return nothing', async () => {
      const response = await request.delete(`${url}/3`)
      .set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });
    it('should 400 with invalid user id', async () => {
      const response = await request.get(`${url}/invalid`)
      .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

    it('should 404 with not existing user', async () => {
      const response = await request.delete(`${url}/123`)
      .set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No user with id 123 exists',
        details: {
          id: 123,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 403 when not admin', async () => {
      const response = await request.delete(`${url}/3`)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(403);
      expect(response.body).toMatchObject({
        code: 'FORBIDDEN',
        message: 'You are not allowed to view this user\'s information',
      });
      expect(response.body.stack).toBeTruthy();
    });

    testAuthHeader(() => request.delete(`${url}/1`));

  });
});
