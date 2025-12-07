const { tables } = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.alterTable(tables.klant, (table) => {
      table.string('emailadres').notNullable();

      table.string('password_hash').notNullable();

      table.jsonb('roles').notNullable();

      table.unique('emailadres', 'idx_user_email_unique');
    });
  },
  down: (knex) => {
    return knex.schema.alterTable(tables.klant, (table) => {
      table.dropColumns('emailadres', 'password_hash', 'roles');
    });
  },
};
