// const { getLogger } = require('../core/logging');
const ServiceError = require('../core/serviceError');
const klantRepository = require('../repository/klant');
const handleDBError = require('./_handleDBError');
const { hashPassword, verifyPassword } = require('../core/password');
const { generateJWT, verifyJWT } = require('../core/jwt');
const Role = require('../core/roles');
const { getLogger } = require('../core/logging');


const makeExposedUser = ({ klantID, voornaam, achternaam, emailadres, profielfoto, roles }) => ({
  klantID,
  voornaam,
  achternaam,
  emailadres,
  profielfoto,
  roles,
});

const makeLoginData = async (klant) => {
  const token = await generateJWT(klant);
  console.log('Generating JWT with payload:', token);
  return {
    klant: makeExposedUser(klant),
    token,
  };
};

const checkAndParseSession = async (authHeader) => {
  if (!authHeader) {
    throw ServiceError.unauthorized('You need to be signed in');
  } 

  if (!authHeader.startsWith('Bearer ')) {
    throw ServiceError.unauthorized('Invalid authentication token');
  }

  const authToken = authHeader.substring(7);
  try {
    const { roles, klantId } = await verifyJWT(authToken);


    return {
      klantId,
      roles,
      authToken,
    };
  } catch (error) {
    getLogger().error(error.message, { error });
    throw new Error(error.message);
  }
};

const checkRole = (role, roles) => {
  const hasPermission = roles.includes(role); // 👈 1

  if (!hasPermission) {
    throw ServiceError.forbidden(
      'You are not allowed to view this part of the application'
    ); // 👈 2
  }
};

const login = async (email, password) => {
  const klant = await klantRepository.findByEmail(email);
  console.log(klant)
  if (!klant) {
    // DO NOT expose we don't know the user
    throw ServiceError.unauthorized(
      'The given email and password do not match'
    );
  }

  const passwordValid = await verifyPassword(password, klant.password_hash);

  if (!passwordValid) {
    // DO NOT expose we know the user but an invalid password was given
    throw ServiceError.unauthorized(
      'The given email and password do not match'
    );
  }

  return await makeLoginData(klant);
};


/**
 * Get all users.
 */
const getAll = async () => {

  const items = await klantRepository.findAll();
  return {
    items:items.map(makeExposedUser),
    count: items.length,
  };
};

/**
 * Get the user with the given id.
 *
 * @param {number} id - Id of the user to get.
 */
const getById = async (id) => {
  const klant = await klantRepository.findById(id);

  if (!klant) {
    throw ServiceError.notFound(`No klant with id ${id} exists`, { id });
  }

  return makeExposedUser(klant);
};

/**
 * Register a klant.
 *
 * @param {object} klant 
 * @param {string} [klant.voornaam] 
 * @param {string} [klant.achternaam]
 * @param {string} [klant.wachtwoord]
 * @param {string} [klant.emailadres]
 */
const register = async ({ voornaam,achternaam,wachtwoord,emailadres }) => {
  try {
    const passwordHash = await hashPassword(wachtwoord);

    const klantId = await klantRepository.create({ voornaam,achternaam,passwordHash,emailadres,roles:[Role.KLANT], });
    const klant = await klantRepository.findById(klantId);
    return await makeLoginData(klant);
  } catch (error) {
    throw handleDBError(error);
  }
};

/**
 * Update an existing klant.
 *
 * @param {number} id 
 * @param {object} klant 
 * @param {string} [klant.voornaam] 
 * @param {string} [klant.achternaam]
 * @param {string} [klant.wachtwoord]
 * @param {string} [klant.emailadres]
 */
const updateById = async (id, { voornaam, achternaam, wachtwoord, emailadres, profielfoto }) => {
  try {
    await klantRepository.updateById(id, { voornaam, achternaam, wachtwoord, emailadres, profielfoto });
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
    const deleted = await klantRepository.deleteById(id);

    if (!deleted) {
      throw ServiceError.notFound(`No user with id ${id} exists`, { id });
    }
  } catch (error) {
    throw handleDBError(error);
  }
};

module.exports = {
  checkAndParseSession,
  checkRole,
  login,
  getAll,
  getById,
  register,
  updateById,
  deleteById,
  
};
