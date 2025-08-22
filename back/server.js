const express = require('express');
const cors = require('cors');
const uploadRoute = require('./routes/upload');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/upload', uploadRoute);

const PORT = 3001;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
