const { tables } = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.locatie, (table) => {
      table.increments('locatieID');

      table.string('straat', 255)
        .notNullable();

      table.integer('nr')
        .notNullable();

      table.string('gemeente', 255)
        .notNullable();

      table.integer('postcode')
        .notNullable();
        
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.locatie);
  },
};
