// const supertest = require('supertest');
// const createServer = require('../../src/createServer');
// const { tables, getKnex } = require('../../src/data');
const { tables } = require('../../src/data');
const { withServer, login } = require('../supertest.setup');
const { testAuthHeader } = require('../common/auth');


const data = {
  feedback: [{feedbackID: 1, verhuurID: 1, omschrijving: "Great experience", datum: "2023-11-05", rating: 5},
  {feedbackID: 2, verhuurID: 2, omschrijving: "Needs improvement", datum: "2023-11-04", rating: 3},
  {feedbackID: 3, verhuurID: 3, omschrijving: "Excellent service", datum: "2023-11-03", rating: 5}]
};

const dataToDelete = {
  feedback: [1, 2, 3]
};

describe('Feedback', () => {

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

  const url = '/api/feedback';

  describe('GET /api/feedback', () => {

    beforeAll(async () => {
      await knex(tables.feedback).insert(data.feedback);
    });

    afterAll(async () => {
      await knex(tables.feedback)
        .whereIn('feedbackID', dataToDelete.feedback)
        .delete();
    });

    it('should 200 and return all users', async () => {
      const response = await request.get(url)
      .set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body.count).toBe(3);
      expect(response.body.items.length).toBe(3);

      expect(response.body.items).toEqual(expect.arrayContaining([{feedbackID: 1, verhuurID: 1, omschrijving: "Great experience", datum: "2023-11-05", rating: 5},
      {feedbackID: 2, verhuurID: 2, omschrijving: "Needs improvement", datum: "2023-11-04", rating: 3},
      {feedbackID: 3, verhuurID: 3, omschrijving: "Excellent service", datum: "2023-11-03", rating: 5}]));
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

  describe('GET /api/feedback/:id', () => {

    beforeAll(async () => {
      await knex(tables.feedback).insert(data.feedback[0]);
    });

    afterAll(async () => {
      await knex(tables.feedback)
        .whereIn('feedbackID', dataToDelete.feedback)
        .delete();
    });

    it('should 200 and return the requested user', async () => {
      const response = await request.get(`${url}/1`)
      .set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({feedbackID: 1, 
        verhuurID: 1, 
        omschrijving: "Great experience", 
        datum: "2023-11-05", 
        rating: 5});
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

  describe('POST /api/feedback', () => {

    const feedbackToDelete = [];

    afterAll(async () => {
      // Delete the update users
      await knex(tables.feedback)
        .whereIn('feedbackID', feedbackToDelete)
        .delete();
    });

    it('should 201 and return created user', async () => {
      const response = await request.post(`${url}`)
        .set('Authorization', authHeader)
        .send( {
          verhuurID: 1, 
          omschrijving: "Great experience", 
          datum: "2023-11-05", 
          rating: 5
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.feedbackID).toBeTruthy();
      expect(response.body.verhuurID).toBe(1);
      expect(response.body.omschrijving).toBe('Great experience');
      expect(response.body.datum).toBe('2023-11-05');
      expect(response.body.rating).toBe(5);

      feedbackToDelete.push(response.body.feedbackID);
    });
    it('should 400 when missing name', async () => {
      const response = await request.post(`${url}`)
        .set('Authorization', authHeader)
        .send({
          omschrijving: "Great experience", 
          datum: "2023-11-05", 
          rating: 5
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('verhuurID');
    });

    testAuthHeader(() => request.post(url));
  });

  describe('PUT /api/feedback/:id', () => {

    beforeAll(async () => {
      await knex(tables.feedback).insert(data.feedback[0]);
    });

    afterAll(async () => {
      // Delete the update users
      await knex(tables.feedback)
        .whereIn('feedbackID', dataToDelete.feedback)
        .delete();
    });

    it('should 200 and return the updated user', async () => {
      const response = await request.put(`${url}/1`)
        .set('Authorization', authHeader)
        .send({
          verhuurID: 1, 
          omschrijving: "Great experience changed", 
          datum: "2023-11-05", 
          rating: 5
        });

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        feedbackID: 1, 
        verhuurID: 1, 
        omschrijving: "Great experience changed", 
        datum: "2023-11-05", 
        rating: 5
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
      expect(response.body.details.body).toHaveProperty('verhuurID');
    });

    it('should 404 with not existing user', async () => {
      const response = await request.delete(`${url}/123`)
      .set('Authorization', authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No feedback with id 123 exists',
        details: {
          id: 123,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    testAuthHeader(() => request.put(`${url}/1`));
  });

  describe('DELETE /api/feedback/:id', () => {

    beforeAll(async () => {
      await knex(tables.feedback).insert(data.feedback[0]);
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
        message: 'No feedback with id 123 exists',
        details: {
          id: 123,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    testAuthHeader(() => request.delete(`${url}/1`));
  });
});
