import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [fileName, setFileName] = useState("Aucun fichier sélectionné");
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    // Charger les marques disponibles au démarrage
    fetch('http://localhost:5000/brands')
      .then(res => res.json())
      .then(data => setBrands(data.brands))
      .catch(err => console.error('Erreur lors du chargement des marques:', err));
  }, []);

  // Ajout de la fonction handleImageChange manquante
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await axios.post('http://localhost:5000/predict', formData);
      setPrediction(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="car-detector">
      <h2>Détecteur de marque de voiture</h2>
      <h4><p>By <a target='_blank' href="https://github.com/Anas7823">Anas7823</a></p></h4>
      <div className="upload-container">
        <form onSubmit={handleSubmit}>
          <div className="file-input-container">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              required 
              className="file-input"
              id="file-input"
            />
            <label htmlFor="file-input" className="file-input-label">
              {fileName}
            </label>
          </div>
          <button type="submit" className="submit-button">
            Analyser l'image
          </button>
        </form>
        {prediction && (
          <div className="prediction">
            <h3>Prédiction : {prediction.prediction}</h3>
            <div className="confidence">
              Confiance : {Math.round(prediction.confidence * 100)}%
            </div>
            <div className="all-predictions">
              {Object.entries(prediction.all_predictions)
                .sort(([,a], [,b]) => b - a)
                .map(([brand, score]) => (
                  <div key={brand} className="prediction-bar">
                    <span className="brand-name">{brand}</span>
                    <div className="bar-container">
                      <div 
                        className="bar-fill"
                        style={{width: `${score * 100}%`}}
                      />
                    </div>
                    <span className="score">{Math.round(score * 100)}%</span>
                  </div>
                ))
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;