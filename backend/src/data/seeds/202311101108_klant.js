const { tables } = require('..');
const Role = require('../../core/roles');

module.exports = {
  seed: async (knex) => {
    // first delete all entries
    await knex(tables.klant).delete();

    // then add the fresh users (all passwords are 12345678)
    await knex(tables.klant).insert([
      {
        klantID: 1,
        voornaam: "Peter",
        achternaam: "Parker",
        password_hash:
          '$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4',
        emailadres: "peter.parker@email.com",
  profielfoto: "/images/default-profile.jpg",
        roles: JSON.stringify([Role.KLANT, Role.ADMIN]),
      },
      {
        klantID: 2, 
        voornaam: "Jane", 
        achternaam: "Smith", 
        password_hash:
          '$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4',
        emailadres: "jane.smith@email.com",
        roles: JSON.stringify([Role.KLANT]),
      },
    ]);
  },
};
