const { getLogger } = require('../core/logging');
const { tables, getKnex } = require('../data');

/**
 * Get all users.
 */
const findAll = () => {
  return getKnex()(tables.klant).select().orderBy('voornaam', 'ASC');
};

/**
 * Calculate the total number of user.
 */
const findCount = async () => {
  const [count] = await getKnex()(tables.klant).count();
  return count['count(*)'];
};

/**
 * Find a user with the given id.
 *
 * @param {number} id - The id to search for.
 */
const findById = (id) => {
  return getKnex()(tables.klant).where('klantID', id).first();
};

/**
 * Find a user with the given email.
 *
 * @param {string} email - The email to search for.
 */
const findByEmail = (email) => {
  return getKnex()(tables.klant).where('emailadres', email).first();
};

/**
 * Create a new klant.
 *
 * @param {object} klant 
 * @param {string} klant.voornaam 
 * @param {string} klant.achternaam 
 * @param {string} klant.passwordHash 
 * @param {string} klant.emailadres 
 */

const create = async ({ voornaam,achternaam,passwordHash,emailadres,roles}) => {
  try {
    const [klantID] = await getKnex()(tables.klant).insert({
      voornaam,
      achternaam,
      password_hash:passwordHash,
      emailadres,
      roles:JSON.stringify(roles),
    });
    return klantID;
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
 * @param {object} klant 
 * @param {string} klant.voornaam 
 * @param {string} klant.achternaam 
 * @param {string} klant.wachtwoord 
 * @param {string} klant.emailadres 
 * @param {string} [klant.profielfoto] - NIEUW: Base64 profielfoto
 */
const updateById = async (id, { voornaam, achternaam, wachtwoord, emailadres, profielfoto }) => {
  try {
    // ✅ FIX: Build update object - only include defined fields
    // Dit voorkomt errors bij undefined values
    const updateData = {};
    
    if (voornaam !== undefined) updateData.voornaam = voornaam;
    if (achternaam !== undefined) updateData.achternaam = achternaam;
    if (wachtwoord !== undefined) updateData.wachtwoord = wachtwoord;
    if (emailadres !== undefined) updateData.emailadres = emailadres;
    if (profielfoto !== undefined) updateData.profielfoto = profielfoto; // ✅ NIEUW

    await getKnex()(tables.klant)
      .update(updateData) // ✅ Gebruik updateData in plaats van direct object
      .where('klantID', id);
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
    const rowsAffected = await getKnex()(tables.klant).delete().where('klantID', id);
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
  findByEmail,
  create,
  updateById,
  deleteById,
};
