const supertest = require('supertest');
const createServer = require('../../src/createServer');
const { tables, getKnex } = require('../../src/data');
const { withServer, login } = require('../supertest.setup');
const { testAuthHeader } = require('../common/auth');

const data = {
  locatie: [
    {
      locatieID: 1,
      straat: "Main Street", 
      nr: 123, 
      gemeente: "City", 
      postcode: 12345
    },
    {
      locatieID: 2, 
      straat: "Elm Street", 
      nr: 456, 
      gemeente: "Town", 
      postcode: 67890
    }
  ]
};

const dataToDelete = {
  locatie: [1, 2],
};

describe('Locaties', () => {
  let authHeader;
  let request;
  let knex;

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
  });

  // afterAll(async () => {
  //   await server.stop();
  // });

  const url = '/api/locaties';

  describe('GET /api/locaties', () => {

    beforeAll(async () => {
      await knex(tables.locatie).insert(data.locatie);
    });

    afterAll(async () => {
      await knex(tables.locatie)
        .whereIn('locatieID', dataToDelete.locatie)
        .delete();
    });

    it('should 200 and return all places', async () => {
      const response = await request.get(url)
      .set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body.count).toBe(2);
      expect(response.body.items.length).toBe(2);

      expect(response.body.items).toEqual(expect.arrayContaining([{
        locatieID: 1,
        straat: "Main Street", 
        nr: 123, 
        gemeente: "City", 
        postcode: 12345
      },
      {
        locatieID: 2, 
        straat: "Elm Street", 
        nr: 456, 
        gemeente: "Town", 
        postcode: 67890
      }]));
    });

    it('should 400 when given an argument', async () => {
      const response = await request.get(`${url}?invalid=true`)
      .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.query).toHaveProperty('invalid');
    });
    testAuthHeader(() => request.get(url));
  });

  describe('GET /api/locaties/:id', () => {

    beforeAll(async () => {
      await knex(tables.locatie).insert(data.locatie[0]);
    });

    afterAll(async () => {
      await knex(tables.locatie)
        .whereIn('locatieID', dataToDelete.locatie)
        .delete();
    });

    it('should 200 and return the requested place', async () => {
      const response = await request.get(`${url}/1`)
      .set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        locatieID: 1,
        straat: "Main Street", 
        nr: 123, 
        gemeente: "City", 
        postcode: 12345
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

  describe('POST /api/locaties', () => {

    const locatiesToDelete = [];

    afterAll(async () => {
      await knex(tables.locatie)
        .whereIn('locatieID', locatiesToDelete)
        .delete();
    });

    it('should 201 and return the created place', async () => {
      const response = await request.post(url)
        .set('Authorization', authHeader)
        .send({
          straat: "test Street", 
          nr: 12345, 
          gemeente: "test City", 
          postcode: 31316969
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.locatieID).toBeTruthy();
      expect(response.body.straat).toBe('test Street');
      expect(response.body.nr).toBe(12345);
      expect(response.body.gemeente).toBe('test City');
      expect(response.body.postcode).toBe(31316969);

      locatiesToDelete.push(response.body.locatieID);
    });
    it('should 400 when missing straat', async () => {
      const response = await request.post(`${url}`)
        .set('Authorization', authHeader)
        .send({
          nr: 123,
          gemeente: 'sdjghsd',
          postcode: 234
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('straat');
    });
    testAuthHeader(() => request.post(url));
  });

  describe('PUT /api/locaties/:id', () => {

    beforeAll(async () => {
      await knex(tables.locatie).insert(data.locatie[0]);
    });

    afterAll(async () => {
      await knex(tables.locatie)
        .whereIn('locatieID', dataToDelete.locatie)
        .delete();
    });

    it('should 200 and return the updated place', async () => {
      const response = await request.put(`${url}/1`)
        .set('Authorization', authHeader)
        .send({
          straat: "changed Street", 
          nr: 12345, 
          gemeente: "changed City", 
          postcode: 31316969
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        locatieID: 1,
        straat: "changed Street", 
        nr: 12345, 
        gemeente: "changed City", 
        postcode: 31316969
      });
    });

    it('should 400 when missing name', async () => {
      const response = await request.put(`${url}/5`)
        .set('Authorization', authHeader)
        .send({
          postcode: 156,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('straat');
    });

    it('should 404 with not existing user', async () => {
      const response = await request.delete(`${url}/123`)
      .set('Authorization', authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No location with id 123 exists',
        details: {
          id: 123,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });
    testAuthHeader(() => request.put(`${url}/1`));
  });

  describe('DELETE /api/locaties/:id', () => {

    beforeAll(async () => {
      await knex(tables.locatie).insert(data.locatie[0]);
    });

    it('should 204 and return nothing', async () => {
      const response = await request.delete(`${url}/1`)
      .set('Authorization', authHeader);

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });
    it('should 400 with invalid location id', async () => {
      const response = await request.get(`${url}/invalid`)
      .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

    it('should 404 with not existing location', async () => {
      const response = await request.delete(`${url}/123`)
      .set('Authorization', authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No location with id 123 exists',
        details: {
          id: 123,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });
    testAuthHeader(() => request.delete(`${url}/1`));
  });

});
