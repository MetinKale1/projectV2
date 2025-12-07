// const { getLogger } = require('../core/logging');
const fietsRepository = require('../repository/fiets');
// const fiets = require('../rest/fiets');
const handleDBError = require('./_handleDBError');
const ServiceError = require('../core/serviceError');

/**
 * Get all users.
 */
const getAll = async () => {
  const items = await fietsRepository.findAll();
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
  const fiets = await fietsRepository.findById(id);

  if (!fiets) {
    throw ServiceError.notFound(`No fiets with id ${id} exists`, { id });
  }

  return fiets;
};

/**
 * Register a klant.
 *
 * @param {object} fiets 
 * @param {number} fiets.locatieID 
 * @param {string} fiets.model 
 * @param {string} fiets.type 
 * @param {string} fiets.status 
 * @param {string} fiets.foto 
 */
const register = async ({ locatieID,model,type,status,foto}) => {
  try {
    const fietsId = await fietsRepository.create({ locatieID,model,type,status,foto});
    return await fietsRepository.findById(fietsId);
  } catch (error) {
    throw handleDBError(error);
  }
};

/**
 * Update an existing klant.
 *
 * @param {number} id 
 * @param {object} fiets 
 * @param {number} fiets.locatieID 
 * @param {string} fiets.model 
 * @param {string} fiets.type 
 * @param {string} fiets.status 
 * @param {string} fiets.foto 
 */
const updateById = async (id, {  locatieID,model,type,status,foto}) => {
  try {
    await fietsRepository.updateById(id, { locatieID,model,type,status,foto });
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
    const deleted = await fietsRepository.deleteById(id);

    if (!deleted) {
      throw ServiceError.notFound(`No fiets with id ${id} exists`, { id });
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
