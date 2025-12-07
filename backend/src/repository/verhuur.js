/**
 * Haal alle verhuur op voor een specifieke klantID
 * @param {number} klantID
 */
const findAllByKlantId = async (klantID) => {
  const verhuurRows = await getKnex()(tables.verhuur)
    .where('klantID', klantID)
    .orderBy('uitleendatum', 'ASC');

  const verhuurList = await Promise.all(verhuurRows.map(async (verhuur) => {
    const klant = await getKnex()(tables.klant)
      .where('klantID', verhuur.klantID)
      .first();
    const fiets = await getKnex()(tables.fiets)
      .where('fietsID', verhuur.fietsID)
      .first();
    const feedback = await getKnex()(tables.feedback)
      .where('verhuurID', verhuur.verhuurID)
      .first();
    return {
      verhuurID: verhuur.verhuurID,
      uitleendatum: verhuur.uitleendatum,
      inleverdatum: verhuur.inleverdatum,
      klant: klant ? {
        klantID: klant.klantID,
        voornaam: klant.voornaam,
        achternaam: klant.achternaam,
        emailadres: klant.emailadres,
      } : null,
      fiets: fiets ? {
        fietsID: fiets.fietsID,
        locatieID: fiets.locatieID,
        model: fiets.model,
        type: fiets.type,
        status: fiets.status,
        foto: fiets.foto,
      } : null,
      feedback: feedback ? {
        feedbackID: feedback.feedbackID,
        verhuurID: feedback.verhuurID,
        omschrijving: feedback.omschrijving,
        datum: feedback.datum,
        rating: feedback.rating,
      } : {
        feedbackID: null,
        verhuurID: null,
        omschrijving: null,
        datum: null,
        rating: null,
      },
    };
  }));

  return verhuurList;
};
const { getLogger } = require('../core/logging');
const { tables, getKnex } = require('../data/index');
// const { VERHUUR } = require('../data/mock_data');

const formatVerhuur = ({
  klantID,
  voornaam,
  achternaam,
  // wachtwoord,
  emailadres,
  fietsID,
  locatieID,
  model,
  type,
  status,
  foto,
  feedbackID,
  verhuurID,
  omschrijving,
  datum,
  rating,
  ...verhuur
}) => {
  // Fix: verhuurID kan onder verschillende namen binnenkomen
  const id = verhuurID || verhuur.verhuurID || verhuur['verhuurID'] || null;
  return {
    verhuurID: id,
    ...verhuur,
    klant:{
      klantID,
      voornaam,
      achternaam,
      // wachtwoord,
      emailadres,
    },
    fiets:{
      fietsID,
      locatieID,
      model,
      type,
      status,
      foto,
    },
    feedback:{
      feedbackID,
      verhuurID: id,
      omschrijving,
      datum,
      rating,
    }
  };
};

const SELECT_COLUMNS = [
  `${tables.verhuur}.verhuurID`,
  `${tables.verhuur}.klantID`,
  `${tables.verhuur}.fietsID`,
  `${tables.verhuur}.uitleendatum`,
  `${tables.verhuur}.inleverdatum`,
  `${tables.klant}.klantID`,
  `${tables.klant}.voornaam`,
  `${tables.klant}.achternaam`,
  // `${tables.klant}.wachtwoord`,
  `${tables.klant}.emailadres`,
  `${tables.fiets}.fietsID`,
  `${tables.fiets}.locatieID`,
  `${tables.fiets}.model`,
  `${tables.fiets}.type`,
  `${tables.fiets}.status`,
  `${tables.fiets}.foto`,
  `${tables.feedback}.feedbackID`,
  `${tables.feedback}.verhuurID`,
  `${tables.feedback}.omschrijving`,
  `${tables.feedback}.datum`,
  `${tables.feedback}.rating`,
];

/**
 * Get all transactions
 *
 */
const findAll = async () => {
  // Haal alle verhuur direct uit de verhuur-tabel
  const verhuurRows = await getKnex()(tables.verhuur).orderBy('uitleendatum', 'ASC');

  // Voeg klant, fiets en feedback info toe
  const verhuurList = await Promise.all(verhuurRows.map(async (verhuur) => {
    const klant = await getKnex()(tables.klant)
      .where('klantID', verhuur.klantID)
      .first();
    const fiets = await getKnex()(tables.fiets)
      .where('fietsID', verhuur.fietsID)
      .first();
    const feedback = await getKnex()(tables.feedback)
      .where('verhuurID', verhuur.verhuurID)
      .first();
    return {
      verhuurID: verhuur.verhuurID,
      uitleendatum: verhuur.uitleendatum,
      inleverdatum: verhuur.inleverdatum,
      klant: klant ? {
        klantID: klant.klantID,
        voornaam: klant.voornaam,
        achternaam: klant.achternaam,
        emailadres: klant.emailadres,
      } : null,
      fiets: fiets ? {
        fietsID: fiets.fietsID,
        locatieID: fiets.locatieID,
        model: fiets.model,
        type: fiets.type,
        status: fiets.status,
        foto: fiets.foto,
      } : null,
      feedback: feedback ? {
        feedbackID: feedback.feedbackID,
        verhuurID: feedback.verhuurID,
        omschrijving: feedback.omschrijving,
        datum: feedback.datum,
        rating: feedback.rating,
      } : {
        feedbackID: null,
        verhuurID: null,
        omschrijving: null,
        datum: null,
        rating: null,
      },
    };
  }));

  return verhuurList;
};

