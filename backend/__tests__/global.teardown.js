const { shutdownData, getKnex, tables } = require('../src/data');

module.exports = async () => {
  // Remove any leftover data
  await getKnex()(tables.klant).delete();
  await getKnex()(tables.locatie).delete();
  await getKnex()(tables.fiets).delete();
  await getKnex()(tables.verhuur).delete();
  await getKnex()(tables.feedback).delete();

  // Close database connection
  await shutdownData();
};
