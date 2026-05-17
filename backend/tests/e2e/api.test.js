const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { runAgent } = require('../../utils/agent-bridge');

// Mock agent bridge to prevent spawning actual processes during e2e API testing
jest.mock('../../utils/agent-bridge', () => ({
  runAgent: jest.fn()
}));

// Setup app identically to server.js but without app.listen
const app = express();
app.use(bodyParser.json());

// IoT/Grow monitoring trigger
app.get('/api/grow/status', async (req, res) => {
  try {
    const result = await runAgent('grow', { action: 'check_status' });
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

describe('E2E: /api/grow/status', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return 200 and success when runAgent succeeds', async () => {
    const mockResult = { agent: 'grow', output: { status: 'healthy' } };
    runAgent.mockResolvedValue(mockResult);

    const response = await request(app).get('/api/grow/status');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, result: mockResult });
    expect(runAgent).toHaveBeenCalledWith('grow', { action: 'check_status' });
  });

  it('should return 500 when runAgent fails', async () => {
    runAgent.mockRejectedValue(new Error('Agent grow failed'));

    const response = await request(app).get('/api/grow/status');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ success: false, error: 'Agent grow failed' });
    expect(runAgent).toHaveBeenCalledWith('grow', { action: 'check_status' });
  });
});
