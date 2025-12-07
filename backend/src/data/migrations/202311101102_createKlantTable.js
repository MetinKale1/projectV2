const { tables } = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.klant, (table) => {
      table.increments('klantID');

      table.string('voornaam', 255)
        .notNullable();

      table.string('achternaam', 255)
        .notNullable();

      // table.string('wachtwoord', 255)
      //   .notNullable();

      // table.string('emailadres', 255)
      //   .notNullable();
        
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.klant);
  },
};
