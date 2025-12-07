const { tables } = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.verhuur, (table) => {
      table.increments('verhuurID');

      table.integer('klantID')
        .unsigned()
        .notNullable();

      // Give this foreign key a name for better error handling in service layer
      table.foreign('klantID')
        .references(`klantID`)
        .inTable('klant')
        .onDelete('CASCADE');//fout
      
      table.integer('fietsID')
        .unsigned()
        .notNullable();

      // Give this foreign key a name for better error handling in service layer
      table.foreign('fietsID')
        .references(`fietsID`)
        .inTable('fiets')
        .onDelete('CASCADE');//fout

      table.string('uitleendatum')
        .notNullable();

      table.string('inleverdatum')
        .notNullable();
      
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.transaction);
  },
};
