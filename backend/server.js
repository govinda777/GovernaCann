const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const { runAgent } = require('./utils/agent-bridge');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Onboarding route
app.post('/api/onboarding', async (req, res) => {
  const { type, data } = req.body;
  console.log(`Onboarding ${type}...`);

  try {
    const result = await runAgent('legal', { action: 'onboard', type, ...data });
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Document submission
app.post('/api/documents', async (req, res) => {
  const { docType, patientId, content } = req.body;
  console.log(`Submitting document ${docType} for patient ${patientId}...`);

  try {
    const result = await runAgent('patient', { action: 'validate_doc', docType, patientId, content });
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// IoT/Grow monitoring trigger
app.get('/api/grow/status', async (req, res) => {
  try {
    const result = await runAgent('grow', { action: 'check_status' });
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`GovernaCann Backend running on port ${PORT}`);
});
