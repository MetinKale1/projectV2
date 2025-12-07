const KLANT = [
  {klantID: 1, voornaam: "Peter", achternaam: "Parker", wachtwoord: "spidey123", emailadres: "peter.parker@email.com"},
  {klantID: 2, voornaam: "Jane", achternaam: "Smith", wachtwoord: "password2", emailadres: "jane.smith@email.com"}
];

const LOCATIE = [
  {locatieID: 1, straat: "Main Street", nr: 123, gemeente: "City", postcode: 12345},
  {locatieID: 2, straat: "Elm Street", nr: 456, gemeente: "Town", postcode: 67890}
];

const FIETS = [
  {fietsID: 1, locatieID: 1, model: "Bike A", type: "City", status: "Active", foto: "link_to_photo_1"},
  {fietsID: 2, locatieID: 2, model: "Bike B", type: "Mountain", status: "Active", foto: "link_to_photo_2"},
  {fietsID: 3, locatieID: 1, model: "Bike C", type: "City", status: "Inactive", foto: "link_to_photo_3"}
];

const VERHUUR = [
  {verhuurID: 1, klantID: 1, fietsID: 1, uitleendatum: "2023-11-03", inleverdatum: "2023-11-05"},
  {verhuurID: 2, klantID: 2, fietsID: 2, uitleendatum: "2023-11-02", inleverdatum: "2023-11-04"},
  {verhuurID: 3, klantID: 1, fietsID: 3, uitleendatum: "2023-11-01", inleverdatum: "2023-11-03"}
];

const FEEDBACK = [
  {feedbackID: 1, verhuurID: 1, omschrijving: "Great experience", datum: "2023-11-05", rating: 5},
  {feedbackID: 2, verhuurID: 2, omschrijving: "Needs improvement", datum: "2023-11-04", rating: 3},
  {feedbackID: 3, verhuurID: 3, omschrijving: "Excellent service", datum: "2023-11-03", rating: 5}
];

module.exports = { KLANT, LOCATIE,FIETS,VERHUUR,FEEDBACK };