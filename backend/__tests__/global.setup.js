const config = require('config');

const { initializeLogger } = require('../src/core/logging');
const Role = require('../src/core/roles');
const { initializeData, getKnex, tables } = require('../src/data');

module.exports = async () => {
  // Create a database connection
  initializeLogger(config.get('log.level'), config.get('log.disabled'));
  await initializeData();

  // Insert a test user with password 12345678
  const knex = getKnex();

  await knex(tables.klant).insert([
    {
      klantID: 1,
      voornaam: 'Test User',
      achternaam:'Test User',
      password_hash:
        '$argon2id$v=19$m=2048,t=2,p=1$NF6PFLTgSYpDSex0iFeFQQ$Rz5ouoM9q3EH40hrq67BC3Ajsu/ohaHnkKBLunELLzU',
      emailadres: 'test.user@hogent.be',
      roles: JSON.stringify([Role.KLANT]),
    },
    {
      klantID: 2,
      voornaam: 'Admin User',
      achternaam:'Admin User',
      password_hash:
        '$argon2id$v=19$m=2048,t=2,p=1$NF6PFLTgSYpDSex0iFeFQQ$Rz5ouoM9q3EH40hrq67BC3Ajsu/ohaHnkKBLunELLzU',
      emailadres: 'admin.user@hogent.be',
      roles: JSON.stringify([Role.ADMIN, Role.KLANT]),
    },
  ]);
};