/**
 * Calculate the total number of transactions.
 *
 */
const findCount = async () => {
  const [count] = await getKnex()(tables.verhuur).count();

  return count['count(*)'];
};

/**
 * Find a transaction with the given `id`.
 *
 * @param {number} id - Id of the transaction to find.
 */
const findById = async (id) => {
  // Haal verhuur direct uit de verhuur-tabel
  const verhuur = await getKnex()(tables.verhuur)
    .where('verhuurID', id)
    .first();

  if (!verhuur) return null;

  // Haal klant info op
  const klant = await getKnex()(tables.klant)
    .where('klantID', verhuur.klantID)
    .first();

  // Haal fiets info op
  const fiets = await getKnex()(tables.fiets)
    .where('fietsID', verhuur.fietsID)
    .first();

  // Haal feedback info op (optioneel)
  const feedback = await getKnex()(tables.feedback)
    .where('verhuurID', verhuur.verhuurID)
    .first();

  return {
    verhuurID: verhuur.verhuurID,
    uitleendatum: verhuur.uitleendatum,
    inleverdatum: verhuur.inleverdatum,
    klant: klant ? {
      klantID: klant.klantID,
      voornaam: klant.voornaam,
      achternaam: klant.achternaam,
      emailadres: klant.emailadres,
    } : null,
    fiets: fiets ? {
      fietsID: fiets.fietsID,
      locatieID: fiets.locatieID,
      model: fiets.model,
      type: fiets.type,
      status: fiets.status,
      foto: fiets.foto,
    } : null,
    feedback: feedback ? {
      feedbackID: feedback.feedbackID,
      verhuurID: feedback.verhuurID,
      omschrijving: feedback.omschrijving,
      datum: feedback.datum,
      rating: feedback.rating,
    } : {
      feedbackID: null,
      verhuurID: null,
      omschrijving: null,
      datum: null,
      rating: null,
    },
  };
};

/**
 * Create a new transaction.
 *
 * @param {object} verhuur - The transaction to create.
 * @param {number} verhuur.klantID - Amount deposited/withdrawn.
 * @param {number} verhuur.fietsID
 * @param {string} verhuur.uitleendatum - Date of the transaction.
 * @param {string} verhuur.inleverdatum - Id of the place the transaction happened.
 *
 * @returns {Promise<number>} Created transaction's id
 */
const create = async ({ klantID, fietsID, uitleendatum, inleverdatum }) => {
  try {
    let verhuurID;
    try {
      const result = await getKnex()(tables.verhuur)
        .insert({
          klantID,
          fietsID,
          uitleendatum,
          inleverdatum
        });
      console.log('Knex insert result:', result);
      if (Array.isArray(result) && typeof result[0] === 'number' && result[0] > 0) {
        verhuurID = result[0];
        console.log('Inserted verhuurID from result:', verhuurID);
      } else {
        const maxIdRow = await getKnex()(tables.verhuur).max('verhuurID as verhuurID').first();
        verhuurID = maxIdRow.verhuurID;
        console.log('Max verhuurID after insert:', verhuurID);
      }
      return verhuurID;
    } catch (error) {
      getLogger().error('Error in create', {
        error,
      });
      throw error;
    }
  } catch (error) {
    getLogger().error('Error in create', {
      error,
    });
    throw error;
  }
};
/**
 * Update an existing transaction.
 *
 * @param {number} id - Id of the transaction to update.
 * @param {object} verhuur - The transaction to create.
 * @param {number} verhuur.klantID - Amount deposited/withdrawn.
 * @param {number} verhuur.fietsID
 * @param {string} verhuur.uitleendatum - Date of the transaction.
 * @param {string} verhuur.inleverdatum - Id of the user who did the transaction.
 *
 * @returns {Promise<number>} Transaction's id
 */
const updateById = async (id, { klantID, fietsID, uitleendatum, inleverdatum }) => {
  try {
    await getKnex()(tables.verhuur)
      .update({
        klantID, 
        fietsID, 
        uitleendatum, 
        inleverdatum
      })
      .where(`${tables.verhuur}.verhuurID`, id);
    return id;
  } catch (error) {
    getLogger().error('Error in updateById', {
      error,
    });
    throw error;
  }
};

/**
 * Delete verhuur with the given `id`.
 *
 * @param {number} id - Id of the verhuur to delete.
 *
 * @returns {Promise<boolean>} Whether the transaction was deleted.
 */
const deleteById = async (id) => {
  try {
    const rowsAffected = await getKnex()(tables.verhuur)
      .where(`${tables.verhuur}.verhuurID`, id)
      .delete();

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
  findAllByKlantId,
  findCount,
  findById,
  create,
  updateById,
  deleteById,
};
