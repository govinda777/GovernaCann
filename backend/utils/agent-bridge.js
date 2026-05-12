const { spawn } = require('child_process');
const path = require('path');

/**
 * Runs a CrewAI agent via a Python subprocess.
 * @param {string} agentName - The name of the agent to run.
 * @param {object} input - The input data for the agent.
 * @returns {Promise<object>} - The agent's output.
 */
function runAgent(agentName, input) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python3', [
      path.join(__dirname, '../../agents/main.py'),
      agentName,
      JSON.stringify(input)
    ]);

    let dataString = '';
    let errorString = '';

    pythonProcess.stdout.on('data', (data) => {
      dataString += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorString += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python process exited with code ${code}: ${errorString}`);
        return reject(new Error(errorString || `Agent ${agentName} failed` ));
      }
      try {
        resolve(JSON.parse(dataString));
      } catch (e) {
        resolve({ raw: dataString });
      }
    });
  });
}

module.exports = { runAgent };
