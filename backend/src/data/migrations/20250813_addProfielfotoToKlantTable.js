const { tables } = require('..');

module.exports = {
	up: async (knex) => {
		await knex.schema.alterTable(tables.klant, (table) => {
			table.string('profielfoto', 255).nullable();
		});
	},
	down: async (knex) => {
		await knex.schema.alterTable(tables.klant, (table) => {
			table.dropColumn('profielfoto');
		});
	},
};
