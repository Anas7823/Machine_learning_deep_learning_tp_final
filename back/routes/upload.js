const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

const router = express.Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Aucune image n\'a été uploadée.' });
    }

    const imagePath = req.file.path;
    const formData = new FormData();

    try {
        formData.append('image', fs.createReadStream(imagePath));

        const response = await axios.post('http://localhost:5000/predict', formData, {
            headers: {
                ...formData.getHeaders()
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });

        fs.unlinkSync(imagePath);
        res.json({ prediction: response.data.prediction });

    } catch (error) {
        console.error('Erreur détaillée:', error);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
        if (error.code === 'ECONNREFUSED') {
            res.status(500).json({ 
                error: 'Le serveur de prédiction n\'est pas accessible. Assurez-vous que Python fonctionne sur le port 5000.' 
            });
        } else {
            res.status(500).json({ 
                error: 'Erreur lors de la prédiction',
                details: error.message 
            });
        }
    }
});

module.exports = router;