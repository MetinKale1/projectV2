const { tables } = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.fiets, (table) => {
      table.increments('fietsID');

      table.integer('locatieID')
        .notNullable();

      table.string('model', 255)
        .notNullable();

      table.string('type', 255)
        .notNullable();

      table.string('status', 255)
        .notNullable();

      table.string('foto')
        .notNullable();
        
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.fiets);
  },
};
