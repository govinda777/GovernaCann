const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const { runAgent } = require('./utils/agent-bridge');
const { requireAuth, requireRole } = require('./middlewares/auth');
const { createClient } = require('@sanity/client');
const cors = require('cors');

const app = express();
app.use(cors());

const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'mockProjectId', // Fallback for testing
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: false, // set to `false` to bypass the edge cache
  apiVersion: '2024-01-01', // use current date
  token: process.env.SANITY_SECRET_TOKEN || 'mockToken' // Only if you want to update content with the client
});
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

// Protected routes for physicians
// 1. Fetching patients strictly for the physician's association
app.get('/api/patients', requireAuth, requireRole('physician'), async (req, res) => {
  const associationId = req.user.associationId;
  console.log(`Fetching patients for association: ${associationId}`);

  try {
    const query = `*[_type == "patient" && associationId == $associationId]`;
    const patients = await sanityClient.fetch(query, { associationId });
    res.json({ success: true, data: patients });
  } catch (error) {
    console.error('Failed to fetch patients from Sanity:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch patients' });
  }
});

// 2. Issuing a prescription for a patient in the physician's association
app.post('/api/prescriptions', requireAuth, requireRole('physician'), async (req, res) => {
  const { patientId, medication, dosage } = req.body;
  const associationId = req.user.associationId;
  const physicianId = req.user.id;

  console.log(`Physician ${physicianId} issuing prescription for ${patientId} in association ${associationId}`);

  // Save the prescription securely to Sanity using the context from the token
  const prescriptionDoc = {
    _type: 'prescription',
    patientId,
    associationId,
    physicianId,
    medication,
    dosage,
    issueDate: new Date().toISOString()
  };

  try {
    const result = await sanityClient.create(prescriptionDoc);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Failed to save prescription to Sanity:', error);
    res.status(500).json({ success: false, error: 'Failed to save prescription' });
  }
});

app.listen(PORT, () => {
  console.log(`GovernaCann Backend running on port ${PORT}`);
});
