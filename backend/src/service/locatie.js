// const { LOCATIE} = require('../data/mock_data');
const locatieRepository = require('../repository/locatie');
// const locatie = require('../rest/locatie');
const ServiceError = require('../core/serviceError');
const handleDBError = require('./_handleDBError');

/**
 * Get all users.
 */
const getAll = async () => {
  const items = await locatieRepository.findAll();
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
  const locatie = await locatieRepository.findById(id);

  if (!locatie) {
    throw ServiceError.notFound(`No location with id ${id} exists`, { id });
  }

  return locatie;
};

/**
 * Register a klant.
 *
 * @param {object} locatie 
 * @param {string} [locatie.straat] 
 * @param {int} [locatie.nr]
 * @param {string} [locatie.gemeente]
 * @param {int} [locatie.postcode]
 */
const register = async ({ straat,nr,gemeente,postcode }) => {
  try {
    const locatieId = await locatieRepository.create({ straat,nr,gemeente,postcode });
    return await locatieRepository.findById(locatieId);
  } catch (error) {
    throw handleDBError(error);
  }
};

/**
 * Update an existing klant.
 *
 * @param {number} id 
 * @param {object} locatie 
 * @param {string} [locatie.straat] 
 * @param {int} [locatie.nr]
 * @param {string} [locatie.gemeente]
 * @param {int} [locatie.postcode]
 */
const updateById = async (id, { straat,nr,gemeente,postcode }) => {
  try {
    await locatieRepository.updateById(id, { straat,nr,gemeente,postcode});
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
    const deleted = await locatieRepository.deleteById(id);

    if (!deleted) {
      throw ServiceError.notFound(`No location with id ${id} exists`, { id });
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
