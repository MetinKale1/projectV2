// const { getLogger } = require('../core/logging');
const feedbackRepository = require('../repository/feedback');
const handleDBError = require('./_handleDBError');
const ServiceError = require('../core/serviceError');
/**
 * Get all users.
 */
const getAll = async () => {
  const items = await feedbackRepository.findAll();
  return {
    items,
    count: items.length,
  };
};

/**
 * Get the user with the given id.
 *
 * @param {number} id - Id of the user to get.
 */
const getById = async (id) => {
  const feedback = await feedbackRepository.findById(id);

  if (!feedback) {
    throw ServiceError.notFound(`No feedback with id ${id} exists`, { id });
  }

  return feedback;
};

/**
 * Register a klant.
 *
 * @param {object} feedback 
 * @param {number} feedback.verhuurID 
 * @param {string} feedback.omschrijving 
 * @param {string} feedback.datum 
 * @param {number} feedback.rating 
 */
const register = async ({ verhuurID,omschrijving,datum,rating}) => {
  try {
    const feedbackId = await feedbackRepository.create({ verhuurID,omschrijving,datum,rating});
    return await feedbackRepository.findById(feedbackId);
  } catch (error) {
    throw handleDBError(error);
  }
};

/**
 * Update an existing klant.
 *
 * @param {number} id 
 * @param {object} feedback 
 * @param {number} feedback.verhuurID 
 * @param {string} feedback.omschrijving 
 * @param {string} feedback.datum 
 * @param {number} feedback.rating 
 */
const updateById = async (id, {  verhuurID,omschrijving,datum,rating}) => {
  try {
    await feedbackRepository.updateById(id, {   verhuurID,omschrijving,datum,rating });
    return getById(id);
  } catch (error) {
    throw handleDBError(error);
  }
};


/**
 * Delete an existing user.
 *
 * @param {number} id - Id of the user to delete.
 */
const deleteById = async (id) => {
  try {
    const deleted = await feedbackRepository.deleteById(id);

    if (!deleted) {
      throw ServiceError.notFound(`No feedback with id ${id} exists`, { id });
    }
  } catch (error) {
    throw handleDBError(error);
  }
};

module.exports = {
  getAll,
  getById,
  register,
  updateById,
  deleteById,
};
