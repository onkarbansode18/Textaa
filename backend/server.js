const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const pdfRoutes = require('./routes/pdfRoutes');
const queryRoutes = require('./routes/queryRoutes');
const { connectToDatabase } = require('./config/mongodb');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/pdf', pdfRoutes);
app.use('/api/query', queryRoutes);

// Home route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Local PDF Knowledge Retrieval API',
    endpoints: {
      health: 'GET /api/query/health',
      uploadPDF: 'POST /api/pdf/upload',
      getDocuments: 'GET /api/pdf/documents',
      deleteDocument: 'DELETE /api/pdf/documents/:fileName',
      textQuery: 'POST /api/query/text',
      voiceQuery: 'POST /api/query/voice'
    }
  });
});

async function startServer() {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
}

startServer();
