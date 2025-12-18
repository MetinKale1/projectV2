const { tables } = require('..');

module.exports = {
  up: async (knex) => {
    // Verander profielfoto naar LONGTEXT voor base64 images
    await knex.schema.alterTable(tables.klant, (table) => {
      table.text('profielfoto', 'longtext').nullable().alter();
    });

    // Verander foto naar LONGTEXT voor base64 images
    await knex.schema.alterTable(tables.fiets, (table) => {
      table.text('foto', 'longtext').nullable().alter();
    });
  },
  
  down: async (knex) => {
    // Terug naar string bij rollback
    await knex.schema.alterTable(tables.klant, (table) => {
      table.string('profielfoto', 255).nullable().alter();
    });

    await knex.schema.alterTable(tables.fiets, (table) => {
      table.string('foto', 255).nullable().alter();
    });
  },
};
