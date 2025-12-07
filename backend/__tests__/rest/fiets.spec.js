// const supertest = require('supertest');
// const createServer = require('../../src/createServer');
// const { tables, getKnex } = require('../../src/data');
const { tables } = require('../../src/data');
const { withServer, login } = require('../supertest.setup');
const { testAuthHeader } = require('../common/auth');


const data = {
  fietsen: [{fietsID: 1, locatieID: 1, model: "Bike A", type: "City", status: "Active", foto: "link_to_photo_1"},
  {fietsID: 2, locatieID: 2, model: "Bike B", type: "Mountain", status: "Active", foto: "link_to_photo_2"},
  {fietsID: 3, locatieID: 1, model: "Bike C", type: "City", status: "Inactive", foto: "link_to_photo_3"}]
};

const dataToDelete = {
  fietsen: [1, 2, 3]
};

describe('Fietsen', () => {

  let request, knex, authHeader;

  withServer(({
    supertest,
    knex: k,
  }) => {
    request = supertest;
    knex = k;
  });

  beforeAll(async () => {
    authHeader = await login(request);
  });

  // afterAll(async () => {
  //   await server.stop();
  // });

  const url = '/api/fietsen';

  describe('GET /api/fietsen', () => {

    beforeAll(async () => {
      await knex(tables.fiets).insert(data.fietsen);
    });

    afterAll(async () => {
      await knex(tables.fiets)
        .whereIn('fietsID', dataToDelete.fietsen)
        .delete();
    });

    it('should 200 and return all users', async () => {
      const response = await request.get(url)
      .set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body.count).toBe(3);
      expect(response.body.items.length).toBe(3);

      expect(response.body.items).toEqual(expect.arrayContaining([{
        fietsID: 1, locatieID: 1, model: "Bike A", type: "City", status: "Active", foto: "link_to_photo_1"},
      {fietsID: 2, locatieID: 2, model: "Bike B", type: "Mountain", status: "Active", foto: "link_to_photo_2"},
      {fietsID: 3, locatieID: 1, model: "Bike C", type: "City", status: "Inactive", foto: "link_to_photo_3"}]));
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

  describe('GET /api/fietsen/:id', () => {

    beforeAll(async () => {
      await knex(tables.fiets).insert(data.fietsen[0]);
    });

    afterAll(async () => {
      await knex(tables.fiets)
        .whereIn('fietsID', dataToDelete.fietsen)
        .delete();
    });

    it('should 200 and return the requested user', async () => {
      const response = await request.get(`${url}/1`)
      .set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        fietsID: 1, 
        locatieID: 1, 
        model: "Bike A", 
        type: "City", 
        status: "Active", 
        foto: "link_to_photo_1"
      });
    });
    it('should 400 with invalid user id', async () => {
      const response = await request.get(`${url}/invalid`)
      .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });
    // it('should 404 when requesting not existing fiets', async () => {
    //   const response = await request.get(`${url}/8`)
    //     .set('Authorization', authHeader);

    //   expect(response.statusCode).toBe(404);
    //   expect(response.body).toMatchObject({
    //     code: 'NOT_FOUND',
    //     message: 'No place with id 8 exists',
    //     details: {
    //       id: 8,
    //     },
    //   });
    //   expect(response.body.stack).toBeTruthy();
    // });

    testAuthHeader(() => request.get(`${url}/1`));
  });

  describe('POST /api/fietsen', () => {

    const fietsenToDelete = [];

    afterAll(async () => {
      // Delete the update users
      await knex(tables.fiets)
        .whereIn('fietsID', fietsenToDelete)
        .delete();
    });

    it('should 201 and return created user', async () => {
      const response = await request.post(`${url}`)
        .set('Authorization', authHeader)
        .send({
          locatieID: 1, 
          model: "Bike TEST", 
          type: "City TEST", 
          status: "Active TEST", 
          foto: "link_to_photo_1 TEST"
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.fietsID).toBeTruthy();
      expect(response.body.locatieID).toBe(1);
      expect(response.body.model).toBe('Bike TEST');
      expect(response.body.type).toBe('City TEST');
      expect(response.body.status).toBe('Active TEST');
      expect(response.body.foto).toBe('link_to_photo_1 TEST');

      fietsenToDelete.push(response.body.fietsID);
    });
    it('should 400 when missing name', async () => {
      const response = await request.post(`${url}`)
        .set('Authorization', authHeader)
        .send({
          model: "Bike TEST", 
          type: "City TEST", 
          status: "Active TEST", 
          foto: "link_to_photo_1 TEST"
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('locatieID');
    });

    testAuthHeader(() => request.post(url));
  });

  describe('PUT /api/fietsen/:id', () => {

    beforeAll(async () => {
      await knex(tables.fiets).insert(data.fietsen[0]);
    });

    afterAll(async () => {
      // Delete the update users
      await knex(tables.fiets)
        .whereIn('fietsID', dataToDelete.fietsen)
        .delete();
    });

    it('should 200 and return the updated user', async () => {
      const response = await request.put(`${url}/1`)
        .set('Authorization', authHeader)
        .send({
          locatieID: 1, 
          model: "Bike changed", 
          type: "City changed", 
          status: "Active changed", 
          foto: "link_to_photo_1 changed"
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
          fietsID: 1,
          locatieID: 1, 
          model: "Bike changed", 
          type: "City changed", 
          status: "Active changed", 
          foto: "link_to_photo_1 changed"
      });
    });
    it('should 400 when missing name', async () => {
      const response = await request.put(`${url}/5`)
        .set('Authorization', authHeader)
        .send({
          email: 'update.user@hogent.be',
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('locatieID');
    });

    it('should 404 with not existing user', async () => {
      const response = await request.delete(`${url}/123`)
      .set('Authorization', authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No fiets with id 123 exists',
        details: {
          id: 123,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    testAuthHeader(() => request.put(`${url}/1`));
  });

  describe('DELETE /api/fietsen/:id', () => {

    beforeAll(async () => {
      await knex(tables.fiets).insert(data.fietsen[0]);
    });

    it('should 204 and return nothing', async () => {
      const response = await request.delete(`${url}/1`)
      .set('Authorization', authHeader);

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
      .set('Authorization', authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No fiets with id 123 exists',
        details: {
          id: 123,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    testAuthHeader(() => request.delete(`${url}/1`));
  });
});
