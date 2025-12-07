// const { getLogger } = require('../core/logging');
// const { VERHUUR, KLANT,FIETS } = require('../data/mock_data');
const verhuurRepository = require('../repository/verhuur');
const fietsService = require('./fiets');
const klantService = require('./klant');
const feedbackService = require('./feedback');

const getAll = async () => {
  const items = await verhuurRepository.findAll();
  return {
    items,
    count: items.length,
  };
};

  const getAllByKlantId = async (klantID) => {
    const items = await verhuurRepository.findAllByKlantId(klantID);
    return {
      items,
      count: items.length,
    };
  };

const getById = async (id) => {
  const verhuur = await verhuurRepository.findById(id);

  if (!verhuur) {
    throw Error(`No verhuur with id ${id} exists`, { id });
  }

  return verhuur;
};

/**
 * Register a klant.
 *
 * @param {object} verhuur 
 * @param {number} verhuur.klantID 
 * @param {number} verhuur.fietsID 
 * @param {string} verhuur.uitleendatum 
 * @param {string} verhuur.inleverdatum
 */
const register = async ({ klantID,fietsID,uitleendatum,inleverdatum}) => {
  const existingKlant = await klantService.getById(klantID);
  const existingFiets = await fietsService.getById(fietsID);

  if (!existingFiets) {
    throw Error(`There is no fiets with id ${fietsID}.`, { fietsID });
  }

  if (!existingKlant) {
    throw Error(`There is no klant with id ${klantID}.`, { klantID });
  }

  // Controleer of de fiets al verhuurd is (status = 'verhuurd')
  if (existingFiets.status === 'verhuurd') {
    throw Error('Deze fiets is momenteel al verhuurd en kan niet opnieuw verhuurd worden.', { fietsID });
  }

  const verhuurID = await verhuurRepository.create({klantID,fietsID,uitleendatum,inleverdatum});

  // Zet de status van de fiets op 'verhuurd'
  await fietsService.updateById(fietsID, { ...existingFiets, status: 'verhuurd' });

  const verhuur = await verhuurRepository.findById(verhuurID);

  return verhuur;
};

/**
 * Update an existing klant.
 *
 * @param {number} id 
 * @param {object} verhuur 
 * @param {number} verhuur.klantID 
 * @param {number} verhuur.fietsID 
 * @param {string} verhuur.uitleendatum 
 * @param {string} verhuur.inleverdatum
 */
const updateById = async (id, {  klantID,fietsID,uitleendatum,inleverdatum}) => {
  await verhuurRepository.updateById(id, { klantID,fietsID,uitleendatum,inleverdatum});
  // Zet de fiets op 'beschikbaar' als de inleverdatum vandaag of eerder is
  if (inleverdatum && fietsID) {
    const vandaag = new Date().toISOString().slice(0, 10);
    if (inleverdatum <= vandaag) {
      const fiets = await fietsService.getById(fietsID);
      await fietsService.updateById(fietsID, { ...fiets, status: 'beschikbaar' });
    }
  }
  return getById(id);
};


const deleteById = async (id) => {
  // Zoek de verhuur op
  const verhuur = await verhuurRepository.findById(id);
  if (!verhuur) {
    throw Error(`No verhuur with id ${id} exists`, { id });
  }
  // Zet de fiets weer op 'beschikbaar'
  if (verhuur.fiets && verhuur.fiets.fietsID) {
    const fiets = await fietsService.getById(verhuur.fiets.fietsID);
    await fietsService.updateById(fiets.fietsID, { ...fiets, status: 'beschikbaar' });
  }
  // Verwijder de verhuur
  const deleted = await verhuurRepository.deleteById(id);
  if (!deleted) {
    throw Error(`No verhuur with id ${id} exists`, { id });
  }
};

module.exports = {
  getAll,
  getAllByKlantId,
  getById,
  register,
  updateById,
  deleteById,
};
