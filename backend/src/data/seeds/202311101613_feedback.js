const { tables } = require('..');

module.exports = {
  seed: async (knex) => {
    // first delete all entries
    await knex(tables.feedback).delete();

    // then add the fresh users (all passwords are 12345678)
    await knex(tables.feedback).insert([
      {
        feedbackID: 1, 
        verhuurID: 1, 
        omschrijving: "Great experience", 
        datum: "2023-11-05", 
        rating: 5
      },
      {
        feedbackID: 2, 
        verhuurID: 2, 
        omschrijving: "Needs improvement", 
        datum: "2023-11-04", 
        rating: 3
      },
      {
        feedbackID: 3, 
        verhuurID: 3, 
        omschrijving: "Excellent service", 
        datum: "2023-11-03", 
        rating: 5
      }
    ]);
  },
};
