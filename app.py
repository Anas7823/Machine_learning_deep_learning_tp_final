from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from PIL import Image
import numpy as np
import io
import json

app = Flask(__name__)
CORS(app)

# Charger les marques de voitures
try:
    with open('car_brands.json', 'r') as f:
        car_brands = json.load(f)
except FileNotFoundError:
    car_brands = ['Audi', 'Hyundai Creta', 'Mahindra Scorpio', 'Rolls Royce', 'Swift', 'Tata Safari', 'Toytota Innova']
    with open('car_brands.json', 'w') as f:
        json.dump(car_brands, f)

# Créer et charger le modèle
try:
    model = tf.keras.models.load_model('model_focal.h5')
    print("Modèle chargé avec succès!")
except Exception as e:
    print(f"Erreur lors du chargement du modèle: {e}")
    raise

@app.route('/brands', methods=['GET'])
def get_brands():
    return jsonify({'brands': car_brands})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        file = request.files['image']
        image = Image.open(file.stream)
        
        # Prétraitement de l'image
        image = image.convert('RGB')
        image = image.resize((224, 224))
        image_array = np.array(image)
        # Normaliser les valeurs des pixels
        image_array = image_array
        image_array = np.expand_dims(image_array, axis=0)
        
        # Faire la prédiction
        predictions = model.predict(image_array)
        
        # Vérifier la forme des prédictions
        if predictions.shape[1] != len(car_brands):
            raise ValueError(f"Le nombre de prédictions ({predictions.shape[1]}) ne correspond pas au nombre de marques ({len(car_brands)})")
            
        predicted_class = car_brands[np.argmax(predictions[0])]
        confidence = float(np.max(predictions[0]))
        
        # Obtenir toutes les prédictions avec vérification
        all_predictions = {}
        for idx, (brand, score) in enumerate(zip(car_brands, predictions[0].tolist())):
            if idx >= len(car_brands):
                break
            all_predictions[brand] = float(score)
        
        return jsonify({
            'prediction': predicted_class,
            'confidence': confidence,
            'all_predictions': all_predictions
        })
    
    except Exception as e:
        print(f"Erreur de prédiction détaillée: {str(e)}")
        return jsonify({
            'error': str(e),
            'details': {
                'car_brands': car_brands,
                'prediction_shape': predictions.shape[1] if 'predictions' in locals() else None
            }
        }), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)