const { getLogger } = require('../core/logging');
const { tables, getKnex } = require('../data');

/**
 * Get all users.
 */
const findAll = () => {
  return getKnex()(tables.locatie).select().orderBy('straat', 'ASC');
};

/**
 * Calculate the total number of user.
 */
const findCount = async () => {
  const [count] = await getKnex()(tables.locatie).count();
  return count['count(*)'];
};

/**
 * Find a user with the given id.
 *
 * @param {number} id - The id to search for.
 */
const findById = (id) => {
  return getKnex()(tables.locatie).where('locatieID', id).first();
};

/**
 * Find a user with the given email.
 *
 * @param {string} gemeente - The email to search for.
 */
const findByGemeente = (gemeente) => {
  return getKnex()(tables.locatie).where('gemeente', gemeente).first();
};

/**
 * Find a user with the given email.
 *
 * @param {string} straat - The email to search for.
 */
const findByStraat = (straat) => {
  return getKnex()(tables.locatie).where('straat', straat).first();
};

/**
 * Create a new klant.
 *
 * @param {object} locatie 
 * @param {string} locatie.straat 
 * @param {number} locatie.nr 
 * @param {string} locatie.gemeente 
 * @param {number} locatie.postcode 
 */

const create = async ({ straat,nr,gemeente,postcode}) => {
  try {
    const [locatieID] = await getKnex()(tables.locatie).insert({
      straat,
      nr,
      gemeente,
      postcode,
    });
    return locatieID;
  } catch (error) {
    getLogger().error('Error in create', {
      error,
    });
    throw error;
  }
};

/**
 * Update a klant with the given `id`.
 *
 * @param {number} id 
 * @param {object} locatie 
 * @param {string} locatie.straat 
 * @param {number} locatie.nr 
 * @param {string} locatie.gemeente 
 * @param {number} locatie.postcode 
 */
const updateById = async (id, {  straat,nr,gemeente,postcode }) => {
  try {
    await getKnex()(tables.locatie)
      .update({
        straat,
        nr,
        gemeente,
        postcode,
      })
      .where('locatieID', id);
    return id;
  } catch (error) {
    getLogger().error('Error in updateById', {
      error,
    });
    throw error;
  }
};

/**
 * Update a user with the given `id`.
 *
 * @param {number} id - Id of the user to delete.
 */
const deleteById = async (id) => {
  try {
    const rowsAffected = await getKnex()(tables.locatie).delete().where('locatieID', id);
    return rowsAffected > 0;
  } catch (error) {
    getLogger().error('Error in deleteById', {
      error,
    });
    throw error;
  }
};

module.exports = {
  findAll,
  findCount,
  findById,
  findByGemeente,
  findByStraat,
  create,
  updateById,
  deleteById,
};
