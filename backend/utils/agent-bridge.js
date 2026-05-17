const { spawn } = require('child_process');
const path = require('path');

function logStructured(level, message, meta = {}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level: level.toUpperCase(),
    message,
    ...meta
  };
  console.log(JSON.stringify(logEntry));
}

/**
 * Runs a CrewAI agent via a Python subprocess.
 * @param {string} agentName - The name of the agent to run.
 * @param {object} input - The input data for the agent.
 * @param {number} timeoutMs - Timeout in milliseconds.
 * @returns {Promise<object>} - The agent's output.
 */
function runAgent(agentName, input, timeoutMs = 30000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    logStructured('info', `Starting agent execution`, { agentName, timeoutMs });

    const pythonProcess = spawn('python3', [
      path.join(__dirname, '../../agents/main.py'),
      agentName,
      JSON.stringify(input)
    ]);

    let dataString = '';
    let errorString = '';
    let isFinished = false;

    const timeout = setTimeout(() => {
      if (!isFinished) {
        isFinished = true;
        const duration = Date.now() - startTime;
        logStructured('error', `Agent execution timed out`, { agentName, duration });
        pythonProcess.kill('SIGTERM');
        reject(new Error(`Agent ${agentName} timed out after ${timeoutMs}ms`));
      }
    }, timeoutMs);

    pythonProcess.stdout.on('data', (data) => {
      dataString += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorString += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (isFinished) return;
      isFinished = true;
      clearTimeout(timeout);

      const duration = Date.now() - startTime;

      if (code !== 0) {
        logStructured('error', `Python process exited with error`, { agentName, code, error: errorString, duration });
        return reject(new Error(errorString || `Agent ${agentName} failed`));
      }

      try {
        const parsedData = JSON.parse(dataString);
        logStructured('info', `Agent execution successful`, { agentName, duration });
        resolve(parsedData);
      } catch (e) {
        logStructured('warn', `Failed to parse agent output as JSON`, { agentName, duration, rawOutput: dataString });
        resolve({ raw: dataString });
      }
    });

    pythonProcess.on('error', (err) => {
      if (isFinished) return;
      isFinished = true;
      clearTimeout(timeout);

      const duration = Date.now() - startTime;
      logStructured('error', `Failed to start Python process`, { agentName, error: err.message, duration });
      reject(new Error(`Failed to start Agent ${agentName}: ${err.message}`));
    });
  });
}

module.exports = { runAgent };
