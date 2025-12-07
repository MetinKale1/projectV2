const { tables } = require('..');

module.exports = {
  seed: async (knex) => {
    // first delete all entries
    await knex(tables.locatie).delete();

    // then add the fresh users (all passwords are 12345678)
    await knex(tables.locatie).insert([
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
    ]);
  },
};
