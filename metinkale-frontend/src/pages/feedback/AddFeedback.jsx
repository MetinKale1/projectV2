import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as feedbackApi from '../../api/feedbacks';
import './AddFeedback.css';

const AddFeedback = () => {
  const [verhuurID, setVerhuurID] = useState('');
  const [omschrijving, setOmschrijving] = useState('');
  const [rating, setRating] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!verhuurID || !omschrijving || !rating || rating < 1 || rating > 5) {
      alert('Please enter a valid verhuur ID, description, and a rating between 1 and 5.');
      return;
    }

    // Create new feedback
    const newFeedback = {
      verhuurID: Number(verhuurID),
      omschrijving,
      datum: new Date().toISOString().split('T')[0], // Current date
      rating: Number(rating),
    };

    try {
      // Add new feedback to the server
      await feedbackApi.addFeedback(newFeedback);
      console.log('New Feedback Added:', newFeedback);

      // Navigate back to feedback list
      navigate('/');
    } catch (error) {
      console.error('Error adding feedback:', error);
      alert('Failed to add feedback. Please try again.');
    }
  };

  return (
    <div className="addfeedback-container">
      <h2 className="addfeedback-title">Feedback toevoegen</h2>
      <form className="addfeedback-form" onSubmit={handleSubmit}>
        <div>
          <label>Verhuur ID:</label>
          <input
            type="number"
            value={verhuurID}
            onChange={(e) => setVerhuurID(e.target.value)}
            placeholder="Enter verhuur ID"
            required
          />
        </div>

        <div>
          <label>Feedback omschrijving:</label>
          <textarea
            value={omschrijving}
            onChange={(e) => setOmschrijving(e.target.value)}
            placeholder="Schrijf je feedback hier..."
            required
          />
        </div>

        <div>
          <label>Rating (1-5):</label>
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            min="1"
            max="5"
            placeholder="Geef een rating (1-5)"
            required
          />
        </div>

        <button className="addfeedback-form-button" type="submit">Feedback toevoegen</button>
      </form>
    </div>
  );
};

export default AddFeedback;