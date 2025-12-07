const { getLogger } = require('../core/logging');
const { tables, getKnex } = require('../data');

/**
 * Get all users.
 */
const findAll = () => {
  return getKnex()(tables.fiets).select().orderBy('model', 'ASC');
};

/**
 * Calculate the total number of user.
 */
const findCount = async () => {
  const [count] = await getKnex()(tables.fiets).count();
  return count['count(*)'];
};

/**
 * Find a user with the given id.
 *
 * @param {number} id - The id to search for.
 */
const findById = (id) => {
  return getKnex()(tables.fiets).where('fietsID', id).first();
};


/**
 * Create a new klant.
 *
 * @param {object} fiets 
 * @param {number} fiets.locatieID 
 * @param {string} fiets.model 
 * @param {string} fiets.type 
 * @param {string} fiets.status 
 * @param {string} fiets.foto 
 */

const create = async ({locatieID,model,type,status,foto}) => {
  try {
    const [fietsID] = await getKnex()(tables.fiets).insert({
      locatieID,
      model,
      type,
      status,
      foto
    });
    return fietsID;
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
 * @param {object} fiets 
 * @param {number} fiets.locatieID 
 * @param {string} fiets.model 
 * @param {string} fiets.type 
 * @param {string} fiets.status 
 * @param {string} fiets.foto 
 */
const updateById = async (id, {locatieID,model,type,status,foto }) => {
  try {
    await getKnex()(tables.fiets)
      .update({
        locatieID,
        model,
        type,
        status,
        foto
      })
      .where('fietsID', id);
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
    const rowsAffected = await getKnex()(tables.fiets).delete().where('fietsID', id);
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
  create,
  updateById,
  deleteById,
};
