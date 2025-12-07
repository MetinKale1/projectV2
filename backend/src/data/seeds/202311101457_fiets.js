const { tables } = require('..');

module.exports = {
  seed: async (knex) => {
    // first delete all entries
    await knex(tables.fiets).delete();

    // then add the fresh users (all passwords are 12345678)
    await knex(tables.fiets).insert([
      {
        fietsID: 1, 
        locatieID: 1, 
        model: "Bike A", 
        type: "City", 
        status: "Active", 
        foto: "/images/cityBike.jpg"
      },
      {
        fietsID: 2, 
        locatieID: 2, 
        model: "Bike B", 
        type: "Mountain", 
        status: "Active", 
        foto: "/images/mountain.jpg"
      },
      {
        fietsID: 3, 
        locatieID: 1, 
        model: "Bike C", 
        type: "City", 
        status: "Inactive", 
        foto: "/images/cityBike.jpg"
      }
    ]);
  },
};
