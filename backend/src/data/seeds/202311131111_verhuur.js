const { tables } = require('..');

module.exports = {
  seed: async (knex) => {
    // first delete all entries
    await knex(tables.verhuur).delete();

    // then add the fresh users
    await knex(tables.verhuur).insert([
      {
        verhuurID: 1, 
        klantID: 1, 
        fietsID: 1,
        uitleendatum: "2023-11-03", 
        inleverdatum: "2023-11-05"
      },
      {
        verhuurID: 2, 
        klantID: 2, 
        fietsID: 2, 
        uitleendatum: "2023-11-02", 
        inleverdatum: "2023-11-04"
      },
      {
        verhuurID: 3, 
        klantID: 1, 
        fietsID: 3, 
        uitleendatum: "2023-11-01", 
        inleverdatum: "2023-11-03"
      }
    ]);
  },
};
