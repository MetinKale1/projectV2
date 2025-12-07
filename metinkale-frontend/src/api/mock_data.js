
const LOCATIE_DATA = [
  
  {
    locatieID: 1,
    straat: 'Main Street',
    nr: 123,
    gemeente: 'City',
    postcode: 12345,
  },
  {
    locatieID: 2,
    straat: 'Elm Street',
    nr: 456,
    gemeente: 'Town',
    postcode: 67890,
  },
  
];

const FIETS_DATA = [
  
  {
    fietsID: 1,
    locatieID: 1,
    model: 'Bike A',
    type: 'City',
    status: 'Active',
    foto: '/images/cityBike.jpg',
  },
  {
    fietsID: 2,
    locatieID: 2,
    model: 'Bike B',
    type: 'Mountain',
    status: 'Active',
    foto: '/images/mountain.jpg',
  },
  {
    fietsID: 3,
    locatieID: 1,
    model: 'Bike C',
    type: 'City',
    status: 'Inactive',
    foto: '/images/cityBike.jpg',
  },
  
];
const FEEDBACK_DATA = [
  
  {
    feedbackID: 1,
    verhuurID: 1,
    omschrijving: 'Great experience',
    datum: '2023-11-05',
    rating: 5,
  },
  {
    feedbackID: 2,
    verhuurID: 2,
    omschrijving: 'Needs improvement',
    datum: '2023-11-04',
    rating: 3,
  },
  {
    feedbackID: 3,
    verhuurID: 3,
    omschrijving: 'Excellent service',
    datum: '2023-11-03',
    rating: 5,
  },
  
];

const VERHUUR_DATA = [
  
  {
    verhuurID: 1,
    klantID: 1,
    fietsID: 1,
    uitleendatum: '2023-11-03',
    inleverdatum: '2023-11-05',
    amount: 3500,
    transactionDate: '2021-05-25T17:40:00.000Z',
    placeId: 1,
    userId: 1,
  },
  {
    verhuurID: 2,
    klantID: 2,
    fietsID: 2,
    uitleendatum: '2023-11-02',
    inleverdatum: '2023-11-04',
    amount: -220,
    transactionDate: '2021-05-08T18:00:00.000Z',
    placeId: 2,
    userId: 2,
  },
  {
    verhuurID: 3,
    klantID: 1,
    fietsID: 3,
    uitleendatum: '2023-11-01',
    inleverdatum: '2023-11-03',
    amount: 4500,
    transactionDate: '2021-06-12T10:00:00.000Z',
    placeId: 1,
    userId: 1,
  },
  
];

export  {LOCATIE_DATA, FIETS_DATA, FEEDBACK_DATA,VERHUUR_DATA};