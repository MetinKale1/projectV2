const { getLogger } = require('../core/logging');
const { tables, getKnex } = require('../data');

/**
 * Get all users.
 */
const findAll = () => {
  return getKnex()(tables.feedback).select().orderBy('datum', 'DESC');
};

/**
 * Calculate the total number of user.
 */
const findCount = async () => {
  const [count] = await getKnex()(tables.feedback).count();
  return count['count(*)'];
};

/**
 * Find a user with the given id.
 *
 * @param {number} id - The id to search for.
 */
const findById = (id) => {
  return getKnex()(tables.feedback).where('feedbackID', id).first();
};

/**
 * Find a user with the given email.
 *
 * @param {number} verhuurID - The email to search for.
 */
const findByVerhuur = (verhuurID) => {
  return getKnex()(tables.feedback).where('verhuurID', verhuurID).first();
};

/**
 * Create a new klant.
 *
 * @param {object} feedback 
 * @param {number} feedback.verhuurID 
 * @param {string} feedback.omschrijving 
 * @param {string} feedback.datum 
 * @param {number} feedback.rating 
 */

const create = async ({verhuurID,omschrijving,datum,rating}) => {
  try {
    const [feedbackID] = await getKnex()(tables.feedback).insert({
      verhuurID,
      omschrijving,
      datum,
      rating
    });
    return feedbackID;
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
 * @param {object} feedback 
 * @param {number} feedback.verhuurID 
 * @param {string} feedback.omschrijving 
 * @param {string} feedback.datum 
 * @param {number} feedback.rating 
 */
const updateById = async (id, {verhuurID,omschrijving,datum,rating}) => {
  try {
    await getKnex()(tables.feedback)
      .update({
        verhuurID,
        omschrijving,
        datum,
        rating
      })
      .where('feedbackID', id);
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
    const rowsAffected = await getKnex()(tables.feedback).delete().where('feedbackID', id);
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
  findByVerhuur,
  create,
  updateById,
  deleteById,
};
