const { tables } = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.feedback, (table) => {
      table.increments('feedbackID');

      table.integer('verhuurID')
        .notNullable();

      table.string('omschrijving', 255)
        .notNullable();

      table.string('datum', 255)
        .notNullable();

      table.integer('rating', 255)
        .notNullable();
        
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.feedback);
  },
};
